import { NextResponse } from "next/server";

export async function GET() {
    console.log("[DB-Test] Starting request (Pure Logic)...");

    return new Response(JSON.stringify({
        status: "success - reached function",
        env: {
            has_db_url: !!process.env.DATABASE_URL,
            node_env: process.env.NODE_ENV
        }
    }), { status: 200, headers: { "Content-Type": "application/json" } });
}
