// ===========================================
// Newsletter Section — Apple-style reveal
// Card scales in from small with blur,
// input field glows on focus
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
                    initial={{ opacity: 0, y: 50, scale: 0.92, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="rounded-2xl border border-border/50 bg-card/50 p-8 text-center md:p-12 transition-all duration-500 hover:border-primary/15 hover:shadow-[0_10px_50px_oklch(0_0_0_/_30%)]"
                >
                    <motion.p
                        initial={{ opacity: 0, letterSpacing: "0.3em" }}
                        whileInView={{ opacity: 1, letterSpacing: "0.2em" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-sm font-medium uppercase text-primary"
                    >
                        Stay Updated
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-3 text-2xl font-bold tracking-tight md:text-3xl"
                    >
                        Get the latest from{" "}
                        <span className="gradient-text">P5C Tech</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground"
                    >
                        Subscribe to our newsletter for insights on web development,
                        design trends, and industry best practices. No spam, unsubscribe
                        anytime.
                    </motion.p>

                    {/* Subscribe form */}
                    <motion.form
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
                    >
                        <Input
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            className="flex-1 rounded-full border-border/50 bg-background/50 px-5 transition-all duration-300 focus:border-primary/50 focus:shadow-[0_0_20px_oklch(0.78_0.12_80_/_15%)]"
                        />
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                type="submit"
                                disabled={state === "submitting"}
                                className="group rounded-full bg-primary px-6 hover:bg-primary/90 transition-all duration-300 hover:shadow-[0_0_20px_oklch(0.78_0.12_80_/_25%)]"
                            >
                                {state === "submitting" ? (
                                    "Subscribing..."
                                ) : (
                                    <>
                                        Subscribe
                                        <ArrowRight
                                            size={14}
                                            className="ml-1 transition-transform duration-300 group-hover:translate-x-1"
                                        />
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    </motion.form>

                    {/* Feedback */}
                    {state === "success" && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 flex items-center justify-center gap-2 text-sm text-green-400"
                        >
                            <CheckCircle size={14} />
                            You&apos;re subscribed! Welcome aboard.
                        </motion.p>
                    )}
                    {state === "error" && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 flex items-center justify-center gap-2 text-sm text-destructive"
                        >
                            <AlertCircle size={14} />
                            {errorMsg}
                        </motion.p>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
