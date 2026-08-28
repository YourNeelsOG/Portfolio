"use client";

import { useEffect } from "react";
import { useTerminal } from "@/lib/store";
import TexturedBg from "@/components/TexturedBg";
import FloatingIcons from "@/components/FloatingIcons";
import Terminal from "@/components/Terminal";
import { About, Projects, Skills, Experience, Contact } from "@/components/Sections";
import { profile } from "@/data/content";

export default function Home() {
  const phase = useTerminal((s) => s.phase);
  const setGithub = useTerminal((s) => s.setGithub);

  // Pull live GitHub data once; the terminal's `repos` / `activity` commands
  // and the neofetch card read it from the store.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/github")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && !cancelled) setGithub(d);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [setGithub]);

  // Lock body scroll while the terminal owns the screen (boot / modal-open).
  useEffect(() => {
    const lock = phase === "boot" || phase === "open";
    document.body.style.overflow = lock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  return (
    <>
      <TexturedBg />
      <FloatingIcons />
      <Terminal />

      <main className="relative">
        {/* Slim hero band */}
        <header className="mx-auto flex min-h-[52vh] w-full max-w-[1120px] flex-col justify-center px-6 pt-24">
          <p className="font-mono text-sm text-[color:var(--color-accent)]">
            <span className="text-zinc-400">~$</span> whoami
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl font-700 tracking-tight text-[color:var(--color-foreground)] sm:text-7xl">
            {profile.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[color:var(--color-secondary)] sm:text-xl">
            {profile.role} · {profile.location}. Infra, automation, and the internals of
            code - with a soft spot for the command line.
          </p>
          <p className="mt-6 font-mono text-xs text-zinc-400">
            open the terminal (top-right) anytime, or scroll on ▾
          </p>
        </header>

        <About />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>
    </>
  );
}
