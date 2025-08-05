import crypto from "crypto"
import { NextFunction } from "express"
import { ValidationError } from "../../../../packages/error-handler"
import redis from "../../../../packages/libs/redis"


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

export const checkOtpRestrictions = (email: string, next: NextFunction) => {

}

export const sendOtp = async (email: string, next: NextFunction) => {
    const otp = crypto.randomInt(1000, 9999).toString()
    await redis.set(`otp: ${email}`, otp, { ex: 300 })
    await redis.set(`otp_cooldown:${email}`, "true", { ex: 60 })
}