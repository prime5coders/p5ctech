"use server";

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "@/auth";

export async function signInCredentials(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
        await nextAuthSignIn("credentials", {
            email,
            password,
            redirect: false,
        });
        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "Authentication failed" };
    }
}

export async function signInGoogle(callbackUrl?: string) {
    await nextAuthSignIn("google", { callbackUrl: callbackUrl || "/admin" });
}

export async function logOut() {
    await nextAuthSignOut({ redirectTo: "/login" });
}
