"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTerminal, type Line } from "@/lib/store";
import { runCommand, sectionSummary, getCompletion, type Section } from "@/lib/commands";
import Neofetch from "@/components/Neofetch";
import ActivityGraph from "@/components/ActivityGraph";

const PROMPT = "neel@portfolio:~$";

const BOOT_LOG = [
  "Booting neel@portfolio…",
  "[  ok  ] mounted /home/neel",
  "[  ok  ] loaded persona: urahara.kisuke",
  "[  ok  ] started interactive shell",
  "",
];

function scrollToSection(id: Section) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function LineView({ line }: { line: Line }) {
  if (line.kind === "node") {
    if (line.id === "neofetch") return <Neofetch />;
    if (line.id === "activity") return <ActivityGraph />;
    return null;
  }
  if (line.kind === "input")
    return (
      <div className="flex gap-2">
        <span className="shrink-0 text-[color:var(--color-accent)]">{PROMPT}</span>
        <span className="text-zinc-100">{line.text}</span>
      </div>
    );
  const tone =
    line.tone === "accent"
      ? "text-[color:var(--color-accent)]"
      : line.tone === "error"
        ? "text-[color:var(--color-destructive)]"
        : "text-zinc-300";
  return <div className={`whitespace-pre-wrap ${tone}`}>{line.text || " "}</div>;
}

