// ===========================================
// Contact API Route
// POST: Validate and save contact form data
// ===========================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, subject, message } = body;

        // --- Validation ---
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { message: "All fields are required." },
                { status: 400 }
            );
        }

        // Basic email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: "Please provide a valid email address." },
                { status: 400 }
            );
        }

        // --- Persist ---
        const contact = await prisma.contact.create({
            data: { name, email, subject, message },
        });

        return NextResponse.json(
            { message: "Message received! We'll be in touch.", id: contact.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("[API] Contact submission error:", error);
        return NextResponse.json(
            { message: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}
