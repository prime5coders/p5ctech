// ===========================================
// Testimonials Section
// Client quotes with avatars, roles, and
// star ratings in a scrolling grid
// ===========================================

"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { testimonials } from "@/lib/data";

export function TestimonialsSection() {
    return (
        <section id="testimonials" className="section-padding relative">
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
                        Testimonials
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                        Trusted by{" "}
                        <span className="gradient-text">innovative teams</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                        Don&apos;t just take our word for it. Here&apos;s what our clients say
                        about working with us.
                    </p>
                </motion.div>

                {/* Testimonial cards */}
                <div className="mt-16 grid gap-6 md:grid-cols-2">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative rounded-2xl border border-border/50 bg-card/50 p-8 transition-all duration-300 hover:border-primary/20"
                        >
                            {/* Quote icon */}
                            <Quote
                                size={32}
                                className="absolute right-6 top-6 text-primary/10"
                            />

                            {/* Stars */}
                            <div className="mb-4 flex gap-1">
                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        className="fill-primary text-primary"
                                    />
                                ))}
                            </div>

                            {/* Quote text */}
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                &ldquo;{testimonial.content}&rdquo;
                            </p>

                            {/* Author */}
                            <div className="mt-6 flex items-center gap-3">
                                {/* Avatar placeholder */}
                                <div
                                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-primary-foreground"
                                    style={{
                                        background: `linear-gradient(135deg, oklch(0.5 0.15 ${220 + index * 40}), oklch(0.4 0.18 ${270 + index * 30}))`,
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
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
