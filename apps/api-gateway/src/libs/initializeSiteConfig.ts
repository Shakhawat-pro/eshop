import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


const initializeSiteConfig = async () => {
    try {
        const existingConfig = await prisma.site_config.findFirst();
        if (!existingConfig) {
            await prisma.site_config.create({
                data: {
                    categories: [
                        "Electronics",
                        "Fashion",
                        "Home & Kitchen",
                        "Books",
                        "Toys & Games",
                        "Sports & Fitness",
                    ],
                    subCategories: {
                        "Electronics": ["Mobile Phones", "Laptops", "Cameras"],
                        "Fashion": ["Men's Clothing", "Women's Clothing", "Accessories"],
                        "Home & Kitchen": ["Furniture", "Appliances", "Decor"],
                        "Books": ["Fiction", "Non-Fiction", "Children's Books"],
                        "Toys & Games": ["Action Figures", "Board Games", "Puzzles"],
                        "Sports & Fitness": ["Exercise Equipment", "Outdoor Gear", "Athletic Wear"],
                    }
                }
            });
            console.log("Site config initialized successfully.");
        } else {
            console.log("Site config already exists. Skipping initialization.");
        }
    } catch (error) {
        console.error("Error initializing site config:", error);
    }
}


export default initializeSiteConfig;