export default function Terminal() {
  const { phase, lines, booted, print, clear, pushHistory, markBooted, dock, openTerminal } =
    useTerminal();
  const reduce = useReducedMotion();

  const [value, setValue] = useState("");
  const [histIdx, setHistIdx] = useState<number | null>(null);
  const [maximized, setMaximized] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  // Drag the window by its titlebar (ignoring clicks on the control buttons).
  const startDrag = (e: React.PointerEvent) => {
    if (maximized) return;
    if ((e.target as HTMLElement).closest("button")) return;
    e.preventDefault();
    const sx = e.clientX;
    const sy = e.clientY;
    const { x, y } = pos;
    const move = (ev: PointerEvent) => setPos({ x: x + ev.clientX - sx, y: y + ev.clientY - sy });
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  // Resize from the bottom-right corner.
  const startResize = (e: React.PointerEvent) => {
    if (maximized) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = windowRef.current?.getBoundingClientRect();
    const sx = e.clientX;
    const sy = e.clientY;
    const w0 = size?.w ?? rect?.width ?? 720;
    const h0 = size?.h ?? rect?.height ?? 520;
    const move = (ev: PointerEvent) =>
      setSize({
        w: Math.max(360, Math.min(window.innerWidth - 24, w0 + ev.clientX - sx)),
        h: Math.max(260, Math.min(window.innerHeight - 24, h0 + ev.clientY - sy)),
      });
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bootStarted = useRef(false);

  // Boot sequence (runs once)
  useEffect(() => {
    if (bootStarted.current || booted) return;
    bootStarted.current = true;

    if (reduce) {
      print(BOOT_LOG.map((t) => ({ kind: "output", text: t }) as Line));
      print({ kind: "node", id: "neofetch" });
      print({ kind: "output", text: "type 'help' or click anywhere to explore.", tone: "accent" });
      markBooted();
      return;
    }

    let cancelled = false;
    (async () => {
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
      for (const t of BOOT_LOG) {
        if (cancelled) return;
        await wait(230);
        print({ kind: "output", text: t });
      }
      await wait(180);
      print({ kind: "node", id: "neofetch" });
      await wait(260);
      print({ kind: "output", text: "type 'help' or click anywhere to explore.", tone: "accent" });
      markBooted();
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  // Keep view pinned to the newest line.
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines, phase]);

  // Focus the input whenever the terminal is interactive & visible, but never
  // steal focus while the user has text selected (that would clear a copy).
  useEffect(() => {
    if (!booted || phase === "docked") return;
    const sel = typeof window !== "undefined" ? window.getSelection() : null;
    if (sel && !sel.isCollapsed) return;
    inputRef.current?.focus();
  }, [booted, phase, lines]);

  const submit = useCallback(
    (raw: string) => {
      print({ kind: "input", text: raw });
      if (raw.trim()) pushHistory(raw);
      const res = runCommand(raw, { github: useTerminal.getState().github });
      if (res.clear) {
        clear();
        return;
      }
      print(res.lines);
      if (res.navigateTo) {
        print(sectionSummary(res.navigateTo));
        const target = res.navigateTo;
        // Let the exit animation play, then dock + scroll.
        setTimeout(() => {
          dock();
          scrollToSection(target);
        }, 260);
      }
    },
    [print, pushHistory, clear, dock],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { history } = useTerminal.getState();
    if (e.key === "Tab") {
      e.preventDefault();
      const completion = getCompletion(value);
      if (completion) {
        setValue(completion);
        setHistIdx(null);
      }
    } else if (e.key === "Enter") {
      submit(value);
      setValue("");
      setHistIdx(null);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next = histIdx === null ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(next);
      setValue(history[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === null) return;
      const next = histIdx + 1;
      if (next >= history.length) {
        setHistIdx(null);
        setValue("");
      } else {
        setHistIdx(next);
        setValue(history[next]);
      }
    }
  };

  const onBackdrop = () => {
    if (!booted) return;
    dock();
  };

  const ghost = booted ? getCompletion(value) : null;
  const showWindow = phase === "boot" || phase === "open";

  return (
    <>
      {/* Boot black screen / open backdrop */}
      <AnimatePresence>
        {phase === "boot" && (
          <motion.div
            key="boot-bg"
            className="fixed inset-0 z-40 bg-black"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
        {phase === "open" && (
          <motion.div
            key="open-bg"
            onClick={onBackdrop}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>

      {/* Terminal window */}
      <AnimatePresence mode="wait">
        {showWindow && (
          <motion.div
            key="term"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial="hidden"
            animate="show"
            exit="dock"
            variants={{
              hidden:
                phase === "open"
                  ? { opacity: 0, scale: 0.1, x: "42vw", y: "-40vh" }
                  : { opacity: 0, y: reduce ? 0 : "55vh", scale: 0.98 },
              show: { opacity: 1, scale: 1, x: 0, y: 0 },
              dock: reduce
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.08, x: "44vw", y: "-42vh" },
            }}
            transition={{ type: "spring", stiffness: 210, damping: 26 }}
            style={{ pointerEvents: "none" }}
          >
            <div
              ref={windowRef}
              onClick={(e) => {
                e.stopPropagation();
                // Don't grab focus if the user just selected text to copy.
                const sel = window.getSelection();
                if (sel && !sel.isCollapsed) return;
                inputRef.current?.focus();
              }}
              style={
                maximized
                  ? {
                      pointerEvents: "auto",
                      position: "fixed",
                      top: 12,
                      left: 12,
                      right: 12,
                      bottom: 12,
                    }
                  : {
                      pointerEvents: "auto",
                      width: size ? size.w : "min(94vw, 760px)",
                      height: size ? size.h : "min(74vh, 560px)",
                      transform: `translate(${pos.x}px, ${pos.y}px)`,
                    }
              }
              className="relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#101013] shadow-2xl shadow-black/50 ring-1 ring-black/5"
            >
              {/* Titlebar. Drag to move; the three dots are window controls:
                  red closes (docks), yellow minimises (docks), green toggles maximise. */}
              <div
                onPointerDown={startDrag}
                className={`group/dots flex items-center gap-2 border-b border-white/5 bg-[#17171b] px-4 py-3 ${
                  maximized ? "" : "cursor-grab active:cursor-grabbing"
                }`}
              >
                <button
                  onClick={onBackdrop}
                  aria-label="Close terminal"
                  title="Close"
                  className="flex h-3 w-3 cursor-pointer items-center justify-center rounded-full bg-[#ff5f57] text-[8px] font-bold leading-none text-black/60 transition-transform hover:scale-110"
                >
                  <span className="opacity-0 group-hover/dots:opacity-100">×</span>
                </button>
                <button
                  onClick={onBackdrop}
                  aria-label="Minimise terminal"
                  title="Minimise"
                  className="flex h-3 w-3 cursor-pointer items-center justify-center rounded-full bg-[#febc2e] text-[8px] font-bold leading-none text-black/60 transition-transform hover:scale-110"
                >
                  <span className="opacity-0 group-hover/dots:opacity-100">−</span>
                </button>
                <button
                  onClick={() => setMaximized((m) => !m)}
                  aria-label={maximized ? "Restore terminal size" : "Maximise terminal"}
                  title={maximized ? "Restore" : "Maximise"}
                  className="flex h-3 w-3 cursor-pointer items-center justify-center rounded-full bg-[#28c840] text-[7px] font-bold leading-none text-black/60 transition-transform hover:scale-110"
                >
                  <span className="opacity-0 group-hover/dots:opacity-100">{maximized ? "▪" : "＋"}</span>
                </button>
                <span className="ml-2 select-none font-mono text-xs text-zinc-400">
                  {PROMPT.replace("$", "")} - zsh
                </span>
              </div>

              {/* Body */}
              <div
                ref={bodyRef}
                className="term-scroll flex-1 cursor-text select-text overflow-y-auto px-4 py-3 font-mono text-[13px] leading-relaxed"
              >
                {lines.map((l, i) => (
                  <LineView key={i} line={l} />
                ))}

                {booted && (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="shrink-0 text-[color:var(--color-accent)]">{PROMPT}</span>
                    <div className="relative flex-1">
                      <input
                        ref={inputRef}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={onKeyDown}
                        spellCheck={false}
                        autoComplete="off"
                        aria-label="Terminal command input"
                        className="w-full bg-transparent text-zinc-100 caret-transparent outline-none"
                      />
                      {/* ghost completion hint (press Tab to accept) */}
                      {ghost && (
                        <span
                          className="pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-pre text-zinc-600"
                          style={{ left: `${value.length}ch` }}
                        >
                          {ghost.slice(value.length)}
                          <span className="ml-2 rounded border border-zinc-700 px-1 text-[10px] text-zinc-600">
                            tab
                          </span>
                        </span>
                      )}
                      {/* faux cursor */}
                      <span
                        className="cursor-blink pointer-events-none absolute top-1/2 -translate-y-1/2"
                        style={{ left: `${value.length}ch` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Resize grip (bottom-right corner) */}
              {!maximized && (
                <div
                  onPointerDown={startResize}
                  className="absolute bottom-0 right-0 z-10 h-4 w-4 cursor-nwse-resize"
                  aria-hidden
                >
                  <svg viewBox="0 0 16 16" className="h-full w-full text-zinc-600">
                    <path d="M15 6 6 15M15 11l-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Docked pill (top-right) */}
      <AnimatePresence>
        {phase === "docked" && (
          <motion.button
            key="dock"
            onClick={() => openTerminal()}
            initial={{ opacity: 0, scale: 0.6, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="fixed right-4 top-4 z-50 flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-[#101013] px-3 py-2 font-mono text-xs text-zinc-200 shadow-lg shadow-black/30 transition-colors hover:border-[color:var(--color-accent)]/60"
            aria-label="Open terminal"
          >
            <span className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
              <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
              <span className="h-2 w-2 rounded-full bg-[#28c840]" />
            </span>
            <span className="text-[color:var(--color-accent)]">~/neel</span>
            <span className="cursor-blink !h-3" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
