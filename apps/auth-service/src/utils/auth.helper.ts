import crypto from "crypto"
import { NextFunction } from "express"
import { ValidationError } from "../../../../packages/error-handler"
import redis from "../../../../packages/libs/redis"
import { sendEmail } from "./sendMail"


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
        throw next(new ValidationError("Account Locked due to multiple failed attempts! Try again after 30 minutes"))
    };
    // if (await redis.get(`otp_spam_lock:${email}`)) {
    //     throw next(new ValidationError("Too many OTP Requests ! Please wait 30 minutes before Requesting again"))
    // };
    const lockKey = `otp_spam_lock:${email}`;
    const ttl = await redis.ttl(lockKey); // time left in seconds
    if (ttl > 0) {
        throw new ValidationError(
            `Too many OTP requests! Please wait ${Math.ceil(ttl / 60)} minutes before requesting again.`
        );
    }

    if (await redis.get(`otp_cooldown:${email}`)) {
        throw next(new ValidationError("Please wait 1 minute before requesting a new otp"))
    }
}

export const trackOtpRequests = async (email: string, next: NextFunction) => {
    const otpRequestKey = `otp_request_count:${email}`;
    let otpRequests = parseInt((await redis.get(otpRequestKey) || "0"))

    if (otpRequests >= 3) {
        await redis.set(`otp_spam_lock:${email}`, "locked", { ex: 1800 }) //lock for 30 minutes
        throw next(new ValidationError("Too many OTP Requests ! Please wait 30 minutes before Requesting again "))
    }

    await redis.set(otpRequestKey, otpRequests + 1, { ex: 1800 }) // 30 minutes expiration
}

export const sendOtp = async (name: string, email: string, template: string) => {
    const otp = crypto.randomInt(1000, 9999).toString()
    await sendEmail(email, "Verify Your Email", template, { name, otp })
    await redis.set(`otp: ${email}`, otp, { ex: 300 }) // 5 minutes expiration
    await redis.set(`otp_cooldown:${email}`, "true", { ex: 60 }) // 1 minute cooldown
}

export const verifyOtp = async (email: string, otp: string, next: NextFunction) => {
    const storedOtp = await redis.get(`otp: ${email}`)
    
    if (!storedOtp) {
        throw next(new ValidationError("OTP expired or not found! Please request a new one."))
    }
    const failedAttemptsKey = `otp_attempts${email}`
    const failedAttempts = parseInt((await redis.get(failedAttemptsKey) || "0"))

    if (storedOtp !== otp) {
        await redis.set(failedAttemptsKey, failedAttempts + 1, { ex: 300 }) // 5 minutes expiration

        if (failedAttempts >= 2) {
            await redis.set(`otp_lock:${email}`, "locked", { ex: 1800 }) // lock for 30 minutes
            await redis.del(`otp: ${email}`, failedAttemptsKey)
            throw next(new ValidationError("Account Locked due to multiple failed attempts! Try again after 30 minutes"))
        }
        throw next(new ValidationError(`Invalid OTP! Please try again. ${2 - failedAttempts} attempts left before account lock.`))
    }

    await redis.del(`otp: ${email}`, failedAttemptsKey);


}