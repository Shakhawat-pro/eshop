import { NextFunction, Request, Response } from "express";
import { checkOtpRestrictions, handleForgetPassword, sendOtp, trackOtpRequests, validateRegistrationData, verifyForgotPasswordOtp, verifyOtp } from "../utils/auth.helper";
import bcrypt from "bcrypt"
import prisma from "../../../../packages/libs/prisma";
import { AuthError, ValidationError } from "../../../../packages/error-handler";
import Jwt, { JsonWebTokenError } from "jsonwebtoken";
import { setCookie } from "../utils/cookies/setCoookie";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil"
});

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
            { expiresIn: "7d" }
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

        let account;
        if (decode.role === "user") {
            account = await prisma.users.findUnique({ where: { id: decode.id } })
        } else if (decode.role === "seller") {
            account = await prisma.sellers.findUnique({ where: { id: decode.id } })
        }
        if (!account) {
            throw new AuthError("Account does not exist!")
        }

        // console.log("Account found:", account);
        // Generate new access token
        const newAccessToken = Jwt.sign(
            { id: decode.id, role: decode.role },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: "15m" }
        );

        const cookieName = decode.role === "user" ? "access_token" : "seller_access_token";
        setCookie(res, cookieName, newAccessToken);

        // setCookie(res, "access_token", newAccessToken);

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

// Register a new seller
const registerSeller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email } = req.body
        if (!name || !email) {
            throw new ValidationError("Name and email are required!")
        }

        const existingSeller = await prisma.sellers.findUnique({ where: { email }, select: { email: true } })
        console.log(existingSeller);


        if (existingSeller) {
            throw new ValidationError("Seller already exists with this email!")
        }

        await checkOtpRestrictions(email, next)
        await trackOtpRequests(email, next)
        await sendOtp(name, email, "seller-activation-email")

        res.status(200).json({
            success: true,
            message: "Otp sen to email. Please verify your account."
        })
    }
    catch (error) {
        return next(error)
    }
}

// verify seller with otp
const verifySeller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp, name, phone_number, country, password } = req.body;
        if (!email || !otp || !name || !phone_number || !country || !password) {
            throw new ValidationError("All fields are required!");
        }
        const existingSeller = await prisma.sellers.findUnique({ where: { email }, select: { id: true } })
        if (existingSeller) {
            throw new ValidationError("Seller already exists with this email!");
        }
        console.log("verifying otp for", { email, otp, name, phone_number, country, password });
        await verifyOtp(email, otp, next)
        const hashedPassword = await bcrypt.hash(String(password), 10)

        const seller = await prisma.sellers.create({
            data: {
                name,
                email,
                phone_number,
                country,
                password: hashedPassword,
            }
        })

        res.status(201).json({
            success: true,
            message: "Seller registered successfully!",
            seller
        });
    } catch (error) {
        return next(error)

    }
}

// create a new shop
const createShop = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, bio, address,  opening_hours, website, category, sellerId } = req.body;

        console.log("Creating shop with data:", { name, bio, address,  opening_hours, website, category, sellerId });
        
        
        if (!name || !bio || !address || !opening_hours || !category || !sellerId) {
            return next(new ValidationError("All fields are required!"));
        }


        const shopData: any = {
            name,
            bio,
            address,
            opening_hours,
            category,
            sellerId
        }

        if (website && website.trim() !== "") {
            shopData.website = website;
        }

        const shop = await prisma.shops.create({
            data: shopData
        })


        res.status(201).json({
            success: true,
            message: "Shop created successfully!",
            shop
        });
    } catch (error) {
        return next(error)
    }
}

//  create stripe connect account link
const createStripeConnectLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const { sellerId } = req.body;
        if (!sellerId) {
            throw new ValidationError("Seller ID is required");
        }
        
        const seller = await prisma.sellers.findUnique({ where: { id: sellerId } })
        
        if (!seller) throw new ValidationError("Seller is not available with this id");
        
        console.log("Create Stripe Connect Link called");
        const account = await stripe.accounts.create({
            type: 'express',
            email: seller.email!,
            // country: seller.country || 'US',
            // country: 'BD',
            country: 'US',
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
        })

        await prisma.sellers.update({
            where: { id: sellerId },
            data: { stripeId: account.id }
        })

        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `http://localhost:3000/success`,
            return_url: `http://localhost:3000/success`,
            // return_url: `http://localhost:3000/seller/dashboard`,
            // refresh_url: process.env.STRIPE_REDIRECT_URL! as string,
            // return_url: process.env.STRIPE_REDIRECT_URL! as string,
            type: 'account_onboarding',

        });

        res.status(200).json({
            success: true,
            url: accountLink.url
        });

    } catch (error) {
        return next(error)
    }
}

// login seller
const LoginSeller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ValidationError("Email and password are required!"));
        }
        const seller = await prisma.sellers.findUnique({ where: { email } })

        if (!seller) return next(new AuthError("Seller does not exist!"));

        const isPasswordValid = await bcrypt.compare(password, seller.password!);

        if (!isPasswordValid) {
            return next(new AuthError("Invalid password!"));
        }

        // Generate access and refresh tokens (payload must match middleware expectations)
        const accessToken = Jwt.sign(
            { id: seller.id, role: "seller" },
            process.env.ACCESS_TOKEN_SECRET! as string,
            { expiresIn: "15m" }
        );
        const refreshToken = Jwt.sign(
            { id: seller.id, role: "seller" },
            process.env.REFRESH_TOKEN_SECRET! as string,
            { expiresIn: "7d" }
        );

        // store the refresh and access token in an httpOnly cookie
        setCookie(res, "seller_refresh_token", refreshToken)
        setCookie(res, "seller_access_token", accessToken)

        res.status(200).json({
            success: true,
            message: "Login successful!",
            user: {
                id: seller.id,
                email: seller.email,
                name: seller.name
            },
            accessToken,
            refreshToken
        });


    }
    catch (error) {
        return next(error)
    }
}

// get logged in seller
const getSeller = async (req: any, res: Response, next: NextFunction) => {
    try {
        const seller = req.seller;
        res.status(200).json({
            success: true,
            seller
        });
    } catch (error) {
        next(error)
    }
}

// export 
export const authController = {
    userRegistration,
    verifyUser,
    LoginUser,
    refreshToken,
    getUser,
    userForgotPassword,
    verifyForgotPassword,
    resetUserPassword,
    registerSeller,
    verifySeller,
    createShop,
    createStripeConnectLink,
    LoginSeller,
    getSeller
}