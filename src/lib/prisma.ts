// ===========================================
// Prisma Client Singleton
// Prevents multiple Prisma Client instances in
// development (Next.js hot-reload safe)
// ===========================================

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
    const connectionString = process.env.DATABASE_URL;

    // In Cloudflare Workers/Edge environments, we use the Neon adapter
    if (connectionString && (process.env.NODE_ENV === "production" || connectionString.includes(".neon.tech"))) {
        const pool = new Pool({ connectionString });
        const adapter = new PrismaNeon(pool as any);
        return new PrismaClient({ adapter: adapter as any });
    }

    return new PrismaClient();
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
