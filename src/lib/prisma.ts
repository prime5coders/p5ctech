import { PrismaNeonHTTP } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error("Error: DATABASE_URL is missing. Returning dummy Prisma Client.");
        return new Proxy({} as PrismaClient, {
            get() { throw new Error("Prisma Client is not initialized because DATABASE_URL is missing."); }
        });
    }

    const adapter = new PrismaNeonHTTP(connectionString, {
        arrayMode: false,
        fullResults: false,
    });
    return new PrismaClient({ adapter });
};

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
