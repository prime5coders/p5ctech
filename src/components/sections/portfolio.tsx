// ===========================================
// Portfolio Section
// Case study showcase with tags, hover overlays,
// and gradient placeholder images
// ===========================================

"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { projects } from "@/lib/data";

export function PortfolioSection() {
    return (
        <section id="portfolio" className="section-padding relative">
            {/* Background accent */}
            <div className="absolute inset-0 bg-dots opacity-30" />

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
                        Our Work
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                        Projects that{" "}
                        <span className="gradient-text">speak for themselves</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                        Real results for real companies. See how we&apos;ve helped businesses
                        transform their digital presence.
                    </p>
                </motion.div>

                {/* Projects grid */}
                <div className="mt-16 grid gap-8 md:grid-cols-2">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 transition-all duration-300 hover:border-primary/30">
                                {/* Image placeholder with gradient */}
                                <div className="relative h-56 overflow-hidden">
                                    <div
                                        className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                                        style={{
                                            background: `linear-gradient(135deg, 
                        oklch(0.3 0.08 ${200 + index * 40}) 0%, 
                        oklch(0.2 0.12 ${260 + index * 30}) 50%, 
                        oklch(0.15 0.06 ${220 + index * 35}) 100%)`,
                                        }}
                                    />
                                    {/* Project title overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-white/30">
                                            {project.title}
                                        </span>
                                    </div>

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                        <a
                                            href={project.liveUrl}
                                            className="flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-105"
                                        >
                                            View Project
                                            <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold">{project.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {project.description}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {project.tags.map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="secondary"
                                                className="rounded-full border-border/50 bg-secondary/50 text-xs"
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
