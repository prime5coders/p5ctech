import NextAuth from "next-auth"
// PrismaAdapter import removed - causes Cloudflare Workers crash (TypeError: Cannot read 'default')
// Google OAuth users are upserted manually in signIn callback instead

console.log("[Auth] Initializing NextAuth. AUTH_SECRET present:", !!process.env.AUTH_SECRET)

import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
// bcryptjs imported dynamically inside authorize() for Cloudflare Workers compatibility
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
    // PrismaAdapter commented out for Cloudflare Workers compatibility.
    // The adapter import chain causes TypeError at worker startup.
    // Google OAuth users are handled via the signIn callback below.
    // adapter: PrismaAdapter(prisma),
    trustHost: true,
    secret: process.env.AUTH_SECRET,
    debug: true,
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID || "",
            clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                });

                if (!user || !user.password) {
                    return null;
                }

                const bcrypt = await import("bcryptjs");
                const isValidPassword = await bcrypt.default.compare(
                    credentials.password as string,
                    user.password
                );

                if (!isValidPassword) {
                    return null;
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            console.log("[Auth] SignIn Attempt:", { userEmail: user?.email, provider: account?.provider });

            // For Google OAuth: upsert user in DB since PrismaAdapter is disabled
            if (account?.provider === "google" && user?.email) {
                try {
                    const existingUser = await prisma.user.findUnique({
                        where: { email: user.email },
                    });

                    if (!existingUser) {
                        const newUser = await prisma.user.create({
                            data: {
                                email: user.email,
                                name: user.name || profile?.name || "User",
                                image: (profile as any)?.picture || user.image,
                                emailVerified: new Date(),
                                role: "admin",
                            },
                        });
                        user.id = newUser.id;
                        console.log("[Auth] Created Google user:", newUser.email);
                    } else {
                        user.id = existingUser.id;
                        (user as any).role = existingUser.role;
                        console.log("[Auth] Found existing user:", existingUser.email);
                    }
                } catch (error) {
                    console.error("[Auth] Google user upsert error:", error);
                    // Still allow sign-in even if DB fails
                }
            }

            return true;
        },
        async jwt({ token, user, account }) {
            try {
                if (user) {
                    token.id = user.id
                    token.role = (user as any).role
                }
                return token
            } catch (error) {
                console.error("[Auth] JWT Callback Error:", error);
                return token;
            }
        },
        async session({ session, token }) {
            try {
                if (session.user) {
                    session.user.id = token.id as string
                }
                return session
            } catch (error) {
                console.error("[Auth] Session Callback Error:", error);
                return session;
            }
        },
    },
    events: {
        async linkAccount({ user, account, profile }) {
            console.log("[Auth] Account Linked:", user.email);
        },
        async createUser({ user }) {
            console.log("[Auth] User Created:", user.email);
        },
    },
    pages: {
        signIn: "/login",
        error: "/login", // Redirect errors back to login with query params
    },
})
