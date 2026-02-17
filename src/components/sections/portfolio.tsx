// ===========================================
// Portfolio Section — Apple-style reveals
// Cards slide up with scale + blur, hover lifts
// card with 3D depth, image parallax on hover
// ===========================================

"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { projects } from "@/lib/data";

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
    hidden: { opacity: 0, y: 80, scale: 0.92, filter: "blur(6px)" },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.8,
            ease: "easeOut",
        },
    },
};

export function PortfolioSection() {
    return (
        <section id="portfolio" className="section-padding relative">
            {/* Background accent */}
            <div className="absolute inset-0 bg-dots opacity-30" />

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
                        Our Work
                    </motion.p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                        Projects that{" "}
                        <span className="gradient-text">speak for themselves</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                        Real results for real companies. See how we&apos;ve helped businesses
                        transform their digital presence.
                    </p>
                </motion.div>

                {/* Projects grid — staggered entry */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="mt-16 grid gap-8 md:grid-cols-2"
                >
                    {projects.map((project, index) => (
                        <motion.div key={project.id} variants={cardVariants}>
                            <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 transition-all duration-500 hover:border-primary/30 hover:-translate-y-2 hover:shadow-[0_20px_60px_oklch(0_0_0_/_40%),_0_0_30px_oklch(0.78_0.12_80_/_10%)]">
                                {/* Image with parallax zoom */}
                                <div className="relative h-56 overflow-hidden">
                                    <div
                                        className="absolute inset-0 transition-all duration-700 group-hover:scale-110 group-hover:blur-[1px]"
                                        style={{
                                            background: `linear-gradient(135deg, 
                            oklch(0.3 0.08 ${200 + index * 40}) 0%, 
                            oklch(0.2 0.12 ${260 + index * 30}) 50%, 
                            oklch(0.15 0.06 ${220 + index * 35}) 100%)`,
                                        }}
                                    />
                                    {/* Project title overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <motion.span
                                            className="text-2xl font-bold text-white/20 transition-all duration-500 group-hover:text-white/10 group-hover:scale-110"
                                        >
                                            {project.title}
                                        </motion.span>
                                    </div>

                                    {/* Hover overlay — Apple-style slide up */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0">
                                        <motion.a
                                            href={project.liveUrl}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-lg"
                                        >
                                            View Project
                                            <ExternalLink size={14} />
                                        </motion.a>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold transition-colors duration-300 group-hover:text-primary">
                                        {project.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {project.description}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {project.tags.map((tag, tagIdx) => (
                                            <motion.div
                                                key={tag}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.05 * tagIdx, duration: 0.3 }}
                                            >
                                                <Badge
                                                    variant="secondary"
                                                    className="rounded-full border-border/50 bg-secondary/50 text-xs transition-all duration-300 hover:bg-primary/20 hover:text-primary"
                                                >
                                                    {tag}
                                                </Badge>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
