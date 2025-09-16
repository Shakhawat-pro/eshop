import { NextFunction, Request, Response } from "express";
import { checkOtpRestrictions, handleForgetPassword, sendOtp, trackOtpRequests, validateRegistrationData, verifyForgotPasswordOtp, verifyOtp } from "../utils/auth.helper";
import bcrypt from "bcrypt"
import prisma from "../../../../packages/libs/prisma";
import { AuthError, ValidationError } from "../../../../packages/error-handler";
import Jwt, { JsonWebTokenError } from "jsonwebtoken";
import { setCookie } from "../utils/cookies/setCoookie";


// Register a new user
const userRegistration = async (req: Request, res: Response, next: NextFunction) => {
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
const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp, name, password } = req.body;
        if (!email || !otp || !name || !password) {
            return next(new ValidationError("All fields are required!"));
        }
        const existingUser = await prisma.users.findUnique({ where: { email } })

        if (existingUser) {
            return next(new ValidationError("User already exists with this email!"));
        }
        console.log("verifying otp for", { email, otp, name, password });


        await verifyOtp(email, otp, next)
        const hashedPassword = await bcrypt.hash(String(password), 10)

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
const LoginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ValidationError("Email and password are required!"));
        }

        const user = await prisma.users.findUnique({ where: { email } })

        if (!user) return next(new AuthError("User does not exist!"));

        console.log("User :", user);
        console.log("attempting login for", { email, password });


        const isPasswordValid = await bcrypt.compare(password, user.password!);

        console.log(isPasswordValid);


        if (!isPasswordValid) {
            return next(new AuthError("Invalid password!"));
        }

        // Generate access and refresh tokens (payload must match middleware expectations)
        const accessToken = Jwt.sign(
            { id: user.id, role: "user" },
            process.env.ACCESS_TOKEN_SECRET! as string,
            { expiresIn: "15m" }
        );
        const refreshToken = Jwt.sign(
            { id: user.id, role: "user" },
            process.env.REFRESH_TOKEN_SECRET! as string,
            { expiresIn: "1d" }
        );

        // store the refresh and access token in an httpOnly cookie
        setCookie(res, "refresh_token", refreshToken)
        setCookie(res, "access_token", accessToken)

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

// refresh token
const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("Refreshing token.............");
        
        const refreshToken = req.cookies.refresh_token

        if (!refreshToken) {
            throw new ValidationError("Unauthorized! No Refresh Token.");
        }

        const decode = Jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { id: string, role: string };

        if (!decode || !decode.id || !decode.role) {
            throw new JsonWebTokenError("Forbidden! Invalid Token.")
        }

        // let account;
        // if(decode.role === "user")

        const user = await prisma.users.findUnique({ where: { id: decode.id } })

        if (!user) {
            throw new AuthError("Forbidden! User/Seller not found")
        }

        const newAccessToken = Jwt.sign(
            { id: user.id, role: "user" },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: "15m" }
        )

        setCookie(res, "access_token", newAccessToken)

        return res.status(201).json({
            success: true,
            message: "Access token refreshed successfully!",
        })
    } catch (error) {
        return next(error)
    }
}

// get logged in user
const getUser = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        next(error)
    }
}

// user forgot password
const userForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    await handleForgetPassword(req, res, next, "user")
}

// Verify forgot password otp
const verifyForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    await verifyForgotPasswordOtp(req, res, next,)
}

// reset user password 
const resetUserPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ValidationError("Email and password are required!"));
        }

        const user = await prisma.users.findUnique({ where: { email } })
        if (!user) return next(new ValidationError("User not found!"));

        // compare new password with the existing one
        const isSamePass = await bcrypt.compare(password, user.password!)

        if (isSamePass) {
            return next(new ValidationError("New password must be different from the old password!"));
        }

        // hash the new password
        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.users.update({
            where: { email },
            data: { password: hashedPassword }
        })

        res.status(200).json({
            success: true,
            message: "Password reset successfully!"
        })

    } catch (error) {
        return next(error)
    }

}


export const authController = {
    userRegistration,
    verifyUser,
    LoginUser,
    refreshToken,
    getUser,
    userForgotPassword,
    verifyForgotPassword,
    resetUserPassword
}