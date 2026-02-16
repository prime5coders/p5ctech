// ===========================================
// Newsletter Section
// Email subscription with API integration
// and inline success/error feedback
// ===========================================

"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SubState = "idle" | "submitting" | "success" | "error";

export function NewsletterSection() {
    const [state, setState] = useState<SubState>("idle");
    const [errorMsg, setErrorMsg] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setState("submitting");
        setErrorMsg("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;

        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Subscription failed");
            }

            setState("success");
            (e.target as HTMLFormElement).reset();
        } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
            setState("error");
        }
    }

    return (
        <section className="section-padding relative">
            <div className="mx-auto max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="rounded-2xl border border-border/50 bg-card/50 p-8 text-center md:p-12"
                >
                    <p className="text-sm font-medium uppercase tracking-widest text-primary">
                        Stay Updated
                    </p>
                    <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
                        Get the latest from{" "}
                        <span className="gradient-text">P5C Tech</span>
                    </h2>
                    <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
                        Subscribe to our newsletter for insights on web development,
                        design trends, and industry best practices. No spam, unsubscribe
                        anytime.
                    </p>

                    {/* Subscribe form */}
                    <form
                        onSubmit={handleSubmit}
                        className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
                    >
                        <Input
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            className="flex-1 rounded-full border-border/50 bg-background/50 px-5"
                        />
                        <Button
                            type="submit"
                            disabled={state === "submitting"}
                            className="group rounded-full bg-primary px-6 hover:bg-primary/90"
                        >
                            {state === "submitting" ? (
                                "Subscribing..."
                            ) : (
                                <>
                                    Subscribe
                                    <ArrowRight
                                        size={14}
                                        className="ml-1 transition-transform group-hover:translate-x-1"
                                    />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Feedback */}
                    {state === "success" && (
                        <p className="mt-4 flex items-center justify-center gap-2 text-sm text-green-400">
                            <CheckCircle size={14} />
                            You&apos;re subscribed! Welcome aboard.
                        </p>
                    )}
                    {state === "error" && (
                        <p className="mt-4 flex items-center justify-center gap-2 text-sm text-destructive">
                            <AlertCircle size={14} />
                            {errorMsg}
                        </p>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
