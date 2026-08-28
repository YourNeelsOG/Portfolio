"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Small original line-glyphs (not brand logos) - monochrome, stroke-based.
const Braces = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 4a3 3 0 0 0-3 3v2a2 2 0 0 1-2 2 2 2 0 0 1 2 2v2a3 3 0 0 0 3 3" />
    <path d="M16 4a3 3 0 0 1 3 3v2a2 2 0 0 0 2 2 2 2 0 0 0-2 2v2a3 3 0 0 1-3 3" />
  </svg>
);
const Terminal = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="m7 9 3 3-3 3M13 15h4" />
  </svg>
);
const Code = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="m8 6-6 6 6 6M16 6l6 6-6 6" />
  </svg>
);
const GitBranch = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="2.5" /><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="8" r="2.5" />
    <path d="M6 8.5v7M18 10.5c0 4-6 1.5-6 5.5" />
  </svg>
);
const Hash = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />
  </svg>
);
const Database = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="8" ry="3" />
    <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
  </svg>
);
const Cpu = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="6" width="12" height="12" rx="2" /><rect x="9" y="9" width="6" height="6" rx="1" />
    <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
  </svg>
);
const Command = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 6a3 3 0 1 1 3 3h-3ZM9 6a3 3 0 1 0-3 3h3Zm0 0v12a3 3 0 1 1-3-3h12a3 3 0 1 0-3 3V6" />
  </svg>
);

type Spec = { icon: ReactNode; top: string; left: string; size: number; depth: number; dur: number; rot: number };

const ICONS: Spec[] = [
  { icon: Braces, top: "14%", left: "8%", size: 46, depth: 26, dur: 13, rot: -8 },
  { icon: Terminal, top: "68%", left: "6%", size: 54, depth: 40, dur: 16, rot: 6 },
  { icon: Code, top: "26%", left: "86%", size: 50, depth: 34, dur: 15, rot: 10 },
  { icon: GitBranch, top: "78%", left: "82%", size: 44, depth: 22, dur: 12, rot: -6 },
  { icon: Hash, top: "48%", left: "92%", size: 38, depth: 18, dur: 18, rot: 12 },
  { icon: Database, top: "40%", left: "3%", size: 40, depth: 30, dur: 17, rot: -10 },
  { icon: Cpu, top: "88%", left: "40%", size: 42, depth: 24, dur: 14, rot: 8 },
  { icon: Command, top: "8%", left: "56%", size: 40, depth: 20, dur: 19, rot: -4 },
];

export default function FloatingIcons() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        const root = ref.current;
        if (!root) return;
        for (const el of Array.from(root.children) as HTMLElement[]) {
          const d = Number(el.dataset.depth || 0);
          el.style.setProperty("--px", `${-nx * d}px`);
          el.style.setProperty("--py", `${-ny * d}px`);
        }
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-[5] hidden sm:block">
      {ICONS.map((s, i) => (
        <div
          key={i}
          data-depth={s.depth}
          className="absolute text-zinc-900/[0.07] transition-transform duration-500 ease-out"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            transform: "translate3d(var(--px,0), var(--py,0), 0)",
          }}
        >
          <div
            className="h-full w-full"
            style={{
              // @ts-expect-error custom prop
              "--rot": `${s.rot}deg`,
              animation: `floatY ${s.dur}s ease-in-out ${i * 0.7}s infinite`,
            }}
          >
            {s.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
