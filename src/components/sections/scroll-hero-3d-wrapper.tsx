"use client";

import dynamic from "next/dynamic";

export const GoldenHeroDynamic = dynamic(
    () => import("@/components/sections/scroll-hero-3d").then((mod) => mod.default),
    {
        ssr: false,
        loading: () => <div className="w-full h-screen bg-black" />
    }
);
