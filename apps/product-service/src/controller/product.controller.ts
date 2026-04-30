import { Request, Response, NextFunction } from "express";
import prisma from "../../../../packages/libs/prisma";

// get product Categories
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const config = await prisma.site_config.findFirst()
        
    } catch (error) {
        
    }
}