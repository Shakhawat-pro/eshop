import { Request, Response, NextFunction } from "express";
import prisma from "../../../../packages/libs/prisma";

// get product Categories
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const config = await prisma.site_config.findFirst()
        if (!config) {
            return res.status(404).json({ error: "Categories not found" });
        }
        return res.status(200).json({
            categories: config.categories,
            subCategories: config.subCategories
        });
    } catch (error) {
        return next(error);
    }
}