// ===========================================
// Premium 3D Hero Background
// Abstract gold, white, and glass elements
// ===========================================

"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Instance, Instances, Ring } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// ---------- Central Complex Shape ----------
function CentralTorusKnot() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    });

    return (
        <Float speed={1.5} rotationIntensity={1} floatIntensity={1.5}>
            <mesh ref={meshRef} position={[3, 0, -2]} scale={1.2}>
                <torusKnotGeometry args={[1, 0.3, 128, 32]} />
                {/* Premium Glass Material */}
                <MeshTransmissionMaterial
                    backside
                    samples={4}
                    thickness={0.5}
                    chromaticAberration={0.05}
                    anisotropy={0.1}
                    distortion={0.2}
                    distortionScale={0.5}
                    temporalDistortion={0.1}
                    color="#ffffff"
                    roughness={0.1}
                    metalness={0.1}
                    transmission={1}
                />
            </mesh>
            {/* Inner Gold Core */}
            <mesh position={[3, 0, -2]} scale={0.7}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial
                    color="#ecc94b" // Gold
                    metalness={1}
                    roughness={0.2}
                    emissive="#b7791f"
                    emissiveIntensity={0.2}
                />
            </mesh>
        </Float>
    );
}

// ---------- Orbital Rings ----------
function GoldRings() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!groupRef.current) return;
        groupRef.current.rotation.x = state.clock.elapsedTime * 0.1;
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    });

    return (
        <group ref={groupRef} position={[3, 0, -2]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2.5, 0.02, 16, 100]} />
                <meshStandardMaterial color="#ecc94b" metalness={1} roughness={0.1} />
            </mesh>
            <mesh rotation={[0, Math.PI / 3, 0]}>
                <torusGeometry args={[3.2, 0.015, 16, 100]} />
                <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} transparent opacity={0.6} />
            </mesh>
            <mesh rotation={[Math.PI / 4, 0, Math.PI / 4]}>
                <torusGeometry args={[4, 0.01, 16, 100]} />
                <meshStandardMaterial color="#ecc94b" metalness={1} roughness={0.2} transparent opacity={0.4} />
            </mesh>
        </group>
    );
}

// ---------- Floating Gold/White Spheres ----------
function FloatingSpheres() {
    const count = 15;
    const spheres = useMemo(() => {
        return Array.from({ length: count }, () => {
            const isGold = Math.random() > 0.6;
            return {
                position: [
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 10,
                    -2 - Math.random() * 8
                ] as [number, number, number],
                scale: 0.1 + Math.random() * 0.4,
                speed: 0.2 + Math.random() * 0.8,
                isGold,
            };
        });
    }, []);

    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!groupRef.current) return;
        groupRef.current.children.forEach((child, i) => {
            const sphere = child as THREE.Mesh;
            const data = spheres[i];
            sphere.position.y += Math.sin(state.clock.elapsedTime * data.speed + i) * 0.005;
            sphere.rotation.x += 0.01 * data.speed;
        });
    });

    return (
        <group ref={groupRef}>
            {spheres.map((data, i) => (
                <Float key={i} speed={data.speed} rotationIntensity={1} floatIntensity={2}>
                    <mesh position={data.position} scale={data.scale}>
                        <icosahedronGeometry args={[1, 1]} />
                        {data.isGold ? (
                            <meshStandardMaterial color="#d69e2e" metalness={0.9} roughness={0.1} />
                        ) : (
                            <MeshTransmissionMaterial
                                color="#ffffff"
                                roughness={0}
                                transmission={0.9}
                                thickness={1}
                            />
                        )}
                    </mesh>
                </Float>
            ))}
        </group>
    );
}

// ---------- Glass Panels ----------
function FloatingPanels() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!groupRef.current) return;
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
    });

    return (
        <group ref={groupRef}>
            <Float speed={1.2} rotationIntensity={0.5} floatIntensity={1}>
                <mesh position={[-4, 2, -4]} rotation={[0.2, 0.5, -0.2]}>
                    <boxGeometry args={[3, 4, 0.1]} />
                    <MeshTransmissionMaterial
                        color="#ffffff"
                        roughness={0.1}
                        transmission={0.9}
                        thickness={0.5}
                        chromaticAberration={0.03}
                    />
                </mesh>
            </Float>
            <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.5}>
                <mesh position={[-3, -3, -3]} rotation={[-0.2, -0.4, 0.1]}>
                    <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
                    <MeshTransmissionMaterial
                        color="#fefcbf" // hint of gold
                        roughness={0.05}
                        transmission={1}
                        thickness={0.8}
                    />
                </mesh>
            </Float>
        </group>
    );
}

// ---------- Ambient Dust Particles ----------
function DustParticles() {
    const count = 100;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
        }
        return pos;
    }, []);

    const pointsRef = useRef<THREE.Points>(null);

    useFrame((state) => {
        if (!pointsRef.current) return;
        pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
        pointsRef.current.rotation.x = state.clock.elapsedTime * 0.02;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                color="#f6e05e" // Soft gold
                size={0.04}
                transparent
                opacity={0.4}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

export default function Hero3DScene() {
    return (
        <div className="absolute inset-0 z-0" style={{ pointerEvents: "none" }}>
            <Canvas
                camera={{ position: [0, 0, 8], fov: 45 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true, toneMappingExposure: 1.2 }}
                style={{ background: "transparent" }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
                <directionalLight position={[-10, -5, -5]} intensity={0.5} color="#ecc94b" />

                {/* 3D Elements */}
                <CentralTorusKnot />
                <GoldRings />
                <FloatingSpheres />
                <FloatingPanels />
                <DustParticles />
            </Canvas>
        </div>
    );
}
