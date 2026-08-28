"use client";

import { useTerminal } from "@/lib/store";

// Compact GitHub-style contribution heatmap rendered from live data.
const SHADES = [
  "rgba(120,120,130,0.16)", // level 0
  "rgba(91,138,114,0.40)", // 1
  "rgba(91,138,114,0.62)", // 2
  "rgba(91,138,114,0.82)", // 3
  "rgba(91,138,114,1)", // 4
];

export default function ActivityGraph() {
  const github = useTerminal((s) => s.github);
  if (!github || !github.weeks.length) return null;

  return (
    <div className="my-2 overflow-x-auto pb-1">
      <div className="flex gap-[3px]">
        {github.weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {Array.from({ length: 7 }).map((_, di) => {
              const level = week[di] ?? 0;
              return (
                <span
                  key={di}
                  className="h-[9px] w-[9px] rounded-[2px]"
                  style={{ background: SHADES[level] ?? SHADES[0] }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-500">
        <span>less</span>
        {SHADES.map((c) => (
          <span key={c} className="h-[9px] w-[9px] rounded-[2px]" style={{ background: c }} />
        ))}
        <span>more</span>
      </div>
    </div>
  );
}
