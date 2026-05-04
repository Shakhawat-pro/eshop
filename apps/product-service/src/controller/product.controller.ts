import { Request, Response, NextFunction } from "express";
import prisma from "../../../../packages/libs/prisma";
import { ValidationError } from "../../../../packages/error-handler";

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

export const createDiscountCodes = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { public_name, discountType, discountValue, discountCode } = req.body;

        const isDiscountCodeExists = await prisma.discount_codes.findUnique({ where: { discountCode: discountCode } });

        if (isDiscountCodeExists) {
            return next(new ValidationError("Discount code already exists"));
        };

        const discount_code = await prisma.discount_codes.create({
            data: {
                public_name,
                discountType,
                discountValue,
                discountCode,
                sellerId: req.seller?.id
            }
        });

        return res.status(201).json({ discount_code });

    } catch (error) {
        return next(error);
    }
}

export const getDiscountCodes = async (req: any, res: Response, next: NextFunction) => {
    try {
        const discount_codes = await prisma.discount_codes.findMany({
            where: {
                sellerId: req.seller?.id
            }
        });
        // console.log(discount_codes ,"discount_codes log")

        return res.status(200).json({ discount_codes });

    } catch (error) {
        return next(error);
    }
}

export const deleteDiscountCode = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const sellerId = req.seller?.id;

        // const discount_code = await prisma.discount_codes.findUnique({
        //     where: { id },
        //     select: { id: true, sellerId: true }
        // });

        // if (!discount_code) {
        //     return next(new ValidationError("Discount code not found"));
        // }

        // if (discount_code.sellerId !== sellerId) {
        //     return next(new ValidationError("You are not the owner of this discount code"));
        // }

        // await prisma.discount_codes.delete({
        //     where: { id }
        // });

        // return res.status(200).json({ message: "Discount code deleted successfully" });

        const deleted = await prisma.discount_codes.deleteMany({
            where: {
                id,
                sellerId
            }
        });

        if (deleted.count === 0) {
            return next(new ValidationError("Not found or not authorized"));
        }

        return res.status(200).json({
            message: "Discount code deleted successfully"
        });

    } catch (error) {
        return next(error);
    }
}