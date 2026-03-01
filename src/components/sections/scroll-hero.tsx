"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export function ScrollHero() {
    const containerRef = useRef<HTMLDivElement>(null);

    // We track scroll progress over a tall container to allow a long scroll animation
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    // 0 -> 0.5: Unwrapping
    // 0.5 -> 0.55: Snaps into port
    const cableLength = useTransform(smoothProgress, [0, 0.5, 0.55], [1, 0.03, 0]);

    // Letter transitions
    // P clears early
    const colorP = useTransform(smoothProgress, [0.1, 0.15], ["#1a1a1a", "#ffffff"]);
    const glowP = useTransform(smoothProgress, [0.1, 0.15], [0, 1]);

    // 5 clears midway
    const color5 = useTransform(smoothProgress, [0.25, 0.3], ["#1a1a1a", "#ffffff"]);
    const glow5 = useTransform(smoothProgress, [0.25, 0.3], [0, 1]);

    // C clears last near 0.45
    const colorC = useTransform(smoothProgress, [0.4, 0.45], ["#1a1a1a", "#ffffff"]);
    const glowC = useTransform(smoothProgress, [0.4, 0.45], [0, 1]);

    // Connection snap & Pulse
    const bgColor = useTransform(smoothProgress, [0.55, 1], ["#000000", "#050505"]);
    const pulseScale = useTransform(smoothProgress, [0.55, 0.8], [0.1, 40]);
    const pulseOpacity = useTransform(smoothProgress, [0.55, 0.65, 0.8], [0, 0.4, 0]);

    // Keyboard lighting up
    const keyColor = useTransform(smoothProgress, [0.55, 0.7], ["#151515", "#ffffff"]);
    const keyGlow = useTransform(smoothProgress, [0.55, 0.7], ["drop-shadow(0px 0px 0px rgba(255,255,255,0))", "drop-shadow(0px 0px 8px rgba(255,255,255,0.8))"]);

    // Main content reveal after plugin
    const contentOpacity = useTransform(smoothProgress, [0.7, 1], [0, 1]);
    const contentY = useTransform(smoothProgress, [0.7, 1], [50, 0]);

    // Cable path: 
    // Start at Keyboard port: 500, 850
    // Right of C: 780, 500
    // Loop C: Over to 650, Down to 650, Under to 580
    // Loop 5: Over to 450, Down to 450, Under to 380
    // Loop P: Over to 250, Down to 250, Under to 200, 650 (mid-air)
    const cablePath = `
        M 500 850
        Q 750 700, 780 500
        C 800 350, 650 350, 650 450
        C 650 550, 600 550, 580 500
        C 580 350, 450 350, 450 450
        C 450 550, 400 550, 380 500
        C 380 350, 250 350, 250 450
        C 250 550, 200 550, 180 700
    `;

    return (
        <motion.section
            ref={containerRef}
            className="relative w-full h-[400vh] text-white"
            style={{ backgroundColor: bgColor }}
        >
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

                {/* Radial Pulse Originating from Keyboard */}
                <motion.div
                    className="absolute top-[85%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] rounded-full border border-white/10 bg-white/5"
                    style={{
                        scale: pulseScale,
                        opacity: pulseOpacity,
                    }}
                />

                <svg
                    viewBox="0 0 1000 1000"
                    className="w-full h-full max-w-[1200px] mx-auto absolute inset-0 z-10"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        <filter id="glow-blur" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="15" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>

                        <linearGradient id="cableGrad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#333333" />
                            <stop offset="100%" stopColor="#111111" />
                        </linearGradient>

                        <pattern id="braid" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                            <rect width="20" height="20" fill="url(#cableGrad)" />
                            <line x1="0" y1="0" x2="0" y2="20" stroke="#444" strokeWidth="4" />
                            <line x1="10" y1="0" x2="10" y2="20" stroke="#0a0a0a" strokeWidth="4" />
                        </pattern>
                    </defs>

                    {/* Text Layer */}
                    <g fontSize="280" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" dominantBaseline="middle">
                        {/* P */}
                        <motion.text x="250" y="470" style={{ fill: colorP }}>P</motion.text>
                        <motion.text x="250" y="470" fill="#ffffff" filter="url(#glow-blur)" style={{ opacity: glowP }}>P</motion.text>

                        {/* 5 */}
                        <motion.text x="500" y="470" style={{ fill: color5 }}>5</motion.text>
                        <motion.text x="500" y="470" fill="#ffffff" filter="url(#glow-blur)" style={{ opacity: glow5 }}>5</motion.text>

                        {/* C */}
                        <motion.text x="750" y="470" style={{ fill: colorC }}>C</motion.text>
                        <motion.text x="750" y="470" fill="#ffffff" filter="url(#glow-blur)" style={{ opacity: glowC }}>C</motion.text>
                    </g>

                    {/* Cable Layer */}
                    <motion.path
                        d={cablePath}
                        fill="none"
                        stroke="url(#braid)"
                        strokeWidth="32"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                            pathLength: cableLength,
                            willChange: "stroke-dashoffset, transform",
                            filter: "drop-shadow(0px 20px 15px rgba(0,0,0,0.9))"
                        }}
                    />

                    {/* Keyboard Layer */}
                    <g transform="translate(300, 850)">
                        {/* Case */}
                        <rect x="0" y="0" width="400" height="120" rx="10" fill="#0a0a0a" stroke="#1f1f1f" strokeWidth="2" />

                        {/* USB Port slightly inset */}
                        <rect x="180" y="-8" width="40" height="12" rx="2" fill="#000000" stroke="#111" strokeWidth="2" />

                        {/* Keys */}
                        <motion.rect x="25" y="25" width="45" height="45" rx="6" style={{ fill: keyColor, filter: keyGlow }} />
                        <motion.rect x="80" y="25" width="45" height="45" rx="6" style={{ fill: keyColor, filter: keyGlow }} />
                        <motion.rect x="135" y="25" width="45" height="45" rx="6" style={{ fill: keyColor, filter: keyGlow }} />
                        <motion.rect x="190" y="25" width="130" height="45" rx="6" style={{ fill: keyColor, filter: keyGlow }} />
                        <motion.rect x="330" y="25" width="45" height="45" rx="6" style={{ fill: keyColor, filter: keyGlow }} />

                        <motion.rect x="25" y="80" width="70" height="25" rx="6" style={{ fill: keyColor, filter: keyGlow }} />
                        <motion.rect x="105" y="80" width="200" height="25" rx="6" style={{ fill: keyColor, filter: keyGlow }} />
                        <motion.rect x="315" y="80" width="60" height="25" rx="6" style={{ fill: keyColor, filter: keyGlow }} />
                    </g>
                </svg>

                {/* Content Appears after connection */}
                <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20"
                    style={{ opacity: contentOpacity, y: contentY }}
                >
                    <div className="mt-[400px] flex flex-col items-center gap-6 pointer-events-auto text-center px-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm text-white/80">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            System Online
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                            The Dream is Being Built.
                        </h2>
                        <a href="/login" className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform">
                            Start a Project
                        </a>
                    </div>
                </motion.div>

                {/* Scroll instruction text at very bottom */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-widest text-[#444] uppercase z-20"
                >
                    Scroll down
                </motion.div>
            </div>
        </motion.section>
    );
}
