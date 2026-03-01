"use client";

import dynamic from "next/dynamic";

// Dynamically import the CinematicIntro component with SSR disabled
const CinematicIntro = dynamic(() => import("./cinematic-intro"), {
    ssr: false,
    loading: () => null,
});

export default function CinematicIntroWrapper() {
    return <CinematicIntro />;
}
