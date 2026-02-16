// ===========================================
// Newsletter API Route
// POST: Subscribe email (deduplicated)
// ===========================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email } = body;

        // --- Validation ---
        if (!email) {
            return NextResponse.json(
                { message: "Email is required." },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: "Please provide a valid email address." },
                { status: 400 }
            );
        }

        // --- Check for duplicate ---
        const existing = await prisma.newsletter.findUnique({
            where: { email },
        });

        if (existing) {
            // Reactivate if previously unsubscribed
            if (!existing.active) {
                await prisma.newsletter.update({
                    where: { email },
                    data: { active: true },
                });
                return NextResponse.json(
                    { message: "Welcome back! You've been re-subscribed." },
                    { status: 200 }
                );
            }
            return NextResponse.json(
                { message: "You're already subscribed!" },
                { status: 200 }
            );
        }

        // --- Subscribe ---
        await prisma.newsletter.create({ data: { email } });

        return NextResponse.json(
            { message: "Successfully subscribed!" },
            { status: 201 }
        );
    } catch (error) {
        console.error("[API] Newsletter subscription error:", error);
        return NextResponse.json(
            { message: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}
