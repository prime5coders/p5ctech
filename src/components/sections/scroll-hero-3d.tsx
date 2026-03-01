"use client";

import { useRef, useState, useEffect, useCallback, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Environment, Text3D, Preload } from "@react-three/drei";
import * as THREE from "three";
import { motion, useTransform, useMotionValue } from "framer-motion";

const FONT_URL = "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json";

// ═══════════════════════════════════════════════
// Shared scroll progress ref — written by DOM, read by R3F
// ═══════════════════════════════════════════════
type ScrollRef = { current: number };

// ═══════════════════════════════════════════════
// Helper: Map range
// ═══════════════════════════════════════════════
function remap(v: number, inMin: number, inMax: number, outMin: number, outMax: number) {
    const t = Math.max(0, Math.min(1, (v - inMin) / (inMax - inMin)));
    return outMin + t * (outMax - outMin);
}

const DARK_COLOR = new THREE.Color("#111111");
const GOLD_COLOR = new THREE.Color("#FFD700");

// ═══════════════════════════════════════════════
// 3D SCENE — Wire Light Reveal & P5C Text
// ═══════════════════════════════════════════════
function Scene3D({ scrollRef }: { scrollRef: ScrollRef }) {
    const tubeGeoRef = useRef<THREE.TubeGeometry>(null);
    const wireGeoRef = useRef<THREE.TubeGeometry>(null);

    // Materials for the 3 letters
    const mP = useRef<THREE.MeshStandardMaterial>(null);
    const m5 = useRef<THREE.MeshStandardMaterial>(null);
    const mC = useRef<THREE.MeshStandardMaterial>(null);

    // Group refs for 3D geometric animation
    const gP = useRef<THREE.Group>(null);
    const g5 = useRef<THREE.Group>(null);
    const gC = useRef<THREE.Group>(null);

    const usbRef = useRef<THREE.Group>(null);

    // Dynamic lights
    const wireLightRef = useRef<THREE.PointLight>(null);
    const kbLightRef = useRef<THREE.RectAreaLight>(null);

    // Cable path looping strictly behind the letters
    const curve = useMemo(() => new THREE.CatmullRomCurve3([
        new THREE.Vector3(-5.0, 4.0, -3.0),  // Offscreen top-left

        // Deep BEHIND 'P' (-2.6, 0.8)
        new THREE.Vector3(-3.6, -0.5, -1.5), // Enter behind
        new THREE.Vector3(-2.6, 1.8, -2.5),  // Peak behind P

        // Dip behind between 'P' and '5'
        new THREE.Vector3(-1.3, -0.2, -1.5), // Valley behind

        // Deep BEHIND '5' (0, 0.8)
        new THREE.Vector3(0.0, 1.8, -2.5),   // Peak behind 5

        // Dip behind between '5' and 'C'
        new THREE.Vector3(1.3, -0.2, -1.5),  // Valley behind

        // Deep BEHIND 'C' (2.6, 0.8)
        new THREE.Vector3(2.6, 1.8, -2.5),   // Peak behind C

        // Exit right
        new THREE.Vector3(3.6, -0.5, -1.5),  // Right of C (behind)

        // Go down to keyboard at the bottom center of screen
        new THREE.Vector3(1.5, -2.5, -1.0),  // Sweeping down
        new THREE.Vector3(0.0, -2.5, -1.0),  // Meets the top of the keyboard 
        new THREE.Vector3(0.0, -2.7, -1.0),  // Stops right at the slot (won't extend below screen)
    ], false, "centripetal", 0.6), []);

    const TUBE_SEG = 1024, RAD_SEG = 16, WIRE_RAD = 32; // Higher density for braided look
    const totalIdx = TUBE_SEG * RAD_SEG * 6;
    const wireIdx = TUBE_SEG * WIRE_RAD * 6;

    // Fixed approximate centers of the letters (shifted up to clear bottom UI)
    const posP = new THREE.Vector3(-2.6, 0.8, 0);
    const pos5 = new THREE.Vector3(0, 0.8, 0);
    const posC = new THREE.Vector3(2.6, 0.8, 0);

    useFrame((state) => {
        const scroll = scrollRef.current; // 0 → 1

        // 1. Wire Draw (0.0 to 0.7)
        const wireT = remap(scroll, 0.0, 0.7, 0.0, 1.0);

        let wirePos = new THREE.Vector3(0, -100, 0); // Hide far away if wireT = 0
        if (wireT > 0.01) {
            wirePos = curve.getPointAt(wireT);

            // Draw geometry
            if (tubeGeoRef.current) tubeGeoRef.current.setDrawRange(0, Math.floor(totalIdx * wireT));
            if (wireGeoRef.current) wireGeoRef.current.setDrawRange(0, Math.floor(wireIdx * wireT));

            // Move USB Head
            if (usbRef.current) {
                usbRef.current.visible = true;
                const tan = curve.getTangentAt(wireT);
                usbRef.current.position.copy(wirePos.clone().add(tan.clone().multiplyScalar(0.18)));
                usbRef.current.lookAt(wirePos.clone().add(tan.clone().multiplyScalar(2)));
            }
        } else {
            if (tubeGeoRef.current) tubeGeoRef.current.setDrawRange(0, 0);
            if (wireGeoRef.current) wireGeoRef.current.setDrawRange(0, 0);
            if (usbRef.current) usbRef.current.visible = false;
        }

        // 2. Wire Point-Light following tip
        if (wireLightRef.current) {
            wireLightRef.current.position.copy(wirePos);
            // Light intensity spikes as drawing starts, then fades as kb light takes over
            wireLightRef.current.intensity = wireT > 0 && wireT < 1
                ? 10.0 * (1.0 - remap(scroll, 0.65, 0.75, 0.0, 1.0))
                : 0;
        }

        // 3. Keyboard RectAreaLight (Bottom-Up) (0.65 to 0.85)
        const kbProgress = remap(scroll, 0.65, 0.85, 0.0, 1.0);
        if (kbLightRef.current) {
            kbLightRef.current.intensity = kbProgress * 25.0; // Glow upward
        }

        // 4. Custom Letter Illumination
        // We calculate distance from the wire-head to each letter, bringing up emissive when close
        const updateLetter = (
            matRef: React.RefObject<THREE.MeshStandardMaterial | null>,
            groupRef: React.RefObject<THREE.Group | null>,
            letterPos: THREE.Vector3,
            index: number
        ) => {
            if (!matRef.current) return;

            // A) Wire Proximity Glow (only matters during scroll 0 -> 0.7)
            const dist = letterPos.distanceTo(wirePos);
            const wireFactor = Math.max(0, 1 - dist / 3.5);
            const wireInfluence = wireFactor * remap(scroll, 0.0, 0.7, 1.0, 0.0);

            // B) Keyboard Upward Wash
            let kbInfluence = kbProgress * 1.5;

            // C) 3D Animation when fully connected
            if (kbProgress > 0.8) {
                const t = state.clock.elapsedTime;
                // Offset the pulse for each letter: P -> 5 -> C
                const phase = index * 0.5;
                const pulse = (Math.sin(t * 1.5 - phase) + 1.0) / 2.0; // 0.0 to 1.0, slower rhythm
                const connectStrength = remap(kbProgress, 0.8, 1.0, 0.0, 1.0);

                // Add a very subtle, soft luxury glow instead of a bright surge
                kbInfluence += pulse * 0.3 * connectStrength;

                // 3D Geometric effect (Scale and Float)
                if (groupRef.current) {
                    const floatY = Math.sin(t * 2.0 - phase) * 0.1 * connectStrength;
                    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, floatY, 0.1);

                    const scaleT = 1.0 + (pulse * 0.07 * connectStrength);
                    groupRef.current.scale.lerp(new THREE.Vector3(scaleT, scaleT, 1.0 + (pulse * 0.1 * connectStrength)), 0.1);
                }
            } else {
                // Return to base state
                if (groupRef.current) {
                    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.1);
                    groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
                }
            }

            // Combine with lower ceiling for cinematic subtlety
            const targetEmissive = Math.max(wireInfluence * 2.0, kbInfluence);

            // Smoothly lerp towards target intensity
            matRef.current.emissiveIntensity = THREE.MathUtils.lerp(
                matRef.current.emissiveIntensity,
                targetEmissive,
                0.05 // Slower, softer transition
            );

            // Base color shifts from Obsidian Black to a sophisticated Light Copper Mixed Gold
            const COPPER_GOLD_COLOR = new THREE.Color("#CF9166"); // Premium Copper Gold
            const OBSIDIAN_COLOR = new THREE.Color("#0B0B0C");

            const colorBlend = Math.min(targetEmissive / 1.5, 1.0);
            matRef.current.color.lerpColors(OBSIDIAN_COLOR, COPPER_GOLD_COLOR, colorBlend);
        };

        updateLetter(mP, gP, posP, 0);
        updateLetter(m5, g5, pos5, 1);
        updateLetter(mC, gC, posC, 2);
    });

    return (
        <group>
            {/* Dynamic Lights */}
            <pointLight
                ref={wireLightRef}
                color="#FFB800"
                distance={5}
                decay={2}
                intensity={0}
            />

            {/* RectAreaLight emulates large glowing keyboard surface below */}
            <rectAreaLight
                ref={kbLightRef}
                color="#FFD700"
                width={12}
                height={3}
                intensity={0}
                position={[0, -4, 2]}
                lookAt={[0, 0, 0]}
            />

            {/* P5C TEXT */}
            <Suspense fallback={null}>
                <Center position={posP.toArray()} scale={0.7}>
                    <group ref={gP}>
                        <Text3D font={FONT_URL} size={2.0} height={0.3} curveSegments={32}
                            bevelEnabled bevelThickness={0.08} bevelSize={0.04} bevelSegments={5}>
                            P
                            <meshStandardMaterial ref={mP} color="#0B0B0C" roughness={0.2}
                                metalness={0.95} emissive="#FFFFFF" emissiveIntensity={0} />
                        </Text3D>
                    </group>
                </Center>
                <Center position={pos5.toArray()} scale={0.7}>
                    <group ref={g5}>
                        <Text3D font={FONT_URL} size={2.0} height={0.3} curveSegments={32}
                            bevelEnabled bevelThickness={0.08} bevelSize={0.04} bevelSegments={5}>
                            5
                            <meshStandardMaterial ref={m5} color="#0B0B0C" roughness={0.2}
                                metalness={0.95} emissive="#FFFFFF" emissiveIntensity={0} />
                        </Text3D>
                    </group>
                </Center>
                <Center position={posC.toArray()} scale={0.7}>
                    <group ref={gC}>
                        <Text3D font={FONT_URL} size={2.0} height={0.3} curveSegments={32}
                            bevelEnabled bevelThickness={0.08} bevelSize={0.04} bevelSegments={5}>
                            C
                            <meshStandardMaterial ref={mC} color="#0B0B0C" roughness={0.2}
                                metalness={0.95} emissive="#FFFFFF" emissiveIntensity={0} />
                        </Text3D>
                    </group>
                </Center>
            </Suspense>

            {/* CABLE LOOPING */}
            <mesh castShadow receiveShadow>
                <tubeGeometry ref={tubeGeoRef} args={[curve, TUBE_SEG, 0.12, RAD_SEG, false]} />
                <meshStandardMaterial color="#A47E3B" roughness={0.5} metalness={0.7} />
            </mesh>
            <mesh>
                <tubeGeometry ref={wireGeoRef} args={[curve, TUBE_SEG, 0.125, WIRE_RAD, false]} />
                <meshStandardMaterial color="#D4AF37" roughness={0.7} metalness={0.5} wireframe />
            </mesh>

            {/* USB HEAD */}
            <group ref={usbRef}>
                <mesh position={[0, 0, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.08, 0.12, 0.1, 16]} />
                    <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
                </mesh>
                <mesh position={[0, 0, 0.15]}>
                    <boxGeometry args={[0.22, 0.12, 0.35]} />
                    <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />
                </mesh>
                <mesh position={[0, 0, 0.34]}>
                    <boxGeometry args={[0.23, 0.13, 0.04]} />
                    <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
                </mesh>
                <mesh position={[0, 0, 0.44]}>
                    <boxGeometry args={[0.18, 0.06, 0.16]} />
                    <meshStandardMaterial color="#d4d4d8" metalness={0.9} roughness={0.2} />
                </mesh>
            </group>

            {/* Minimal Background Illumination */}
            <Environment preset="city" background={false} />
            <ambientLight intensity={0.05} />
            {/* Top-down directional light is removed or kept very low to heighten the reveal effect */}
            <directionalLight position={[5, 10, 5]} intensity={0.1} castShadow />
        </group>
    );
}

