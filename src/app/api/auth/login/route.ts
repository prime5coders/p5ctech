// ===========================================
// Auth Login API Route
// POST: Validate credentials against the
// database using bcrypt password comparison
// ===========================================

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        // --- Validation ---
        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required." },
                { status: 400 }
            );
        }

        // --- Look up user in database ---
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Invalid email or password." },
                { status: 401 }
            );
        }

        // --- Compare hashed password ---
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return NextResponse.json(
                { message: "Invalid email or password." },
                { status: 401 }
            );
        }

        // --- Set session cookie on success ---
        const response = NextResponse.json(
            {
                message: "Login successful.",
                user: { id: user.id, name: user.name, email: user.email, role: user.role },
            },
            { status: 200 }
        );

        response.cookies.set("admin_session", user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return response;
    } catch (error) {
        console.error("[API] Login error:", error);
        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}
