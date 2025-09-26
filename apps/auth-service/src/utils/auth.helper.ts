import crypto from "crypto"
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../../../packages/error-handler"
import redis from "../../../../packages/libs/redis"
import { sendEmail } from "./sendMail"
import prisma from "../../../../packages/libs/prisma";


const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const validateRegistrationData = (data: any, userType: "user" | "seller") => {
    const { name, email, password, phone_number, country } = data

    if (!name || !email || !password || (userType == "seller" && (!phone_number || !country))) {
        throw new ValidationError("Messing Required Fields!")
    }

    if (!emailRegex.test(email)) {
        throw new ValidationError("Invalid email formate!")
    }

}

export const checkOtpRestrictions = async (email: string, next: NextFunction) => {
    if (await redis.get(`otp_lock:${email}`)) {
        throw new ValidationError("Account Locked due to multiple failed attempts! Try again after 30 minutes");
    };

    const lockKey = `otp_spam_lock:${email}`;
    const ttl = await redis.ttl(lockKey); // time left in seconds
    if (ttl > 0) {
        throw new ValidationError(
            `Too many OTP requests! Please wait ${Math.ceil(ttl / 60)} minutes before requesting again.`
        );
    }

    if (await redis.get(`otp_cooldown:${email}`)) {
        throw new ValidationError("Please wait 1 minute before requesting a new otp");
    }
}

export const trackOtpRequests = async (email: string, next: NextFunction) => {
    const otpRequestKey = `otp_request_count:${email}`;
    let otpRequests = parseInt((await redis.get(otpRequestKey) || "0"))

    if (otpRequests >= 3) {
        await redis.set(`otp_spam_lock:${email}`, "locked", { ex: 1800 }) //lock for 30 minutes
        throw new ValidationError("Too many OTP Requests ! Please wait 30 minutes before Requesting again ");
    }

    await redis.set(otpRequestKey, otpRequests + 1, { ex: 1800 }) // 30 minutes expiration
}

export const sendOtp = async (name: string, email: string, template: string) => {
    const otp = crypto.randomInt(1000, 9999).toString()
    const templateSubjects: Record<string, string> = {
        "user-activation-email": "Verify Your Email",
        "forgot-password-user-email": "Reset Your Password",
        "forgot-password-seller-email": "Reset Your Password",
        "seller-activation-email": "Verify Your Email"
        // add more templates here
    };
    await sendEmail(email, templateSubjects[template], template, { name, otp })
    await redis.set(`otp: ${email}`, otp, { ex: 300 }) // 5 minutes expiration
    await redis.set(`otp_cooldown:${email}`, "true", { ex: 60 }) // 1 minute cooldown
}

export const verifyOtp = async (email: string, otp: string, next: NextFunction) => {
    const storedOtp = await redis.get(`otp: ${email}`)
    console.log({
        "storedOtp": Number(storedOtp),
        "providedOtp": Number(otp),
    });

    if (!storedOtp) {
        throw new ValidationError("OTP expired or not found! Please request a new one.")
    }
    const failedAttemptsKey = `otp_attempts${email}`
    const failedAttempts = parseInt((await redis.get(failedAttemptsKey) || "0"))


    if (Number(storedOtp) !== Number(otp)) {
        await redis.set(failedAttemptsKey, failedAttempts + 1, { ex: 300 }) // 5 minutes expiration

        if (failedAttempts >= 2) {
            await redis.set(`otp_lock:${email}`, "locked", { ex: 1800 }) // lock for 30 minutes
            await redis.del(`otp: ${email}`, failedAttemptsKey)
            throw new ValidationError("Account Locked due to multiple failed attempts! Try again after 30 minutes")
        }
        throw new ValidationError(`Invalid OTP! Please try again. ${2 - failedAttempts} attempts left before account lock.`)
    }

    await redis.del(`otp: ${email}`, failedAttemptsKey);


}

export const handleForgetPassword = async (req: Request, res: Response, next: NextFunction, userType: "user" | "seller") => {
    try {
        const { email } = req.body;
        if (!email) {
            throw new ValidationError("Email is required!");
        }

        // Find user/seller in DB
        const user = userType === "user" ? await prisma.users.findUnique({ where: { email }, select: { id: true, name: true } }) : await prisma.sellers.findUnique({ where: { email }, select: { id: true, name: true } });

        if (!user) throw new ValidationError(`${userType.charAt(0).toUpperCase() + userType.slice(1)} not found with this email!`);
        // if (!user) throw new ValidationError("User not found with this email!");

        // Check otp restriction    
        await checkOtpRestrictions(email, next)
        await trackOtpRequests(email, next)

        // Generate and send OTP
        await sendOtp(user.name, email, userType === "user" ? "forgot-password-user-email" : "forgot-password-seller-email");

        res.status(200).json({
            message: "OTP sent to email. Please verify your account."
        })

    } catch (error) {
        return next(error);
    }
};

export const verifyForgotPasswordOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            throw new ValidationError("Email and OTP are required!");
        }

        await verifyOtp(email, otp, next);

        return res.status(200).json({
            message: "OTP verified successfully. You can now reset your password."
        });

    } catch (error) {
        return next(error);
    }
}