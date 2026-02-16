// ===========================================
// Admin: Contacts API Route
// GET: List all contact form submissions
// ===========================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const contacts = await prisma.contact.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ contacts, total: contacts.length });
    } catch (error) {
        console.error("[API] Fetch contacts error:", error);
        return NextResponse.json(
            { message: "Failed to fetch contacts." },
            { status: 500 }
        );
    }
}
