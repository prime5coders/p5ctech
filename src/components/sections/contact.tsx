// ===========================================
// Contact Section — Apple-style transitions
// Form slides in from right, contact info from
// left, with smooth revealed form fields
// ===========================================

"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FormState = "idle" | "submitting" | "success" | "error";

const infoItemVariants = {
    hidden: { opacity: 0, x: -30, filter: "blur(4px)" },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        transition: {
            delay: 0.3 + i * 0.15,
            duration: 0.6,
            ease: [0.25, 0.4, 0.25, 1],
        },
    }),
};

const formFieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.3 + i * 0.1,
            duration: 0.5,
            ease: [0.25, 0.4, 0.25, 1],
        },
    }),
};

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

    const contactInfo = [
        { icon: Mail, title: "Email", value: "hello@p5ctech.com" },
        { icon: MapPin, title: "Location", value: "Remote-first, Global" },
        { icon: Clock, title: "Response Time", value: "Within 24 hours" },
    ];

    return (
        <section id="contact" className="section-padding relative">
            <div className="mx-auto max-w-7xl">
                {/* Section header — blur reveal */}
                <motion.div
                    initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
                    className="text-center"
                >
                    <motion.p
                        initial={{ opacity: 0, letterSpacing: "0.3em" }}
                        whileInView={{ opacity: 1, letterSpacing: "0.2em" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-sm font-medium uppercase text-primary"
                    >
                        Get In Touch
                    </motion.p>
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
                    {/* Contact info — staggered slide from left */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="space-y-8 lg:col-span-2"
                    >
                        {contactInfo.map((item, i) => (
                            <motion.div
                                key={item.title}
                                custom={i}
                                variants={infoItemVariants}
                                className="group flex items-start gap-4"
                            >
                                <div className="rounded-lg bg-primary/10 p-2.5 transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-110 group-hover:rotate-3">
                                    <item.icon size={20} className="text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold">{item.title}</h4>
                                    <p className="text-sm text-muted-foreground">{item.value}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Contact form — slides in from right with blur */}
                    <motion.div
                        initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
                        whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
                        className="lg:col-span-3"
                    >
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6 rounded-2xl border border-border/50 bg-card/50 p-8 transition-all duration-300 hover:border-primary/10"
                        >
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="grid gap-6 sm:grid-cols-2"
                            >
                                <motion.div custom={0} variants={formFieldVariants} className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">
                                        Name
                                    </label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="John Doe"
                                        required
                                        className="rounded-lg border-border/50 bg-background/50 transition-all duration-300 focus:border-primary/50 focus:shadow-[0_0_15px_oklch(0.78_0.12_80_/_12%)]"
                                    />
                                </motion.div>
                                <motion.div custom={1} variants={formFieldVariants} className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">
                                        Email
                                    </label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        required
                                        className="rounded-lg border-border/50 bg-background/50 transition-all duration-300 focus:border-primary/50 focus:shadow-[0_0_15px_oklch(0.78_0.12_80_/_12%)]"
                                    />
                                </motion.div>
                            </motion.div>

                            <motion.div
                                custom={2}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={formFieldVariants}
                                className="space-y-2"
                            >
                                <label htmlFor="subject" className="text-sm font-medium">
                                    Subject
                                </label>
                                <Input
                                    id="subject"
                                    name="subject"
                                    placeholder="Project Inquiry"
                                    required
                                    className="rounded-lg border-border/50 bg-background/50 transition-all duration-300 focus:border-primary/50 focus:shadow-[0_0_15px_oklch(0.78_0.12_80_/_12%)]"
                                />
                            </motion.div>

                            <motion.div
                                custom={3}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={formFieldVariants}
                                className="space-y-2"
                            >
                                <label htmlFor="message" className="text-sm font-medium">
                                    Message
                                </label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    placeholder="Tell us about your project..."
                                    rows={5}
                                    required
                                    className="resize-none rounded-lg border-border/50 bg-background/50 transition-all duration-300 focus:border-primary/50 focus:shadow-[0_0_15px_oklch(0.78_0.12_80_/_12%)]"
                                />
                            </motion.div>

                            {/* Status Messages */}
                            {formState === "success" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-sm text-green-400"
                                >
                                    <CheckCircle size={16} />
                                    Message sent successfully! We&apos;ll be in touch.
                                </motion.div>
                            )}
                            {formState === "error" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                                >
                                    <AlertCircle size={16} />
                                    {errorMessage}
                                </motion.div>
                            )}

                            {/* Submit button with hover glow */}
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    type="submit"
                                    disabled={formState === "submitting"}
                                    className="w-full rounded-full bg-primary hover:bg-primary/90 transition-all duration-300 hover:shadow-[0_0_25px_oklch(0.78_0.12_80_/_25%)]"
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
                            </motion.div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
