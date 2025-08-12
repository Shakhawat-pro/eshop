import { NextFunction, Request, Response } from "express";
import { checkOtpRestrictions, sendOtp, trackOtpRequests, validateRegistrationData, verifyOtp } from "../utils/auth.helper";
import bcrypt from "bcrypt"
import prisma from "../../../../packages/libs/prisma";
import { ValidationError } from "../../../../packages/error-handler";


// Register a new user
export const userRegistration = async (req: Request, res: Response, next: NextFunction) => {
    try {
        validateRegistrationData(req.body, "user")
        const { name, email } = req.body

        const existingUser = await prisma.users.findUnique({ where: { email } });

        if (existingUser) {
            return next(new ValidationError("User already exists with this email!"))
        }

        await checkOtpRestrictions(email, next)
        await trackOtpRequests(email, next)
        await sendOtp(name, email, "user-activation-email")

        res.status(200).json({
            message: "OTP sent to email. please verify your account."
        })
    } catch (error) {
        return next(error)
    }
};

// verify user with otp

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp, name, password } = req.body;
        if (!email || !otp || !name || !password) {
            return next(new ValidationError("All fields are required!"));
        }
        const existingUser = await prisma.users.findUnique({ where: { email } })

        if (existingUser) {
            return next(new ValidationError("User already exists with this email!"));
        }

        await verifyOtp(email, otp, next)
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }
        })

        res.status(201).json({
            success: true,
            message: "User registered successfully!",
            user
        });

    } catch (error) {
        return next(error)
    }
}