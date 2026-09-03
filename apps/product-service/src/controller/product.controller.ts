import { Request, Response, NextFunction } from "express";
import prisma from "../../../../packages/libs/prisma";
import { ValidationError } from "../../../../packages/error-handler";
import { imagekitClient } from "../../../../packages/libs/imageKit";

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
                discountValue: parseFloat(discountValue), // Ensure it's stored as a number
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

// upload product images
export const uploadProductImage = async (req: any, res: Response, next: NextFunction) => {
    try {
        const file = req.file;
        if (!file) {
            return next(new ValidationError("Image file is required"));
        }

        // return res.status(200).json({
        //     message: "Image upload endpoint hit successfully",
        //     file_name: req.file.originalname
        // });

        console.log(file.originalname, "file name log")
        const base64 = file.buffer.toString("base64");

        // console.log(base64, "base64")


        const response = await imagekitClient.files.upload({
            file: base64,
            fileName: `product-images/${Date.now()}.jpg`,
            folder: "/products"
        });

        res.status(200).json({
            file_url: response.url,
            fileId: response.fileId
        });

    } catch (error) {
        console.log(error, "errorI")
        return next(error);
    }
}

// delete product image from imagekit
export const deleteProductImage = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { fileId } = req.body;
        if (!fileId) {
            return next(new ValidationError("fileId is required"));
        }
        const response = await imagekitClient.files.delete(fileId);

        res.status(200).json({
            success: true,
            response
        });

    } catch (error) {
        next(error);
    }
}

// create product
export const createProduct = async (req: any, res: Response, next: NextFunction) => {
    try {
        const {
            title,
            short_description,
            detail_description,
            warranty,
            custom_specifications,
            slug,
            tags,
            cash_on_delivery,
            brand,
            video_url,
            category,
            subCategory,
            colors = [],
            sizes = [],
            discountCodes = [],
            stock_quantity,
            sale_price,
            regular_price,
            custom_properties = [],
            images = [],
        } = req.body;

        const requiredFields = {
            title,
            short_description,
            slug,
            category,
            subCategory,
            stock_quantity,
            sale_price,
            regular_price,
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => value === undefined || value === null || value === "")
            .map(([key]) => key);

        if (!images?.length) {
            missingFields.push("images");
        }

        if (missingFields.length) {
            return next(new ValidationError(`Missing required fields: ${missingFields.join(", ")}`));
        }

        if (!req.seller?.id) {
            return next(new ValidationError("Only sellers can create products"));
        }

        const shop = await prisma.shops.findUnique({
            where: { sellerId: req.seller.id },
        });

        if (!shop) {
            return next(new ValidationError("Shop not found for this seller"));
        }

        const slugChecking = await prisma.products.findUnique({
            where: { slug }
        });

        if (slugChecking) {
            return next(new ValidationError("Slug already exists"));
        }

        // ✅ clean image mapping
        const imageRecords = images
            .filter((img: any) => img?.fileId && img?.file_url)
            .map((img: any) => ({
                file_id: img.fileId,
                url: img.file_url,
            }));

        const newProduct = await prisma.products.create({
            data: {
                title,
                slug,
                category,
                subCategory,
                short_description,
                detail_description,
                warranty,
                video_url,
                brand,
                colors,
                sizes,
                cash_on_delivery,
                custom_properties,
                custom_specifications,

                tags: Array.isArray(tags)
                    ? tags
                    : tags?.split(",").map((t: string) => t.trim()),

                discount_code: discountCodes,

                stock_quantity: Number(stock_quantity),
                sale_price: Number(sale_price),
                regular_price: Number(regular_price),

                shopId: shop.id,

                // ✅ IMPORTANT CHANGE (new model)
                images: {
                    create: imageRecords.map((img: any) => ({
                        file_id: img.file_id,
                        url: img.url,
                    }))
                },
            },
            include: {
                images: true
            }
        });

        return res.status(201).json({
            success: true,
            product: newProduct
        });

    } catch (error) {
        return next(error);
    }
};

// get logged in seller products
export const getShopProducts = async (req: any, res: Response, next: NextFunction) => {
    try {
        if (!req.seller?.id) {
            return next(new ValidationError("Only sellers can access their products"));
        }

        const shopId = req.seller.shop.id;
        const {
            search,
            status,
            category,
            sortBy = 'updatedAt',
            sortOrder = 'desc',
        } = req.query as Record<string, string>;

        const whereBase = { shopId };

        const whereFiltered = {
            ...whereBase,
            ...(status   && { status: { equals: status as any } }),
            ...(category && { category: { equals: category, mode: 'insensitive' as const } }),
            ...(search && {
                OR: [
                    { title:    { contains: search, mode: 'insensitive' as const } },
                    { slug:     { contains: search, mode: 'insensitive' as const } },
                    { category: { contains: search, mode: 'insensitive' as const } },
                ],
            }),
        };

        const allowedSortFields = ['updatedAt', 'createdAt', 'sale_price', 'stock_quantity', 'rating'] as const;
        const safeSortBy = allowedSortFields.includes(sortBy as any) ? sortBy : 'updatedAt';
        const safeSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

        const [products, total, active, lowStock] = await prisma.$transaction([
            prisma.products.findMany({
                where: whereFiltered,
                include: { images: true },
                orderBy: { [safeSortBy]: safeSortOrder },
            }),
            prisma.products.count({ where: whereBase }),
            prisma.products.count({ where: { ...whereBase, status: 'active' } }),
            prisma.products.count({ where: { ...whereBase, stock_quantity: { lte: 5 } } }),
        ]);

        // Distinct categories from ALL shop products for the filter dropdown
        const categoryAgg = await prisma.products.groupBy({
            by: ['category'],
            where: whereBase,
        });
        const categories = categoryAgg.map((c) => c.category);

        const avgRating = products.length
            ? parseFloat((products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1))
            : 0;

        return res.status(200).json({
            success: true,
            products,
            stats: { total, active, lowStock, avgRating },
            meta: { categories },
        });

    } catch (error) {
        return next(error);
    }
};