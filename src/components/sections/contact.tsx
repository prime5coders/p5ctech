// ===========================================
// Contact Section — Apple-style transitions
// Form slides in from right, contact info from
// left, with smooth revealed form fields
// ===========================================

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Clock } from "lucide-react";
import { ProjectConfigurator } from "@/components/project-configurator";

type FormState = "idle" | "submitting" | "success" | "error";

const infoItemVariants = {
    hidden: { opacity: 0, x: -30, filter: "blur(4px)" },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        transition: {
            delay: 0.3 + i * 0.15,
            duration: 0.6,
            ease: "easeOut" as const,
        },
    }),
};

const formFieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.3 + i * 0.1,
            duration: 0.5,
            ease: "easeOut" as const,
        },
    }),
};

export function ContactSection() {

    const contactInfo = [
        { icon: Mail, title: "Email", value: "prime5coders@gmail.com" },
        { icon: MapPin, title: "Location", value: "Madurai" },
        { icon: Clock, title: "Response Time", value: "Within 24 hours" },
    ];

    return (
        <section id="contact" className="section-padding relative">
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
                        Start Building
                    </motion.p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                        Configure Your{" "}
                        <span className="gradient-text">Project</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                        Use our interactive configurator to specify your requirements,
                        get live estimates, and submit your project brief directly to our team.
                    </p>
                </motion.div>

                <div className="mt-16 grid gap-12 lg:grid-cols-5">
                    {/* Contact info — staggered slide from left */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="space-y-8 lg:col-span-2"
                    >
                        {contactInfo.map((item, i) => (
                            <motion.div
                                key={item.title}
                                custom={i}
                                variants={infoItemVariants}
                                className="group flex items-start gap-4"
                            >
                                <div className="rounded-lg bg-primary/10 p-2.5 transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-110 group-hover:rotate-3">
                                    <item.icon size={20} className="text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold">{item.title}</h4>
                                    <p className="text-sm text-muted-foreground">{item.value}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Contact form — slides in from right with blur */}
                    <motion.div
                        initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
                        whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="lg:col-span-3"
                    >
                        <ProjectConfigurator />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
