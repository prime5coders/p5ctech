// ===========================================
// Hero Section
// Animated headline with gradient text,
// floating grid background, and CTA buttons
// ===========================================

"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stats } from "@/lib/data";

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-grid opacity-40" />
            <div className="absolute inset-0 bg-hero-gradient" />

            {/* Floating orbs */}
            <motion.div
                className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
                animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-chart-4/10 blur-3xl"
                animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground"
                >
                    <Sparkles size={14} className="text-primary" />
                    <span>Now accepting projects for Q2 2026</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
                >
                    We build{" "}
                    <span className="gradient-text">digital experiences</span>
                    <br />
                    that drive growth
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
                >
                    Full-stack web development agency crafting high-performance applications
                    with Next.js, React, and TypeScript. From concept to launch.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
                >
                    <Button
                        asChild
                        size="lg"
                        className="group rounded-full bg-primary px-8 text-base hover:bg-primary/90 glow"
                    >
                        <a href="/login">
                            Start a Project
                            <ArrowRight
                                size={16}
                                className="ml-2 transition-transform group-hover:translate-x-1"
                            />
                        </a>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="rounded-full border-border/50 px-8 text-base hover:bg-secondary"
                    >
                        <a href="#portfolio">View Our Work</a>
                    </Button>
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-4"
                >
                    {stats.map((stat, i) => (
                        <div key={i} className="space-y-1">
                            <p className="text-2xl font-bold gradient-text md:text-3xl">
                                {stat.value}
                            </p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
