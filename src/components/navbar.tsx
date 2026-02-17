// ===========================================
// Navbar Component — Premium with animations
// Animated logo, staggered nav links with
// underline hover, magnetic CTA button
// ===========================================

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/lib/data";
import { cn } from "@/lib/utils";

const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.1 + i * 0.08,
            duration: 0.4,
            ease: "easeOut" as const,
        },
    }),
};

const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.08,
            duration: 0.3,
            ease: "easeOut" as const,
        },
    }),
};

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                isScrolled
                    ? "glass-strong shadow-lg shadow-black/10"
                    : "bg-transparent"
            )}
        >
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
                {/* Logo — animated on load */}
                <motion.a
                    href="#"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="group flex items-center gap-2"
                >
                    <motion.div
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 glow transition-all duration-300 group-hover:bg-primary/30 group-hover:shadow-[0_0_20px_oklch(0.78_0.12_80_/_25%)]"
                    >
                        <span className="text-sm font-bold gradient-text">P5</span>
                    </motion.div>
                    <span className="text-lg font-bold tracking-tight">
                        P5C <span className="text-muted-foreground transition-colors duration-300 group-hover:text-foreground">Tech Solutions</span>
                    </span>
                </motion.a>

                {/* Desktop Navigation — staggered links */}
                <div className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link, i) => (
                        <motion.a
                            key={link.href}
                            href={link.href}
                            custom={i}
                            initial="hidden"
                            animate="visible"
                            variants={navItemVariants}
                            className="link-underline text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                        >
                            {link.label}
                        </motion.a>
                    ))}
                </div>

                {/* Desktop CTA — enhanced hover */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="hidden md:block"
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                        <Button
                            asChild
                            className="rounded-full bg-primary px-6 hover:bg-primary/90 glow transition-all duration-300 hover:shadow-[0_0_30px_oklch(0.78_0.12_80_/_30%)]"
                        >
                            <a href="/login">Start a Project</a>
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Mobile menu toggle — animated icon swap */}
                <motion.button
                    whileTap={{ scale: 0.85, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    className="md:hidden p-2 relative"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <AnimatePresence mode="wait">
                        {isMobileMenuOpen ? (
                            <motion.span
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X size={24} />
                            </motion.span>
                        ) : (
                            <motion.span
                                key="open"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Menu size={24} />
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </nav>

            {/* Mobile Menu — staggered items */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, height: "auto", backdropFilter: "blur(24px)" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="glass-strong md:hidden overflow-hidden border-t border-border/50"
                    >
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            className="flex flex-col gap-4 px-4 py-6"
                        >
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.href}
                                    href={link.href}
                                    custom={i}
                                    variants={mobileItemVariants}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-sm text-muted-foreground transition-all duration-300 hover:text-foreground hover:translate-x-2"
                                >
                                    {link.label}
                                </motion.a>
                            ))}
                            <motion.div
                                custom={navLinks.length}
                                variants={mobileItemVariants}
                            >
                                <Button
                                    asChild
                                    className="mt-2 w-full rounded-full bg-primary hover:bg-primary/90 transition-all duration-300"
                                >
                                    <a href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        Start a Project
                                    </a>
                                </Button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
