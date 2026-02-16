// ===========================================
// Contact Section
// Contact form with validation, API submission,
// and success/error feedback states
// ===========================================

"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactSection() {
    const [formState, setFormState] = useState<FormState>("idle");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setFormState("submitting");
        setErrorMessage("");

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            subject: formData.get("subject") as string,
            message: formData.get("message") as string,
        };

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Something went wrong");
            }

            setFormState("success");
            (e.target as HTMLFormElement).reset();
        } catch (err) {
            setErrorMessage(
                err instanceof Error ? err.message : "Failed to send message"
            );
            setFormState("error");
        }
    }

    return (
        <section id="contact" className="section-padding relative">
            <div className="mx-auto max-w-7xl">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <p className="text-sm font-medium uppercase tracking-widest text-primary">
                        Get In Touch
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                        Let&apos;s build{" "}
                        <span className="gradient-text">something great</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                        Ready to start your next project? Drop us a message and we&apos;ll
                        get back to you within 24 hours.
                    </p>
                </motion.div>

                <div className="mt-16 grid gap-12 lg:grid-cols-5">
                    {/* Contact info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8 lg:col-span-2"
                    >
                        <div className="flex items-start gap-4">
                            <div className="rounded-lg bg-primary/10 p-2.5">
                                <Mail size={20} className="text-primary" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold">Email</h4>
                                <p className="text-sm text-muted-foreground">hello@p5ctech.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="rounded-lg bg-primary/10 p-2.5">
                                <MapPin size={20} className="text-primary" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold">Location</h4>
                                <p className="text-sm text-muted-foreground">Remote-first, Global</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="rounded-lg bg-primary/10 p-2.5">
                                <Clock size={20} className="text-primary" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold">Response Time</h4>
                                <p className="text-sm text-muted-foreground">Within 24 hours</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-3"
                    >
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6 rounded-2xl border border-border/50 bg-card/50 p-8"
                        >
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">
                                        Name
                                    </label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="John Doe"
                                        required
                                        className="rounded-lg border-border/50 bg-background/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">
                                        Email
                                    </label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        required
                                        className="rounded-lg border-border/50 bg-background/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-medium">
                                    Subject
                                </label>
                                <Input
                                    id="subject"
                                    name="subject"
                                    placeholder="Project Inquiry"
                                    required
                                    className="rounded-lg border-border/50 bg-background/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium">
                                    Message
                                </label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    placeholder="Tell us about your project..."
                                    rows={5}
                                    required
                                    className="resize-none rounded-lg border-border/50 bg-background/50"
                                />
                            </div>

                            {/* Status Messages */}
                            {formState === "success" && (
                                <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-sm text-green-400">
                                    <CheckCircle size={16} />
                                    Message sent successfully! We&apos;ll be in touch.
                                </div>
                            )}
                            {formState === "error" && (
                                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                                    <AlertCircle size={16} />
                                    {errorMessage}
                                </div>
                            )}

                            {/* Submit button */}
                            <Button
                                type="submit"
                                disabled={formState === "submitting"}
                                className="w-full rounded-full bg-primary hover:bg-primary/90"
                            >
                                {formState === "submitting" ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                                        Sending...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Send size={16} />
                                        Send Message
                                    </span>
                                )}
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
