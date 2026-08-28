"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { profile } from "@/data/content";
import { useTerminal } from "@/lib/store";
import { asset } from "@/lib/asset";

// The fastfetch-style profile card: ASCII Urahara portrait + key/value stats.
// Used both in the boot sequence and by the `neofetch` command.
export default function Neofetch() {
  const github = useTerminal((s) => s.github);
  const rows: [string, string][] = [
    ["host", `${profile.name}@portfolio`],
    ["role", profile.role],
    ["location", profile.location],
    ["uptime", "since forever (I am already a Deadman)"],
    ["shell", "zsh - with too many aliases"],
    ["editor", "neovim, obviously"],
    ["stack", "TypeScript · Python · Linux"],
  ];
  if (github?.user) {
    rows.push(["github", `${github.user.public_repos} repos · ${github.user.followers} followers`]);
  }

  // Match the art height to the info block so their bottoms line up (fastfetch
  // style). ResizeObserver keeps it aligned when the terminal or fonts change.
  const infoRef = useRef<HTMLDivElement>(null);
  const [artH, setArtH] = useState<number | null>(null);
  useEffect(() => {
    const el = infoRef.current;
    if (!el) return;
    const update = () => setArtH(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="my-2 flex flex-col items-center gap-4 sm:flex-row sm:items-stretch sm:gap-6">
      {/* Black background is baked into the source art; mix-blend-screen drops it
          onto the near-black terminal so it reads as transparent. Height is set to
          the info block height so the art ends exactly where the text ends. */}
      <Image
        src={asset(profile.avatar)}
        alt="ASCII-art portrait of Kisuke Urahara"
        width={220}
        height={220}
        priority
        style={{ height: artH ?? 128, width: "auto" }}
        className="block shrink-0 object-contain mix-blend-screen"
      />

      <div ref={infoRef} className="min-w-0 text-[13px] leading-relaxed">
        <div className="text-[color:var(--color-accent)]">
          {profile.name}
          <span className="text-zinc-500">@</span>
          portfolio
        </div>
        <div className="mb-1 text-zinc-600">{"-".repeat(22)}</div>
        {rows.map(([k, v]) => (
          <div key={k} className="flex gap-2">
            <span className="w-[68px] shrink-0 text-[color:var(--color-accent)]">{k}</span>
            <span className="text-zinc-300">{v}</span>
          </div>
        ))}
        <div className="mt-2 flex gap-1">
          {["#18181b", "#3f3f46", "#5b8a72", "#a1a1aa", "#e4e4e7"].map((c) => (
            <span
              key={c}
              className="h-3 w-5 rounded-sm"
              style={{ background: c }}
              aria-hidden
            />
          ))}
        </div>
      </div>
    </div>
  );
}
