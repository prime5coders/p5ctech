// ===========================================
// Pricing Section
// Three-tier pricing cards with popular badge,
// feature lists, and CTA buttons
// ===========================================

"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { pricingTiers } from "@/lib/data";
import { cn } from "@/lib/utils";

export function PricingSection() {
    return (
        <section id="pricing" className="section-padding relative">
            <div className="absolute inset-0 bg-dots opacity-20" />

            <div className="relative mx-auto max-w-7xl">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <p className="text-sm font-medium uppercase tracking-widest text-primary">
                        Pricing
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                        Transparent pricing,{" "}
                        <span className="gradient-text">no surprises</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                        Choose the plan that fits your needs. Every project includes our
                        commitment to quality and on-time delivery.
                    </p>
                </motion.div>

                {/* Pricing cards */}
                <div className="mt-16 grid gap-8 lg:grid-cols-3">
                    {pricingTiers.map((tier, index) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={cn(
                                "relative rounded-2xl border p-8 transition-all duration-300",
                                tier.popular
                                    ? "border-primary/50 bg-card/80 glow scale-[1.02]"
                                    : "border-border/50 bg-card/50 hover:border-primary/20"
                            )}
                        >
                            {/* Popular badge */}
                            {tier.popular && (
                                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
                                    Most Popular
                                </Badge>
                            )}

                            {/* Tier info */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold">{tier.name}</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {tier.description}
                                </p>
                            </div>

                            {/* Price */}
                            <div className="mb-8">
                                <span className="text-4xl font-bold tracking-tight">
                                    {tier.price}
                                </span>
                                <span className="ml-2 text-sm text-muted-foreground">
                                    {tier.period}
                                </span>
                            </div>

                            {/* Features */}
                            <ul className="mb-8 space-y-3">
                                {tier.features.map((feature) => (
                                    <li
                                        key={feature}
                                        className="flex items-start gap-3 text-sm text-muted-foreground"
                                    >
                                        <Check size={16} className="mt-0.5 shrink-0 text-primary" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <Button
                                asChild
                                className={cn(
                                    "w-full rounded-full",
                                    tier.popular
                                        ? "bg-primary hover:bg-primary/90"
                                        : "bg-secondary hover:bg-secondary/80"
                                )}
                            >
                                <a href="#contact">{tier.cta}</a>
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
