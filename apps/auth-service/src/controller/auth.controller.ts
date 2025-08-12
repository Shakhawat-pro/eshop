import { NextFunction, Request, Response } from "express";
import { checkOtpRestrictions, sendOtp, trackOtpRequests, validateRegistrationData, verifyOtp } from "../utils/auth.helper";
import bcrypt from "bcrypt"
import prisma from "../../../../packages/libs/prisma";
import { AuthError, ValidationError } from "../../../../packages/error-handler";
import Jwt from "jsonwebtoken";
import { setCookie } from "../utils/cookies/setCoookie";
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

// login user
export const LoginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ValidationError("Email and password are required!"));
        }

        const user = await prisma.users.findUnique({ where: { email } })

        if (!user) return next(new AuthError("User does not exist!"));

        const isPasswordValid = await bcrypt.compare(password, user.password!)

        if (!isPasswordValid) {
            return next(new AuthError("Invalid password!"));
        }

        // Generate access and refresh tokens
        const accessToken = Jwt.sign(
            { userId: user.id },
            process.env.ACCESS_TOKEN_SECRET! as string,
            { expiresIn: "15m" }
        );
        const refreshToken = Jwt.sign(
            { userId: user.id },
            process.env.REFRESH_TOKEN_SECRET! as string,
            { expiresIn: "1d" }
        );

        // store the refresh and access token in an httpOnly cookie
        setCookie(res, "refreshToken", refreshToken)
        setCookie(res, "accessToken", accessToken)

        res.status(200).json({
            success: true,
            message: "Login successful!",
            // user,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            accessToken,
            refreshToken
        });

    } catch (error) {
        return next(error)
    }
}