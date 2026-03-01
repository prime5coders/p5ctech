// ===========================================
// Hero Section — Apple-style cinematics
// Smooth scale-in, blur-to-clear text reveal,
// parallax orbs, and staggered stat counters
// ===========================================

"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stats } from "@/lib/data";
import { useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";

const HeroGridScene = dynamic(() => import("@/components/3d/hero-grid-scene"), {
    ssr: false,
    loading: () => null,
});

const letterVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            delay: 3.5 + i * 0.03, // Start fading in after the 3D grid animation forms
            duration: 0.6,
            ease: "easeOut" as const,
        },
    }),
};

export function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });

    const { status } = useSession();
    const ctaHref = status === "authenticated" ? "/#contact" : "/login?callbackUrl=/#contact";

    // Parallax transforms
    const yOrb1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
    const yOrb2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const yContent = useTransform(scrollYProgress, [0, 1], [0, 80]);
    const opacityContent = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scaleContent = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

    const titleLine1 = "We build ";
    const titleHighlight = "digital experiences";
    const titleLine2 = "that drive growth";

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background cinematic grid scene */}
            <HeroGridScene />

            {/* Content with parallax */}
            <motion.div
                style={{ y: yContent, opacity: opacityContent, scale: scaleContent }}
                className="relative z-10 mx-auto max-w-5xl px-4 text-center"
            >
                {/* Badge — slide up + scale */}
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.7, delay: 3.2, ease: "easeOut" }}
                    className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground"
                >
                    <motion.span
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                        <Sparkles size={14} className="text-primary" />
                    </motion.span>
                    <span>Now accepting projects for Q2 2026</span>
                </motion.div>

                {/* Headline — character-by-character blur reveal */}
                <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                    {titleLine1.split("").map((char, i) => (
                        <motion.span
                            key={`l1-${i}`}
                            custom={i}
                            initial="hidden"
                            animate="visible"
                            variants={letterVariants}
                            style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
                        >
                            {char}
                        </motion.span>
                    ))}
                    <br className="hidden sm:block" />
                    <span className="gradient-text">
                        {titleHighlight.split("").map((char, i) => (
                            <motion.span
                                key={`hl-${i}`}
                                custom={i + titleLine1.length}
                                initial="hidden"
                                animate="visible"
                                variants={letterVariants}
                                style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
                            >
                                {char}
                            </motion.span>
                        ))}
                    </span>
                    <br />
                    {titleLine2.split("").map((char, i) => (
                        <motion.span
                            key={`l2-${i}`}
                            custom={i + titleLine1.length + titleHighlight.length}
                            initial="hidden"
                            animate="visible"
                            variants={letterVariants}
                            style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
                        >
                            {char}
                        </motion.span>
                    ))}
                </h1>

                {/* Subtitle — fade in from blur */}
                <motion.p
                    initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, delay: 4.5, ease: "easeOut" }}
                    className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
                >
                    Full-stack web development agency crafting high-performance applications
                    with Next.js, React, and TypeScript. From concept to launch.
                </motion.p>

                {/* CTA Buttons — spring animation */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 4.7, type: "spring", stiffness: 100 }}
                    className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
                >
                    <Button
                        asChild
                        size="lg"
                        className="group rounded-full bg-primary px-8 text-base hover:bg-primary/90 glow transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_oklch(0.78_0.12_80_/_25%)]"
                    >
                        <a href={ctaHref}>
                            Start a Project
                            <ArrowRight
                                size={16}
                                className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </a>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="rounded-full border-border/50 px-8 text-base hover:bg-secondary transition-all duration-300 hover:scale-105"
                    >
                        <a href="#portfolio">View Our Work</a>
                    </Button>
                </motion.div>

                {/* Stats Bar — staggered counter reveal */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 4.9 }}
                    className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-4"
                >
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                                duration: 0.6,
                                delay: 5.1 + i * 0.15,
                                ease: "easeOut" as const,
                            }}
                            className="space-y-1"
                        >
                            <p className="text-2xl font-bold gradient-text md:text-3xl">
                                {stat.value}
                            </p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 5.8, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-2 text-muted-foreground/50"
                >
                    <span className="text-xs uppercase tracking-widest">Scroll</span>
                    <div className="h-8 w-[1px] bg-gradient-to-b from-primary/40 to-transparent" />
                </motion.div>
            </motion.div>
        </section>
    );
}
