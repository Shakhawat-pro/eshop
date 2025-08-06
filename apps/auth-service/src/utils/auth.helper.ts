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
        return next(new ValidationError("Account Locked due to multiple failed attempts! Try again after 30 minutes"))
    };
    if (await redis.get(`otp_spam_lock:${email}`)) {
        return next(new ValidationError("Too many OTP Requests ! Please wait 1 hour before Requesting again"))
    };
    if (await redis.get(`otp_cooldown:${email}`)) {
        return next(new ValidationError("Please wait 1 minute before requesting a new otp"))
    }
}

export const trackOtpRequests = async (email: string, next: NextFunction) => {
    const otpRequestKey = `otp_request_count:${email}`;
    let otpRequests = parseInt((await redis.get(otpRequestKey) || "0"))

    if (otpRequests >= 2) {
        await redis.set(`otp_spam_lock:${email}`, "locked", { ex: 3600 }) //lock for one hour
        return next(new ValidationError("Too many OTP Requests ! Please wait 1 hour before Requesting again "))
    }

    await redis.set(otpRequestKey, otpRequests + 1, { ex: 3600 })
}

export const sendOtp = async (name: string, email: string, template: string) => {
    const otp = crypto.randomInt(1000, 9999).toString()
    await sendEmail(email, "Verify Your Email", template, { name, otp })
    await redis.set(`otp: ${email}`, otp, { ex: 300 })
    await redis.set(`otp_cooldown:${email}`, "true", { ex: 60 })
}
