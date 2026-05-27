"use client";

import { useEffect, useState } from "react";
import { BlurFade } from "@/components/ui/blur-fade";

export function VideoBackground() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <BlurFade
      aria-hidden="true"
      duration={1.5}
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <video
        autoPlay={!reduceMotion}
        loop
        muted
        playsInline
        className="absolute inset-0 min-h-full min-w-full h-full w-full object-cover"
        style={{ backgroundColor: "#0f0a17", objectPosition: "94% center" }}
      >
        <source src="/ac32f8ae-5337-43b2-962a-3530a0a62770.mp4" type="video/mp4" />
      </video>
      <style>{`
        @media (min-width: 768px) {
          video { object-position: center center !important; }
        }
      `}</style>
    </BlurFade>
  );
}
