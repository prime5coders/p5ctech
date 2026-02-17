"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    async function handleGoogleLogin() {
        setGoogleLoading(true);
        setError("");
        try {
            await signIn("google", { callbackUrl: "/admin" });
        } catch (err) {
            setError("Google sign-in failed. Please try again.");
            setGoogleLoading(false);
        }
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                throw new Error("Invalid email or password");
            }

            // Redirect to admin dashboard on success
            router.push("/admin");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
            setLoading(false);
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
            {/* Background effects */}
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="absolute inset-0 bg-hero-gradient" />

            {/* Floating orbs */}
            <motion.div
                className="absolute top-1/3 left-1/5 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
                animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-1/3 right-1/5 h-80 w-80 rounded-full bg-chart-4/10 blur-3xl"
                animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Login card */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="rounded-2xl border border-border/50 bg-card/60 p-8 shadow-2xl backdrop-blur-xl md:p-10">
                    {/* Logo & heading */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 glow">
                            <span className="text-lg font-bold gradient-text">P5</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Sign in to access the admin dashboard
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Google Login Button */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleGoogleLogin}
                            disabled={googleLoading || loading}
                            className="w-full relative overflow-hidden group hover:bg-background/80 hover:text-foreground transition-all duration-300"
                        >
                            {googleLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                                    Connecting...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Sign in with Google
                                </span>
                            )}
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border/50" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email */}
                            <div className="space-y-2">
                                <label htmlFor="login-email" className="text-sm font-medium">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail
                                        size={16}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    />
                                    <Input
                                        id="login-email"
                                        name="email"
                                        type="email"
                                        placeholder="admin@p5ctech.com"
                                        required
                                        className="rounded-lg border-border/50 bg-background/50 pl-10"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="login-password" className="text-sm font-medium">
                                        Password
                                    </label>
                                    <a
                                        href="#"
                                        className="text-xs text-primary hover:text-primary/80 transition-colors"
                                    >
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Lock
                                        size={16}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    />
                                    <Input
                                        id="login-password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        required
                                        className="rounded-lg border-border/50 bg-background/50 pl-10 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Error message */}
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
                                >
                                    {error}
                                </motion.p>
                            )}

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={loading || googleLoading}
                                className="group w-full rounded-lg bg-primary hover:bg-primary/90 glow"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                                        Signing in...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Sign in
                                        <ArrowRight
                                            size={16}
                                            className="transition-transform group-hover:translate-x-0.5"
                                        />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-border/50" />
                        <span className="text-xs text-muted-foreground">or</span>
                        <div className="h-px flex-1 bg-border/50" />
                    </div>

                    {/* Sign up link */}
                    <p className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <a
                            href="/signup"
                            className="font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                            Create account
                        </a>
                    </p>

                    <div className="mt-4 text-center">
                        <a
                            href="/"
                            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                        >
                            ← Back to website
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
