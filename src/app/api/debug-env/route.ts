
import { NextResponse } from 'next/server';

export async function GET() {
    const envVars = {
        DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Missing',
        AUTH_SECRET: process.env.AUTH_SECRET ? 'Set' : 'Missing',
        AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID ? 'Set' : 'Missing',
        AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET ? 'Set' : 'Missing',
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ? 'Set' : 'Missing',
        NODE_ENV: process.env.NODE_ENV,
    };

    return NextResponse.json({
        status: 'Debug check',
        env: envVars,
    });
}
