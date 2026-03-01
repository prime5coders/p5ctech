"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useRef, useEffect, useState, Suspense } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { Text, RoundedBox, useGLTF } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";

// --- Home Office Scene ---
function Scene({ onComplete }: { onComplete: () => void }) {
    const doorLeft = useRef<THREE.Mesh>(null);
    const doorRight = useRef<THREE.Mesh>(null);
    const hallLight = useRef<THREE.SpotLight>(null);
    const officeLight = useRef<THREE.PointLight>(null);
    const cameraGroup = useRef<THREE.Group>(null);

    const holograms = useRef<THREE.Group>(null);
    const { camera } = useThree();

    useEffect(() => {
        const tl = gsap.timeline();

        // 1. Initial Void Setup (Camera outside in the hall, cool blue)
        if (cameraGroup.current) {
            cameraGroup.current.position.set(0, 1.5, 15);
        }

        // 2. Smooth tracking shot towards the door
        tl.to(cameraGroup.current?.position || {}, {
            z: 5, duration: 3.5, ease: "power2.inOut"
        }, "track");

        // 3. Doors automatically slide open as we approach
        if (doorLeft.current && doorRight.current) {
            tl.to(doorLeft.current.position, {
                x: -2.5, duration: 2.5, ease: "power2.inOut"
            }, "track+=2");
            tl.to(doorRight.current.position, {
                x: 2.5, duration: 2.5, ease: "power2.inOut"
            }, "track+=2");
        }

        // 4. Lighting shift: Warm glow from the office spills out
        if (officeLight.current) {
            tl.to(officeLight.current, {
                intensity: 6, duration: 2.5, ease: "power2.out"
            }, "track+=2.2");
        }

        // 5. Camera fluidly moves through the door into the Home Office
        tl.to(cameraGroup.current?.position || {}, {
            z: -4, y: 1.8, duration: 4, ease: "power2.inOut"
        }, "track+=3.5");

        // 6. Holograms assemble and rotate up
        if (holograms.current) {
            const children = holograms.current.children;
            children.forEach((child, index) => {
                // Initialize out of place
                child.position.y -= 2;
                (child as any).material.opacity = 0;

                tl.to(child.position, {
                    y: child.userData.targetY,
                    duration: 1.5,
                    ease: "back.out(1.2)"
                }, `track+=${4.5 + index * 0.2}`);

                tl.to((child as any).material, {
                    opacity: 0.8,
                    duration: 1
                }, `track+=${4.5 + index * 0.2}`);
            });
        }

        // 7. Fade out and signal complete
        tl.to({}, { duration: 1.5, onComplete: () => onComplete() }, "track+=8.5");

        return () => {
            tl.kill();
        };
    }, [camera, onComplete]);

    useFrame((state) => {
        // Subtle floating of holograms
        if (holograms.current) {
            holograms.current.children.forEach((child, index) => {
                // Only bob if it has finished arriving
                if ((child as any).material.opacity > 0.5) {
                    child.position.y = child.userData.targetY + Math.sin(state.clock.elapsedTime * 2 + index) * 0.05;
                }
            });
        }
    });

    return (
        <group>
            {/* The Camera rig */}
            <group ref={cameraGroup}>
                <primitive object={camera} />
            </group>

            {/* ----- The Hallway (Exterior) / Cool Blue ----- */}
            <ambientLight intensity={0.1} color="#002244" />

            <spotLight ref={hallLight} position={[0, 5, 8]} angle={0.8} penumbra={0.5} intensity={4} color="#0088ff" />

            {/* Hallway Walls */}
            <mesh position={[-4, 2, 5]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[20, 10]} />
                <meshStandardMaterial color="#050505" roughness={0.8} />
            </mesh>
            <mesh position={[4, 2, 5]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[20, 10]} />
                <meshStandardMaterial color="#050505" roughness={0.8} />
            </mesh>

            {/* The Wall enclosing the office */}
            <mesh position={[0, 2, 0]}>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial color="#0a0a0c" roughness={0.9} />
            </mesh>

            {/* Sleek Matte Black Doors */}
            <mesh ref={doorLeft} position={[-1.25, 2, 0.1]} castShadow>
                <boxGeometry args={[2.5, 6, 0.1]} />
                <meshStandardMaterial color="#111111" metalness={0.2} roughness={0.9} />
                {/* Glowing LED Handle - Left */}
                <mesh position={[1.1, 0, 0.06]}>
                    <capsuleGeometry args={[0.02, 0.4, 4, 8]} />
                    <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
                </mesh>
            </mesh>
            <mesh ref={doorRight} position={[1.25, 2, 0.1]} castShadow>
                <boxGeometry args={[2.5, 6, 0.1]} />
                <meshStandardMaterial color="#111111" metalness={0.2} roughness={0.9} />
                {/* Glowing LED Handle - Right */}
                <mesh position={[-1.1, 0, 0.06]}>
                    <capsuleGeometry args={[0.02, 0.4, 4, 8]} />
                    <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
                </mesh>
            </mesh>


            {/* ----- The Home Office (Interior) / Warm Inviting Glow ----- */}
            <pointLight ref={officeLight} position={[0, 3, -6]} intensity={0} color="#ffaa44" distance={20} decay={2} castShadow />
            <ambientLight intensity={0.2} color="#ffaa44" />

            {/* Office Floor */}
            <mesh position={[0, -1, -8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[20, 20]} />
                {/* Wooden floor feel */}
                <meshStandardMaterial color="#1a120b" roughness={0.6} metalness={0.1} />
            </mesh>

            {/* Glass Desk */}
            <mesh position={[0, 0.5, -8]} castShadow receiveShadow>
                <boxGeometry args={[6, 0.1, 2.5]} />
                <meshPhysicalMaterial
                    color="#ffffff"
                    transmission={0.9}
                    opacity={1}
                    metalness={0}
                    roughness={0}
                    ior={1.5}
                    thickness={0.5}
                />
            </mesh>
            {/* Desk Legs */}
            <mesh position={[-2.8, -0.25, -8]} castShadow>
                <boxGeometry args={[0.2, 1.5, 2]} />
                <meshStandardMaterial color="#222222" metalness={0.8} />
            </mesh>
            <mesh position={[2.8, -0.25, -8]} castShadow>
                <boxGeometry args={[0.2, 1.5, 2]} />
                <meshStandardMaterial color="#222222" metalness={0.8} />
            </mesh>

            {/* Glowing Computer Core on Desk */}
            <mesh position={[-2, 0.7, -8.5]}>
                <boxGeometry args={[0.5, 0.3, 0.5]} />
                <meshStandardMaterial color="#222222" emissive="#00aaff" emissiveIntensity={0.5} />
            </mesh>

            {/* Vibrant Holographic UI Elements floating above desk */}
            <group ref={holograms} position={[0, 0, -8.5]}>
                {/* Center Main Screen (Hero) */}
                <mesh userData={{ targetY: 2 }}>
                    <planeGeometry args={[3.5, 2]} />
                    <meshStandardMaterial color="#00aaff" emissive="#00aaff" emissiveIntensity={0.8} transparent opacity={0} side={THREE.DoubleSide} />
                    <Text position={[0, 0.3, 0.01]} fontSize={0.3} color="#ffffff">P5C TECH</Text>
                    <Text position={[0, -0.2, 0.01]} fontSize={0.15} color="#e0e0e0">Engineering the Future</Text>
                </mesh>

                {/* Left Panel (Stats/Services) */}
                <mesh position={[-2.5, 0, 0.5]} rotation={[0, 0.4, 0]} userData={{ targetY: 1.8 }}>
                    <planeGeometry args={[1.5, 2.5]} />
                    <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.6} transparent opacity={0} side={THREE.DoubleSide} />
                    <Text position={[0, 0.8, 0.01]} fontSize={0.15} color="#ffffff">PERFORMANCE</Text>
                    <Text position={[0, 0.4, 0.01]} fontSize={0.3} color="#ffffff">99.9%</Text>
                </mesh>

                {/* Right Panel (Code/Data) */}
                <mesh position={[2.5, 0, 0.5]} rotation={[0, -0.4, 0]} userData={{ targetY: 1.8 }}>
                    <planeGeometry args={[1.5, 2.5]} />
                    <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.5} transparent opacity={0} side={THREE.DoubleSide} />
                    <Text position={[-0.6, 0.8, 0.01]} fontSize={0.1} color="#ffffff" anchorX="left">{"const sys = init();"}</Text>
                    <Text position={[-0.6, 0.5, 0.01]} fontSize={0.1} color="#ffffff" anchorX="left">{"await sys.boot();"}</Text>
                    <Text position={[-0.6, 0.2, 0.01]} fontSize={0.1} color="#ffffff" anchorX="left">{"data.flow(true);"}</Text>
                </mesh>

                {/* Floating Navigation Bar Graphic */}
                <mesh position={[0, 0, 1]} rotation={[-0.2, 0, 0]} userData={{ targetY: 0.8 }}>
                    <planeGeometry args={[4, 0.3]} />
                    <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} transparent opacity={0} side={THREE.DoubleSide} />
                </mesh>
            </group>

            {/* Post Processing for the LED and Hologram Bloom */}
            <EffectComposer>
                <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} />
            </EffectComposer>

        </group>
    );
}

