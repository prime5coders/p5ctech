"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { Text } from "@react-three/drei";

function Scene() {
    const gridRef = useRef<THREE.GridHelper>(null);
    const textGroupRef = useRef<THREE.Group>(null);
    const particlesRef = useRef<THREE.Points>(null);
    const { camera } = useThree();

    useEffect(() => {
        const tl = gsap.timeline();

        // 1. Initial Setup: Camera close, Grid hidden down below
        camera.position.set(0, 0, 2);
        camera.rotation.set(0, 0, 0);

        if (gridRef.current) {
            gridRef.current.position.y = -10;
            const mat = gridRef.current.material as THREE.Material;
            mat.transparent = true;
            mat.opacity = 0;
        }

        if (textGroupRef.current) {
            textGroupRef.current.scale.set(1, 1, 1);
        }

        if (particlesRef.current) {
            particlesRef.current.scale.set(2, 2, 2);
            (particlesRef.current.material as THREE.Material).opacity = 0;
        }

        // 2. Floating Code shatters and particles appear
        tl.to(textGroupRef.current?.scale || {}, {
            x: 0, y: 0, z: 0,
            duration: 0.8,
            ease: "power2.in", // snap shrink
            delay: 1.2 // 1.2s of floating code observation
        }, "shatter");

        if (particlesRef.current) {
            tl.to(particlesRef.current.material, {
                opacity: 1, duration: 0.2
            }, "shatter");

            tl.to(particlesRef.current.scale, {
                x: 0, y: 0, z: 0,
                duration: 1.5,
                ease: "power3.out"
            }, "shatter+=0.2");
        }

        // 3. Neon Grid Forms and Fly In
        if (gridRef.current) {
            tl.to(gridRef.current.position, {
                y: -2,
                duration: 2.0,
                ease: "power3.out"
            }, "gridForm");

            tl.to(gridRef.current.material, {
                opacity: 0.4,
                duration: 1.5
            }, "gridForm");
        }

        // 4. Camera cinematic zoom/drift indicating website revealing
        tl.to(camera.position, {
            z: 5,
            y: 0.5,
            duration: 2.5,
            ease: "power3.inOut"
        }, "gridForm+=0.5");

        tl.to(camera.rotation, {
            x: -0.1,
            duration: 2.5,
            ease: "power3.inOut"
        }, "gridForm+=0.5");

        return () => {
            tl.kill(); // Cleanup
        };
    }, [camera]);

    useFrame((state) => {
        // Continuous subtle animation in the background
        if (gridRef.current) {
            gridRef.current.position.z = (state.clock.elapsedTime * 1.5) % 2; // Moving floor effect
        }
        if (textGroupRef.current) {
            textGroupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
        }
        if (particlesRef.current) {
            particlesRef.current.rotation.y = state.clock.elapsedTime * 0.2;
        }
    });

    // Generate random particle field
    const particleCount = 1500;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
        particlePositions[i] = (Math.random() - 0.5) * 15;
    }

    return (
        <>
            {/* Deep Dark Space */}
            <color attach="background" args={["#030014"]} />
            <ambientLight intensity={0.5} />

            {/* 1. Floating Code Layer */}
            <group ref={textGroupRef}>
                <Text position={[-1.5, 0.8, -1]} fontSize={0.25} color="#00ffff" material-toneMapped={false} fillOpacity={0.8}>
                    {"<div className=\"flex w-full\">"}
                </Text>
                <Text position={[1.2, -0.5, -2]} fontSize={0.2} color="#8a2be2" material-toneMapped={false} fillOpacity={0.8}>
                    {"import { motion } from 'framer-motion';"}
                </Text>
                <Text position={[0, 0, 0]} fontSize={0.4} color="#ffffff" material-toneMapped={false}>
                    {"const SYSTEM_ONLINE = true;"}
                </Text>
                <Text position={[-0.8, -0.8, -1.5]} fontSize={0.15} color="#00ffff" material-toneMapped={false} fillOpacity={0.6}>
                    {"function renderUI() { return <Grid />; }"}
                </Text>
            </group>

            {/* 2. Particle Shatter Layer */}
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particleCount}
                        array={particlePositions}
                        itemSize={3}
                        args={[particlePositions, 3]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.03}
                    color="#00ffff"
                    transparent
                    opacity={0}
                    toneMapped={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* 3. Neon Grid Layer */}
            {/* args: [size, divisions, color1 (center lines), color2 (grid lines)] */}
            <gridHelper ref={gridRef} args={[60, 60, 0x00ffff, 0x8a2be2]} position={[0, -10, 0]} />
        </>
    );
}

export default function HeroGridScene() {
    return (
        <div className="absolute inset-0 -z-0 bg-[#030014]">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
            >
                <Scene />
            </Canvas>
        </div>
    );
}
