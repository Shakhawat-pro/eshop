import { Response, NextFunction } from "express";
import prisma from "../libs/prisma";
import Jwt from "jsonwebtoken";

const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
    try {
        console.log("Middleware isAuthenticated called");

        const token =
            req.cookies["access_token"] ||
            req.cookies["seller_access_token"] ||
            req.headers.authorization?.split(" ")[1];

        console.log("Token found:", token);
        console.log("cookies", req.cookies);
        console.log("header", req.headers);

        if (!token) {
            return res.status(401).json({ susses: false, message: "Unauthorized! Token missing." });
        }

        // Verify token
        const decoded = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { id: string, role: string };
        // console.log("Decoded token:", decoded);


        if (!decoded) {
            return res.status(403).json({ susses: false, message: "Unauthorized! Invalid Token." });
        }

        let account;
        if (decoded.role === "user") {
            account = await prisma.users.findUnique({
                where: { id: decoded.id }
            });
        }
        else if (decoded.role === "seller") {
            account = await prisma.sellers.findUnique({
                where: { id: decoded.id },
                include: { shop: true }
            });
        }
        if (!account) return res.status(404).json({ susses: false, message: "Account not found." });

        req.user = account;
        req.role = decoded.role;

        return next();

    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Access token expired" , error: error});
        }
        return res.status(401).json({ message: "Invalid token" });
    }

}

export default isAuthenticated;

