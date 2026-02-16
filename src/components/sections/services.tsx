// ===========================================
// Services Section
// Animated service cards with glassmorphism
// hover effects and icon highlights
// ===========================================

"use client";

import { motion } from "framer-motion";
import { services } from "@/lib/data";

export function ServicesSection() {
    return (
        <section id="services" className="section-padding relative">
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
                        What We Do
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                        Services built for{" "}
                        <span className="gradient-text">modern teams</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                        End-to-end solutions from design to deployment. We handle the
                        complexity so you can focus on growth.
                    </p>
                </motion.div>

                {/* Service cards grid */}
                <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="group relative h-full rounded-2xl border border-border/50 bg-card/50 p-8 transition-all duration-300 hover:border-primary/30 hover:bg-card/80 hover:glow">
                                {/* Icon */}
                                <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                                    <service.icon
                                        size={24}
                                        className="text-primary transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-semibold">{service.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    {service.description}
                                </p>

                                {/* Hover gradient overlay */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
