// ===========================================
// Navbar Component
// Fixed glassmorphism header with smooth scroll
// navigation and mobile hamburger menu
// ===========================================

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Track scroll position for glassmorphism intensity
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled ? "glass-strong shadow-lg" : "bg-transparent"
            )}
        >
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
                {/* Logo */}
                <a href="#" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 glow">
                        <span className="text-sm font-bold gradient-text">P5</span>
                    </div>
                    <span className="text-lg font-bold tracking-tight">
                        P5C <span className="text-muted-foreground">Tech</span>
                    </span>
                </a>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Desktop CTA */}
                <div className="hidden md:block">
                    <Button asChild className="rounded-full bg-primary px-6 hover:bg-primary/90 glow">
                        <a href="/login">Start a Project</a>
                    </Button>
                </div>

                {/* Mobile menu toggle */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="glass-strong md:hidden overflow-hidden"
                    >
                        <div className="flex flex-col gap-4 px-4 py-6">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <Button asChild className="mt-2 rounded-full bg-primary hover:bg-primary/90">
                                <a href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    Start a Project
                                </a>
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
