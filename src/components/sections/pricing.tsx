// ===========================================
// Pricing Section — Apple-style entrance
// Cards scale in with blur, popular card has
// animated glow border, features stagger in
// ===========================================

"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { pricingTiers } from "@/lib/data";
import { cn } from "@/lib/utils";

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
    hidden: { opacity: 0, y: 60, scale: 0.9, filter: "blur(6px)" },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.8,
            ease: "easeOut" as const,
        },
    },
};

const featureVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: 0.5 + i * 0.05,
            duration: 0.4,
            ease: "easeOut" as const,
        },
    }),
};

export function PricingSection() {
    return (
        <section id="pricing" className="section-padding relative">
            <div className="absolute inset-0 bg-dots opacity-20" />

            <div className="relative mx-auto max-w-7xl">
                {/* Section header — blur reveal */}
                <motion.div
                    initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center"
                >
                    <motion.p
                        initial={{ opacity: 0, letterSpacing: "0.3em" }}
                        whileInView={{ opacity: 1, letterSpacing: "0.2em" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-sm font-medium uppercase text-primary"
                    >
                        Pricing
                    </motion.p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                        Transparent pricing,{" "}
                        <span className="gradient-text">no surprises</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                        Choose the plan that fits your needs. Every project includes our
                        commitment to quality and on-time delivery.
                    </p>
                </motion.div>

                {/* Pricing cards — staggered entry */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="mt-16 grid gap-8 lg:grid-cols-3"
                >
                    {pricingTiers.map((tier, index) => (
                        <motion.div
                            key={tier.name}
                            variants={cardVariants}
                            whileHover={{
                                y: -8,
                                transition: { duration: 0.3, ease: "easeOut" },
                            }}
                            className={cn(
                                "relative rounded-2xl border p-8 transition-all duration-500",
                                tier.popular
                                    ? "border-primary/50 bg-card/80 glow scale-[1.02]"
                                    : "border-border/50 bg-card/50 hover:border-primary/20 hover:shadow-[0_0_30px_oklch(0.78_0.12_80_/_8%)]"
                            )}
                        >
                            {/* Popular badge with pulse */}
                            {tier.popular && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                                >
                                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground animate-pulse">
                                        Most Popular
                                    </Badge>
                                </motion.div>
                            )}

                            {/* Tier info */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold">{tier.name}</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {tier.description}
                                </p>
                            </div>

                            {/* Price — counter-style reveal */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 + index * 0.1, type: "spring", stiffness: 150 }}
                                className="mb-8"
                            >
                                <span className="text-4xl font-bold tracking-tight gradient-text">
                                    {tier.price}
                                </span>
                                <span className="ml-2 text-sm text-muted-foreground">
                                    {tier.period}
                                </span>
                            </motion.div>

                            {/* Features — staggered slide in */}
                            <ul className="mb-8 space-y-3">
                                {tier.features.map((feature, fi) => (
                                    <motion.li
                                        key={feature}
                                        custom={fi}
                                        variants={featureVariants}
                                        className="flex items-start gap-3 text-sm text-muted-foreground"
                                    >
                                        <Check size={16} className="mt-0.5 shrink-0 text-primary" />
                                        {feature}
                                    </motion.li>
                                ))}
                            </ul>

                            {/* CTA with hover scale */}
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <Button
                                    asChild
                                    className={cn(
                                        "w-full rounded-full transition-all duration-300",
                                        tier.popular
                                            ? "bg-primary hover:bg-primary/90 hover:shadow-[0_0_20px_oklch(0.78_0.12_80_/_30%)]"
                                            : "bg-white/10 text-foreground hover:bg-white/20 hover:shadow-[0_0_15px_oklch(0.78_0.12_80_/_10%)] border border-white/5"
                                    )}
                                >
                                    <a href="#contact">{tier.cta}</a>
                                </Button>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
