// ===========================================
// Database Seed Script
// Creates a default admin user with hashed
// password. Run: npx prisma db seed
// ===========================================

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    // Default admin credentials
    const adminEmail = "admin@p5ctech.com";
    const adminPassword = "admin123"; // Change in production!

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const user = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            password: hashedPassword,
            name: "Admin",
            role: "admin",
        },
    });

    console.log(`✅ Admin user seeded: ${user.email}`);
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
