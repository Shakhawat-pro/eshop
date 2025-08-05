import { PrismaClient } from "@prisma/client";


declare global {
    namespace globalThis {
        var prismaDB: PrismaClient
    }
};

const prisma = new PrismaClient()

if (process.env.NODE_ENV !== "production") global.prismaDB = prisma;

export default prisma
