import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const { nextUrl, cookies } = req;

    // Auth.js uses these cookies depending on the environment (HTTP vs HTTPS)
    const hasSessionToken = cookies.has("authjs.session-token") || cookies.has("__Secure-authjs.session-token");

    // Is it an auth route? (login, signup)
    const isAuthRoute = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/signup");

    // Is it a protected route? (admin)
    const isProtectedRoute = nextUrl.pathname.startsWith("/admin");

    if (isAuthRoute) {
        if (hasSessionToken) {
            return NextResponse.redirect(new URL("/admin", nextUrl));
        }
        return NextResponse.next();
    }

    if (isProtectedRoute) {
        if (!hasSessionToken) {
            return NextResponse.redirect(new URL("/login", nextUrl));
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
