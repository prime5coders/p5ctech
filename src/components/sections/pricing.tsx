// ===========================================
// Pricing Section — Apple-style entrance
// Cards scale in with blur, popular card has
// animated glow border, features stagger in
// ===========================================

"use client";

import { useRef, MouseEvent } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate, type MotionValue } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { pricingTiers, type PricingTier } from "@/lib/data";
import { useSession } from "next-auth/react";
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
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll progress exclusively within this section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    // Create 3 different parallax speeds for the cards (Left, Center, Right)
    // Center card moves slightly faster, outer cards move slower, creating depth.
    const yLeft = useTransform(scrollYProgress, [0, 1], [40, -40]);
    const yCenter = useTransform(scrollYProgress, [0, 1], [80, -80]);
    const yRight = useTransform(scrollYProgress, [0, 1], [30, -30]);

    const getParallaxY = (index: number) => {
        if (index === 0) return yLeft;
        if (index === 1) return yCenter;
        return yRight;
    };

    return (
        <section ref={containerRef} id="pricing" className="section-padding relative">
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
                        <PricingCard
                            key={tier.name}
                            tier={tier}
                            index={index}
                            yParallax={getParallaxY(index)}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

function PricingCard({ tier, index, yParallax }: { tier: PricingTier; index: number; yParallax: MotionValue<number> }) {
    const cardRef = useRef<HTMLDivElement>(null);

    // 3D Tilt Physics
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const isHovered = useMotionValue(0);

    const smoothX = useSpring(mouseX, { damping: 20, stiffness: 100, mass: 0.5 });
    const smoothY = useSpring(mouseY, { damping: 20, stiffness: 100, mass: 0.5 });

    // Rotate up to 8 degrees based on mouse position
    const rotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
    const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);

    // Spring scale for 3D pop effect
    const scale = useSpring(useTransform(isHovered, [0, 1], [1, 1.02]), { damping: 20, stiffness: 100 });

    const { status } = useSession();
    const ctaHref = status === "authenticated" ? "/#contact" : "/login?callbackUrl=/#contact";

    // Spotlight transforms
    const spotlightX = useTransform(smoothX, [-0.5, 0.5], ["0%", "100%"]);
    const spotlightY = useTransform(smoothY, [-0.5, 0.5], ["0%", "100%"]);
    const background = useMotionTemplate`radial-gradient(1000px circle at ${spotlightX} ${spotlightY}, rgba(255,255,255,0.06), transparent 40%)`;

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        // Calculate relative position from -0.5 to 0.5
        const x = (e.clientX - rect.left) / width - 0.5;
        const y = (e.clientY - rect.top) / height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseEnter = () => isHovered.set(1);

    const handleMouseLeave = () => {
        isHovered.set(0);
        // Reset tilt on leave
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                y: yParallax,
                rotateX,
                rotateY,
                scale,
                transformStyle: "preserve-3d",
            }}
            variants={cardVariants}
            className={cn(
                "relative rounded-2xl border p-8 transition-colors duration-500 overflow-hidden group/card",
                tier.popular
                    ? "border-primary/50 bg-card/80 glow"
                    : "border-border/50 bg-card/50 hover:border-primary/20 hover:shadow-[0_0_30px_oklch(0.78_0.12_80_/_8%)]"
            )}
        >
            {/* Background Particles for Popular Tier */}
            {tier.popular && (
                <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.15]">
                    <motion.div
                        animate={{ y: ["0%", "-50%"] }}
                        transition={{ duration: 25, ease: "linear", repeat: Infinity }}
                        className="absolute inset-0 w-full h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_1.5px,transparent_1.5px)]"
                        style={{ backgroundSize: "32px 32px" }}
                    />
                </div>
            )}

            {/* Mouse tracking spotlight glare */}
            <motion.div
                className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover/card:opacity-100"
                style={{ background }}
            />

            {/* Content Container with slight Z-translation for 3D parallax depth */}
            <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
                {/* Popular badge with pulse */}
                {tier.popular && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                    >
                        <Badge className="absolute -top-11 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground animate-pulse">
                            Most Popular
                        </Badge>
                    </motion.div>
                )}

                {/* Tier info */}
                <div className="mb-6 mt-2">
                    <h3 className="text-lg font-semibold">{tier.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{tier.description}</p>
                </div>

                {/* Price */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1, type: "spring", stiffness: 150 }}
                    className="mb-8"
                >
                    <span className="text-4xl font-bold tracking-tight gradient-text">{tier.price}</span>
                    <span className="ml-2 text-sm text-muted-foreground">{tier.period}</span>
                </motion.div>

                {/* Features */}
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

                {/* CTA Buttons */}
                {tier.popular ? (
                    <motion.div whileHover="hover" whileTap={{ scale: 0.97 }} className="relative group/btn">
                        <Button
                            asChild
                            className="relative w-full rounded-full bg-primary overflow-hidden transition-all duration-300 group-hover/btn:bg-primary/95 shadow-[0_0_15px_oklch(0.78_0.12_80_/_20%)] group-hover/btn:shadow-[0_0_30px_oklch(0.78_0.12_80_/_50%)]"
                        >
                            <a href={ctaHref}>
                                <motion.div
                                    variants={{ hover: { opacity: 1, scale: 1.5, rotate: 180 } }}
                                    initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                                    transition={{ duration: 2.0, ease: "linear", repeat: Infinity }}
                                    className="absolute inset-[-50%] z-0 rounded-full bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,oklch(0.9_0.05_90)_100%)] opacity-0 blur-md pointer-events-none"
                                />
                                <motion.div
                                    variants={{ hover: { x: ["-100%", "200%"] } }}
                                    transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
                                    className="absolute inset-0 z-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none"
                                />
                                <span className="relative z-10">{tier.cta}</span>
                            </a>
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button
                            asChild
                            className="w-full rounded-full bg-white/10 text-foreground transition-all duration-300 hover:bg-white/20 hover:shadow-[0_0_15px_oklch(0.78_0.12_80_/_10%)] border border-white/5"
                        >
                            <a href={ctaHref}>{tier.cta}</a>
                        </Button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
