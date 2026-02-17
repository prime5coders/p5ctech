// ===========================================
// Services Section — Apple-style interactions
// Cards scale from small + blurred, stagger in,
// 3D tilt on hover, shimmer border effect
// ===========================================

"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { services } from "@/lib/data";
import { useRef } from "react";

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
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
            duration: 0.7,
            ease: "easeOut",
        },
    },
};

function ServiceCard({ service, index }: { service: (typeof services)[number]; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useTransform(mouseY, [-150, 150], [5, -5]);
    const rotateY = useTransform(mouseX, [-150, 150], [-5, 5]);

    function handleMouseMove(e: React.MouseEvent) {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        mouseX.set(e.clientX - rect.left - rect.width / 2);
        mouseY.set(e.clientY - rect.top - rect.height / 2);
    }

    function handleMouseLeave() {
        mouseX.set(0);
        mouseY.set(0);
    }

    return (
        <motion.div variants={cardVariants} style={{ perspective: 800 }}>
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative h-full rounded-2xl border border-border/50 bg-card/50 p-8 transition-all duration-500 hover:border-primary/30 hover:bg-card/80 hover:shadow-[0_0_40px_oklch(0.78_0.12_80_/_12%)]"
            >
                {/* Icon with scale + rotate on hover */}
                <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-3 transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-110 group-hover:rotate-3">
                    <service.icon
                        size={24}
                        className="text-primary transition-all duration-500 group-hover:scale-110"
                    />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold transition-colors duration-300 group-hover:text-primary">
                    {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                </p>

                {/* Hover gradient overlay — sweeps in */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-primary/3 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Bottom highlight line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-gradient-to-r from-transparent via-primary/60 to-transparent transition-all duration-500 group-hover:w-3/4" />
            </motion.div>
        </motion.div>
    );
}

export function ServicesSection() {
    return (
        <section id="services" className="section-padding relative">
            <div className="mx-auto max-w-7xl">
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
                        What We Do
                    </motion.p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                        Services built for{" "}
                        <span className="gradient-text">modern teams</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                        End-to-end solutions from design to deployment. We handle the
                        complexity so you can focus on growth.
                    </p>
                </motion.div>

                {/* Service cards grid — staggered */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {services.map((service, index) => (
                        <ServiceCard key={service.title} service={service} index={index} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