export default function CinematicIntro() {
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleComplete = () => {
        setFadeOut(true);
        setTimeout(() => setVisible(false), 2000);
    };

    const [hasError, setHasError] = useState(false);

    if (!mounted || !visible) return null;

    if (hasError) {
        // Graceful degradation fallback
        return (
            <AnimatePresence>
                {!fadeOut && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="fixed inset-0 z-[100] bg-[#030508] flex items-center justify-center"
                    >
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-white mb-4">P5C TECH</h1>
                            <p className="text-muted-foreground">Engineering the Future</p>
                            <button
                                onClick={handleComplete}
                                className="mt-8 px-6 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
                            >
                                Enter Site
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    // We force a 16:9 aspect ratio container to assure cinematic framing
    return (
        <AnimatePresence>
            {!fadeOut && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] bg-black flex items-center justify-center pointer-events-none"
                >
                    <div className="relative w-full h-full max-w-[100vw] max-h-[56.25vw] sm:max-h-[100vh] sm:max-w-[177.78vh] bg-black overflow-hidden shadow-2xl">
                        <Suspense fallback={<div className="w-full h-full bg-[#030508]" />}>
                            <Canvas
                                shadows
                                dpr={[1, 2]}
                                camera={{ position: [0, 1.5, 15], fov: 50 }}
                                gl={{
                                    antialias: true,
                                    alpha: false,
                                    failIfMajorPerformanceCaveat: true
                                }}
                                onCreated={({ gl }) => {
                                    // Watch for context loss
                                    gl.domElement.addEventListener('webglcontextlost', (e) => {
                                        e.preventDefault();
                                        setHasError(true);
                                    });
                                }}
                            >
                                <color attach="background" args={["#030508"]} />
                                <Scene onComplete={handleComplete} />
                            </Canvas>
                        </Suspense>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
