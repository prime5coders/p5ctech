// ===========================================
// Testimonials Section — Apple-style
// Cards rise from blur with stagger, quote marks
// animate in, stars fill one by one
// ===========================================

"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { testimonials } from "@/lib/data";

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.92, filter: "blur(6px)" },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.8,
            ease: [0.25, 0.4, 0.25, 1],
        },
    },
};

export function TestimonialsSection() {
    return (
        <section id="testimonials" className="section-padding relative">
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
                        Testimonials
                    </motion.p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                        Trusted by{" "}
                        <span className="gradient-text">innovative teams</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                        Don&apos;t just take our word for it. Here&apos;s what our clients say
                        about working with us.
                    </p>
                </motion.div>

                {/* Testimonial cards — staggered */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="mt-16 grid gap-6 md:grid-cols-2"
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            variants={cardVariants}
                            whileHover={{
                                y: -4,
                                transition: { duration: 0.3 },
                            }}
                            className="relative rounded-2xl border border-border/50 bg-card/50 p-8 transition-all duration-500 hover:border-primary/20 hover:shadow-[0_10px_40px_oklch(0_0_0_/_30%)]"
                        >
                            {/* Animated quote icon */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 + index * 0.1, duration: 0.5, type: "spring" }}
                            >
                                <Quote
                                    size={32}
                                    className="absolute right-6 top-6 text-primary/15"
                                />
                            </motion.div>

                            {/* Stars — fill one by one */}
                            <div className="mb-4 flex gap-1">
                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            delay: 0.5 + i * 0.08,
                                            duration: 0.3,
                                            type: "spring",
                                            stiffness: 300,
                                        }}
                                    >
                                        <Star
                                            size={14}
                                            className="fill-primary text-primary"
                                        />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Quote text */}
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                &ldquo;{testimonial.content}&rdquo;
                            </p>

                            {/* Author — slide in */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="mt-6 flex items-center gap-3"
                            >
                                <div
                                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-primary-foreground ring-2 ring-primary/20"
                                    style={{
                                        background: `linear-gradient(135deg, oklch(0.5 0.12 ${60 + index * 30}), oklch(0.4 0.14 ${80 + index * 25}))`,
                                    }}
                                >
                                    {testimonial.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">{testimonial.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