// ═══════════════════════════════════════════════
// ROOT COMPONENT
// Uses a direct scroll listener to bridge DOM scroll → R3F render loop
// ═══════════════════════════════════════════════
export default function GoldenHero() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Plain ref that the scroll listener writes to and useFrame reads from.
    const scrollRef = useRef(0);

    // Framer MotionValue for the HTML-side animations (keyboard glow etc.)
    const scrollMV = useMotionValue(0);

    // HTML glowing tracks scroll progress (0.5 to 1.0)
    const keyColor = useTransform(scrollMV, [0.5, 0.8], ["#151515", "#FFD700"]);
    const keyGlow = useTransform(scrollMV, [0.5, 0.8],
        ["drop-shadow(0px 0px 0px rgba(255,215,0,0))",
            "drop-shadow(0px 0px 15px rgba(255,215,0,0.8))"]);

    // Calculate scroll progress relative to this container
    const updateScroll = useCallback(() => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const sectionHeight = el.offsetHeight - window.innerHeight;
        if (sectionHeight <= 0) return;

        const progress = Math.min(Math.max(-rect.top / sectionHeight, 0), 1);
        scrollRef.current = progress;
        scrollMV.set(progress);
    }, [scrollMV]);

    useEffect(() => {
        window.addEventListener("scroll", updateScroll, { passive: true });
        updateScroll();
        return () => window.removeEventListener("scroll", updateScroll);
    }, [updateScroll]);

    return (
        <section ref={containerRef} className="w-full relative bg-black text-white" style={{ height: "300vh" }}>
            <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">

                {/* 3D CANVAS - Fullscreen Absolute */}
                <div className="absolute inset-0 z-0 w-full h-full">
                    <Suspense fallback={null}>
                        <Canvas
                            shadows
                            gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
                            camera={{ position: [0, 0, 10], fov: 45 }}
                        >
                            <Suspense fallback={null}>
                                <Scene3D scrollRef={scrollRef} />
                            </Suspense>
                            <Preload all />
                        </Canvas>
                    </Suspense>
                </div>

                {/* UI OVERLAY */}
                <div className="absolute inset-0 z-10 w-full h-full flex flex-col justify-end items-center pb-4 pointer-events-none">

                    {/* CTA TEXT */}
                    <motion.div
                        style={{ opacity: useTransform(scrollMV, [0.6, 0.9], [0, 1]) }}
                        className="flex flex-col items-center text-center px-4 mb-8 pointer-events-auto"
                    >
                        <h2 className="font-playfair italic font-normal text-2xl md:text-3xl text-[#C0A062] tracking-[0.15em] drop-shadow-md uppercase">
                            The Dream is Being Built.
                        </h2>
                        <a href="/login"
                            className="mt-6 px-10 py-3 rounded-full bg-gradient-to-r from-[#FFD700] to-[#C0A062] text-black font-bold text-base hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)]">
                            Start a Project
                        </a>
                    </motion.div>

                    {/* KEYBOARD */}
                    <div className="w-full flex justify-center pointer-events-auto">
                        <svg viewBox="0 0 400 150" className="w-[280px] md:w-[380px]" preserveAspectRatio="xMidYMax meet">
                            <g transform="translate(0, 20)">
                                <rect x="0" y="0" width="400" height="120" rx="10" fill="#0a0a0a" stroke="#1f1f1f" strokeWidth="2" />
                                <rect x="180" y="-8" width="40" height="12" rx="2" fill="#000000" stroke="#FFD700" strokeWidth="1" />

                                {/* Animated glowing keys */}
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
                    </div>

                    <div className="text-center text-[10px] tracking-widest text-[#888] uppercase mt-2 mb-2 pointer-events-none">
                        Scroll down
                    </div>
                </div>
            </div>
        </section>
    );
}
