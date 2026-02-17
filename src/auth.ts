import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"

console.log("[Auth] Initializing NextAuth. AUTH_SECRET present:", !!process.env.AUTH_SECRET)

import Google from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    trustHost: true,
    secret: process.env.AUTH_SECRET,
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID || "",
            clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id
                token.role = (user as any).role
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                // session.user.role = token.role as string // Extend session type if needed
            }
            return session
        },
    },
    pages: {
        signIn: "/login",
    },
})
