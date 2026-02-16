// ===========================================
// Admin: Subscribers API Route
// GET: List all newsletter subscribers
// ===========================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const subscribers = await prisma.newsletter.findMany({
            orderBy: { subscribedAt: "desc" },
        });

        return NextResponse.json({
            subscribers,
            total: subscribers.length,
            active: subscribers.filter((s: { active: boolean }) => s.active).length,
        });
    } catch (error) {
        console.error("[API] Fetch subscribers error:", error);
        return NextResponse.json(
            { message: "Failed to fetch subscribers." },
            { status: 500 }
        );
    }
}
