"use client";

import { create } from "zustand";

export type Phase = "boot" | "open" | "docked";

export type GithubRepo = {
  name: string;
  description: string | null;
  stars: number;
  language: string | null;
  url: string;
  fork: boolean;
  updated: string;
};

export type GithubData = {
  user: { public_repos: number; followers: number; following: number } | null;
  repos: GithubRepo[];
  weeks: number[][];
  totalContributions: number;
};

export type Line =
  | { kind: "input"; text: string }
  | { kind: "output"; text: string; tone?: "normal" | "accent" | "error" }
  | { kind: "node"; id: string }; // special rendered block (e.g. neofetch)

type State = {
  phase: Phase;
  lines: Line[];
  history: string[]; // past commands for arrow-up recall
  booted: boolean;
  github: GithubData | null;

  setPhase: (p: Phase) => void;
  dock: () => void;
  openTerminal: () => void;
  print: (line: Line | Line[]) => void;
  pushHistory: (cmd: string) => void;
  clear: () => void;
  markBooted: () => void;
  setGithub: (g: GithubData) => void;
};

export const useTerminal = create<State>((set) => ({
  phase: "boot",
  lines: [],
  history: [],
  booted: false,
  github: null,

  setPhase: (p) => set({ phase: p }),
  dock: () => set({ phase: "docked" }),
  openTerminal: () => set({ phase: "open" }),
  print: (line) =>
    set((s) => ({ lines: [...s.lines, ...(Array.isArray(line) ? line : [line])] })),
  pushHistory: (cmd) => set((s) => ({ history: [...s.history, cmd] })),
  clear: () => set({ lines: [] }),
  markBooted: () => set({ booted: true }),
  setGithub: (g) => set({ github: g }),
}));
