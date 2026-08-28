"use client";

import { useEffect, useRef } from "react";

// Smooth-but-not-flat white canvas, layered for a dev/terminal feel:
//   1. base wash
//   2. fine dot grid (graph-paper / blueprint)
//   3. slow drifting gradient mesh (with a whisper of accent)
//   4. cursor-following spotlight (interactive accent glow)
//   5. film grain
// All layers are fixed behind content with pointer-events off.
export default function TexturedBg() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        el.style.setProperty("--mx", `${e.clientX}px`);
        el.style.setProperty("--my", `${e.clientY}px`);
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ ["--mx" as string]: "50vw", ["--my" as string]: "40vh" }}
    >
      {/* Base wash */}
      <div className="absolute inset-0 bg-[color:var(--color-background)]" />

      {/* Fine dot grid, denser toward the top, fading out lower */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(24,24,27,0.14) 1px, transparent 1.4px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(120% 90% at 50% 0%, #000 35%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(120% 90% at 50% 0%, #000 35%, transparent 78%)",
          opacity: 0.6,
        }}
      />

      {/* Drifting gradient mesh - very low contrast grays + a whisper of accent */}
      <div
        className="mesh-drift absolute -inset-[20%] opacity-80"
        style={{
          background:
            "radial-gradient(38% 38% at 18% 22%, rgba(91,138,114,0.10), transparent 70%)," +
            "radial-gradient(42% 42% at 82% 18%, rgba(24,24,27,0.06), transparent 70%)," +
            "radial-gradient(48% 48% at 66% 82%, rgba(63,63,70,0.06), transparent 70%)",
        }}
      />

      {/* Cursor spotlight - interactive accent glow */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(340px circle at var(--mx) var(--my), rgba(91,138,114,0.10), transparent 60%)",
        }}
      />

      {/* Faint accent scan-hairline sweeping very slowly (adds subtle motion) */}
      <div
        className="scan-sweep absolute inset-x-0 h-px opacity-40"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(91,138,114,0.5), transparent)",
        }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "160px 160px",
        }}
      />
    </div>
  );
}
