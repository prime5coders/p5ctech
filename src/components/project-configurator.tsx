"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import { useSession } from "next-auth/react";
import {
    LayoutTemplate, Smartphone, ShoppingCart, Share2,
    Lock, CreditCard, LayoutDashboard, Database, Zap,
    Palette, Briefcase, Gem, Sparkles,
    Calendar, Clock, Rocket,
    ArrowRight, ArrowLeft, Send, CheckCircle, AlertCircle, MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// --- Types & Options ---

type ProjectType = "landing" | "webapp" | "ecommerce" | "mobile";
type DesignStyle = "minimal" | "corporate" | "luxury" | "playful";
type Timeline = "flexible" | "standard" | "rush";

interface ConfigState {
    type: ProjectType | null;
    features: string[];
    style: DesignStyle | null;
    timeline: Timeline | null;
    name: string;
    email: string;
    details: string;
}

const PROJECT_TYPES = [
    { id: "landing", label: "Landing Page", icon: LayoutTemplate, basePrice: 3000, desc: "High-converting single page" },
    { id: "webapp", label: "Web Application", icon: Database, basePrice: 7000, desc: "Complex functionality & auth" },
    { id: "ecommerce", label: "E-Commerce", icon: ShoppingCart, basePrice: 8500, desc: "Online store & payments" },
    { id: "mobile", label: "Mobile App", icon: Smartphone, basePrice: 10000, desc: "iOS & Android application" },
];

const FEATURES = [
    { id: "auth", label: "User Auth", icon: Lock, price: 1000 },
    { id: "payments", label: "Payments", icon: CreditCard, price: 1500 },
    { id: "dashboard", label: "Admin Dashboard", icon: LayoutDashboard, price: 2000 },
    { id: "api", label: "Custom API", icon: Zap, price: 2500 },
    { id: "social", label: "Social Integration", icon: Share2, price: 800 },
];

const DESIGN_STYLES = [
    { id: "minimal", label: "Clean & Minimal", icon: Palette, desc: "Focus on whitespace and typography" },
    { id: "corporate", label: "Professional", icon: Briefcase, desc: "Trustworthy and data-focused" },
    { id: "luxury", label: "Premium/Luxury", icon: Gem, desc: "Dark mode, animations, high-end feel" },
    { id: "playful", label: "Bold & Vibrant", icon: Sparkles, desc: "Colorful, engaging, animated" },
];

const TIMELINES = [
    { id: "flexible", label: "Flexible", icon: Calendar, multiplier: 1.0, desc: "Standard 6-8 weeks" },
    { id: "standard", label: "Standard", icon: Clock, multiplier: 1.25, desc: "Accelerated 4-6 weeks" },
    { id: "rush", label: "Rush", icon: Rocket, multiplier: 1.5, desc: "Priority delivery < 4 weeks" },
];

// --- Component ---

export function ProjectConfigurator() {
    const [step, setStep] = useState(1);
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [config, setConfig] = useState<ConfigState>({
        type: null,
        features: [],
        style: null,
        timeline: null,
        name: "",
        email: "",
        details: ""
    });

    const { data: session, status: authStatus } = useSession();

    useEffect(() => {
        if (authStatus === "authenticated" && session?.user) {
            setConfig(prev => ({
                ...prev,
                name: prev.name || session.user?.name || "",
                email: prev.email || session.user?.email || ""
            }));
        }
    }, [authStatus, session]);

    // Dynamic Pricing Engine
    const calculateEstimate = () => {
        if (!config.type) return { min: 0, max: 0 };

        let base = PROJECT_TYPES.find(t => t.id === config.type)?.basePrice || 0;

        const featuresCost = config.features.reduce((acc, featId) => {
            const feat = FEATURES.find(f => f.id === featId);
            return acc + (feat?.price || 0);
        }, 0);

        let total = base + featuresCost;

        if (config.timeline) {
            const multiplier = TIMELINES.find(t => t.id === config.timeline)?.multiplier || 1.0;
            total = total * multiplier;
        }

        // Return a range to manage expectations (e.g. +/- 15%)
        return {
            min: Math.floor(total * 0.85),
            max: Math.ceil(total * 1.15)
        };
    };

    const estimate = calculateEstimate();

    // Handlers
    const toggleFeature = (id: string) => {
        setConfig(prev => ({
            ...prev,
            features: prev.features.includes(id)
                ? prev.features.filter(f => f !== id)
                : [...prev.features, id]
        }));
    };

    const nextStep = () => setStep(s => Math.min(5, s + 1));
    const prevStep = () => setStep(s => Math.max(1, s - 1));

    const handleSubmit = async () => {
        setStatus("submitting");

        // Compile the message for backend
        const typeName = PROJECT_TYPES.find(t => t.id === config.type)?.label;
        const styleName = DESIGN_STYLES.find(s => s.id === config.style)?.label;
        const timelineName = TIMELINES.find(t => t.id === config.timeline)?.label;
        const featureNames = config.features.map(fId => FEATURES.find(f => f.id === fId)?.label).join(", ");

        const compiledMessage = `
--- PROJECT CONFIGURATION ---
Type: ${typeName}
Design Style: ${styleName}
Timeline: ${timelineName}
Features Required: ${featureNames || "None selected"}
Estimated Range: ₹${estimate.min.toLocaleString()} - ₹${estimate.max.toLocaleString()}

Client Request Details:
${config.details}
---------------------------
        `.trim();

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: config.name,
                    email: config.email,
                    subject: "New Project Configuration Request",
                    message: compiledMessage
                }),
            });

            if (!res.ok) throw new Error("Failed to submit");

            // --- Send Email Confirmation (Client-side via EmailJS) ---
            const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
            const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
            const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

            if (serviceId && templateId && publicKey) {
                emailjs.send(
                    serviceId,
                    templateId,
                    {
                        to_email: config.email,
                        subject: "We received your project brief! 🚀",
                        message: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
    <div style="text-align: center; padding: 20px 0;">
        <h1 style="color: #1a1a1a; margin: 0;">Prime5Coders</h1>
        <p style="color: #666; margin-top: 5px;">Your digital product engineers</p>
    </div>
    <div style="background-color: #f9f9f9; padding: 30px; border-radius: 12px; border: 1px solid #eee;">
        <h2 style="margin-top: 0;">Hi ${config.name},</h2>
        <p>Thank you for submitting your project configuration! We're excited to learn more about what you're building.</p>
        <p>Our team is reviewing your requirements right now, and we'll be in touch within 24 hours to discuss the next steps.</p>
        <div style="margin: 30px 0; padding: 20px; background-color: white; border-radius: 8px; border-left: 4px solid #000;">
            <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #666;">Your Submission Details</h3>
            <pre style="white-space: pre-wrap; font-family: inherit; font-size: 14px; line-height: 1.5; margin: 0;">${compiledMessage}</pre>
        </div>
        <p>If you have any immediate questions, feel free to reply directly to this email or chat with us on WhatsApp.</p>
        <p style="margin-bottom: 0;">Best regards,<br><strong>The Prime5Coders Team</strong></p>
    </div>
    <div style="text-align: center; padding: 20px 0; color: #999; font-size: 12px;">
        &copy; ${new Date().getFullYear()} Prime5Coders. All rights reserved.
    </div>
</div>`
                    },
                    publicKey
                ).catch(err => console.error("[Email] EmailJS error:", err));
            }

            setStatus("success");
        } catch (error) {
            setStatus("error");
        }
    };

    // Animation Configs
    const slideVariants = {
        enter: { x: 50, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -50, opacity: 0 }
    };

    return (
        <div className="flex flex-col h-full min-h-[500px] rounded-2xl border border-primary/20 bg-card/60 backdrop-blur-md overflow-hidden shadow-[0_0_30px_oklch(0.78_0.12_80_/_10%)] relative">

            {/* --- Progress Header --- */}
            <div className="p-6 border-b border-border/50 bg-background/50 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Sparkles className="text-primary w-5 h-5" />
                        Project Configurator
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">Step {step} of 5</p>
                </div>

                {/* Progress bar visual */}
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div
                            key={i}
                            className={`h-1.5 w-6 rounded-full transition-all duration-500 ${i <= step ? "bg-primary" : "bg-primary/20"}`}
                        />
                    ))}
                </div>
            </div>

            {/* --- Main Content Area --- */}
            <div className="flex-1 p-6 relative overflow-hidden">
                <AnimatePresence mode="wait">

                    {/* STEP 1: Type */}
                    {step === 1 && (
                        <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-4">
                            <h4 className="font-medium text-lg">What are we building?</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {PROJECT_TYPES.map(type => (
                                    <button
                                        key={type.id}
                                        onClick={() => setConfig({ ...config, type: type.id as ProjectType })}
                                        className={`p-4 rounded-xl border text-left transition-all duration-300 flex flex-col gap-2 ${config.type === type.id ? 'border-primary bg-primary/10 shadow-[0_0_15px_oklch(0.78_0.12_80_/_20%)]' : 'border-border/50 hover:border-primary/50 hover:bg-card'}`}
                                    >
                                        <type.icon className={`w-6 h-6 ${config.type === type.id ? 'text-primary' : 'text-muted-foreground'}`} />
                                        <div>
                                            <p className="font-medium">{type.label}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{type.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: Features */}
                    {step === 2 && (
                        <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-4">
                            <h4 className="font-medium text-lg">Select core features</h4>
                            <p className="text-sm text-muted-foreground mb-4">You can select multiple options.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {FEATURES.map(feat => {
                                    const isSelected = config.features.includes(feat.id);
                                    return (
                                        <button
                                            key={feat.id}
                                            onClick={() => toggleFeature(feat.id)}
                                            className={`p-3 rounded-xl border text-left transition-all duration-300 flex items-center justify-between ${isSelected ? 'border-primary bg-primary/10' : 'border-border/50 hover:border-primary/50'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <feat.icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                                                <span className="font-medium text-sm">{feat.label}</span>
                                            </div>
                                            <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                                                {isSelected && <CheckCircle className="w-3 h-3 text-primary-foreground" />}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: Style */}
                    {step === 3 && (
                        <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-4">
                            <h4 className="font-medium text-lg">Choose a design aesthetic</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {DESIGN_STYLES.map(style => (
                                    <button
                                        key={style.id}
                                        onClick={() => setConfig({ ...config, style: style.id as DesignStyle })}
                                        className={`p-4 rounded-xl border text-left transition-all duration-300 flex flex-col gap-2 ${config.style === style.id ? 'border-primary bg-primary/10 shadow-[0_0_15px_oklch(0.78_0.12_80_/_20%)]' : 'border-border/50 hover:border-primary/50'}`}
                                    >
                                        <style.icon className={`w-6 h-6 ${config.style === style.id ? 'text-primary' : 'text-muted-foreground'}`} />
                                        <div>
                                            <p className="font-medium">{style.label}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{style.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: Timeline */}
                    {step === 4 && (
                        <motion.div key="step4" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-4">
                            <h4 className="font-medium text-lg">Project Timeline</h4>
                            <div className="flex flex-col gap-3">
                                {TIMELINES.map(time => (
                                    <button
                                        key={time.id}
                                        onClick={() => setConfig({ ...config, timeline: time.id as Timeline })}
                                        className={`p-4 rounded-xl border text-left transition-all duration-300 flex items-center justify-between ${config.timeline === time.id ? 'border-primary bg-primary/10 shadow-[0_0_15px_oklch(0.78_0.12_80_/_20%)]' : 'border-border/50 hover:border-primary/50'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${config.timeline === time.id ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                                <time.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{time.label}</p>
                                                <p className="text-xs text-muted-foreground">{time.desc}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 5: Final Submission */}
                    {step === 5 && (
                        <motion.div key="step5" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-4">

                            {status === "success" ? (
                                <div className="flex flex-col items-center justify-center text-center h-full space-y-4 py-8">
                                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-2 shadow-[0_0_30px_oklch(0.78_0.12_80_/_40%)]">
                                        <CheckCircle className="w-8 h-8 text-primary" />
                                    </div>
                                    <h4 className="text-2xl font-bold">Proposal Sent!</h4>
                                    <p className="text-muted-foreground max-w-[280px] mb-4">We've received your requirements and will reach out within 24 hours.</p>

                                    <div className="w-full max-w-[280px] h-px bg-border/50 my-4" />

                                    <p className="text-xs text-muted-foreground mb-2">Need immediate assistance?</p>
                                    <Button
                                        asChild
                                        className="w-full max-w-[280px] rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-all"
                                    >
                                        <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919342732101"}?text=${encodeURIComponent("Hi Prime5Coders! I just submitted a project configurator brief. My name is " + config.name + ". Can we discuss this?")}`} target="_blank" rel="noopener noreferrer">
                                            <MessageCircle className="w-4 h-4 mr-2" fill="currentColor" />
                                            Chat with us on WhatsApp
                                        </a>
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <h4 className="font-medium text-lg mb-2">Final Details</h4>
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-muted-foreground">Name</label>
                                                <Input
                                                    placeholder="John Doe"
                                                    value={config.name}
                                                    onChange={e => setConfig({ ...config, name: e.target.value })}
                                                    className="bg-background/50 border-border/50"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-muted-foreground">Email</label>
                                                <Input
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    value={config.email}
                                                    onChange={e => setConfig({ ...config, email: e.target.value })}
                                                    className="bg-background/50 border-border/50"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-muted-foreground">Additional Notes</label>
                                            <Textarea
                                                placeholder="Tell us a bit more about your vision..."
                                                rows={3}
                                                value={config.details}
                                                onChange={e => setConfig({ ...config, details: e.target.value })}
                                                className="bg-background/50 border-border/50 resize-none"
                                            />
                                        </div>

                                        {status === "error" && (
                                            <div className="text-xs text-destructive flex items-center gap-1 mt-2 p-2 bg-destructive/10 rounded-md">
                                                <AlertCircle size={14} /> Failed to submit. Please try again.
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* --- Bottom Action Bar --- */}
            {status !== "success" && (
                <div className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-md flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Live Estimate</span>
                        <span className="font-bold text-lg gradient-text">
                            {estimate.min === 0 ? "₹0" : `₹${estimate.min.toLocaleString()} - ₹${estimate.max.toLocaleString()}`}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        {step > 1 && (
                            <Button variant="outline" size="icon" onClick={prevStep} className="rounded-full bg-background border-border/50">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        )}

                        {step < 5 ? (
                            <Button
                                onClick={nextStep}
                                disabled={
                                    (step === 1 && !config.type) ||
                                    (step === 3 && !config.style) ||
                                    (step === 4 && !config.timeline)
                                }
                                className="rounded-full bg-primary hover:bg-primary/90 px-6"
                            >
                                Next Step <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={status === "submitting" || !config.name || !config.email}
                                className="rounded-full bg-primary hover:bg-primary/90 px-6 shadow-[0_0_20px_oklch(0.78_0.12_80_/_40%)]"
                            >
                                {status === "submitting" ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                                        Processing...
                                    </span>
                                ) : (
                                    <>Submit Brief <Send className="w-4 h-4 ml-2" /></>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
