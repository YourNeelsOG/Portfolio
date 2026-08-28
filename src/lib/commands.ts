"use client";

import { profile, socials, skills, projects, experience } from "@/data/content";
import type { Line, GithubData } from "@/lib/store";

export const SECTIONS = ["about", "projects", "skills", "experience", "contact"] as const;
export type Section = (typeof SECTIONS)[number];

export type CommandResult = {
  lines: Line[];
  navigateTo?: Section; // triggers scroll + dock
  clear?: boolean;
};

const out = (text: string, tone: "normal" | "accent" | "error" = "normal"): Line => ({
  kind: "output",
  text,
  tone,
});

const HELP: Line[] = [
  out("Available commands:", "accent"),
  out("  about        who I am"),
  out("  projects     what I build"),
  out("  skills       my stack"),
  out("  experience   the timeline"),
  out("  contact      how to reach me"),
  out("  socials      my links"),
  out("  whoami       short version"),
  out("  neofetch     the boot card again"),
  out("  repos        live repos from GitHub"),
  out("  activity     my GitHub contribution graph"),
  out("  clear        wipe the screen"),
  out("  help         this list"),
  out("tip: `cat about.md` works, and press Tab to autocomplete.", "accent"),
];

// Commands offered for Tab-completion / ghost hints.
export const COMPLETIONS = [
  "about",
  "projects",
  "skills",
  "experience",
  "contact",
  "socials",
  "whoami",
  "neofetch",
  "repos",
  "activity",
  "help",
  "clear",
  "cat about.md",
  "cat projects",
  "cat skills.json",
  "cat experience.log",
  "cat contact.sh",
];

// Longest common completion for the current input, or null.
export function getCompletion(value: string): string | null {
  const v = value.toLowerCase();
  if (!v) return null;
  const match = COMPLETIONS.find((c) => c.startsWith(v) && c !== v);
  return match ?? null;
}

// The single source of command truth - shared by boot + docked terminals.
// `ctx` carries live data (GitHub) that some commands render.
export function runCommand(raw: string, ctx?: { github?: GithubData | null }): CommandResult {
  const cmd = raw.trim().toLowerCase();

  if (cmd === "") return { lines: [] };

  const parts = cmd.split(/\s+/);
  const verb = parts[0];

  // Map a filename-ish argument to a section: about.md, skills.json,
  // experience.log, contact.sh, projects/* all resolve to their section.
  const toSection = (arg: string | undefined): Section | null => {
    if (!arg) return null;
    const base = arg
      .replace(/\.(md|json|log|sh|txt)$/, "")
      .replace(/\/\*?$/, "");
    return (SECTIONS as readonly string[]).includes(base) ? (base as Section) : null;
  };

  // Bare section name, e.g. `about`.
  if (toSection(verb)) {
    return { lines: [out(`opening ${verb}…`, "accent")], navigateTo: toSection(verb)! };
  }

  // `cat about.md`, `open skills.json`, etc.
  if (verb === "cat" || verb === "open" || verb === "less") {
    const section = toSection(parts[1]);
    if (section) {
      return { lines: [out(`opening ${section}…`, "accent")], navigateTo: section };
    }
    if (!parts[1]) return { lines: [out(`usage: ${verb} <section>  e.g. ${verb} about.md`, "error")] };
    return { lines: [out(`${verb}: ${parts[1]}: No such file or directory`, "error")] };
  }

  switch (cmd) {
    case "help":
      return { lines: HELP };

    case "clear":
      return { lines: [], clear: true };

    case "whoami":
      return { lines: [out(`${profile.name} - ${profile.role}, ${profile.location}.`)] };

    case "socials":
      return {
        lines: socials.map((s) =>
          out(`  ${s.label.padEnd(11)} ${s.handle}${s.todo ? "  (coming soon)" : ""}`),
        ),
      };

    case "neofetch":
      return { lines: [{ kind: "node", id: "neofetch" }] };

    case "repos":
    case "github": {
      const g = ctx?.github;
      if (!g) return { lines: [out("fetching from GitHub… run `repos` again in a second.", "accent")] };
      if (!g.repos.length) return { lines: [out("no public repos found.", "error")] };
      const top = g.repos.slice(0, 6);
      const lines: Line[] = [
        out(`github.com/${profile.handle} — ${g.user?.public_repos ?? g.repos.length} repos, ${g.user?.followers ?? 0} followers`, "accent"),
      ];
      for (const r of top) {
        const star = `★ ${r.stars}`.padEnd(5);
        const lang = (r.language ?? "").padEnd(12);
        lines.push(out(`  ${star} ${lang} ${r.name}${r.fork ? " (fork)" : ""}`));
      }
      lines.push(out("open the projects section for the highlights.", "accent"));
      return { lines };
    }

    case "activity":
    case "contrib":
    case "graph": {
      const g = ctx?.github;
      if (!g) return { lines: [out("fetching contribution data… try `activity` again shortly.", "accent")] };
      return {
        lines: [
          out(`${g.totalContributions} contributions in the last year:`, "accent"),
          { kind: "node", id: "activity" },
        ],
      };
    }

    // Easter eggs
    case "sudo":
    case "sudo su":
      return { lines: [out("Nice try. You are not in the sudoers file. This incident will be reported. 🕶", "error")] };
    case "ls":
      return { lines: [out("about  projects  skills  experience  contact  secrets/")] };
    case "ls secrets":
    case "ls secrets/":
      return { lines: [out("Permission denied. Even I don't go in there.", "error")] };
    case "bankai":
      return {
        lines: [
          out("Ban-kai.", "accent"),
          out("Benihime, awaken. …just kidding, this is a portfolio.", "normal"),
        ],
      };
    case "exit":
    case "quit":
      return { lines: [out("There's no escape. Try 'help' instead. 😉")] };

    default:
      return {
        lines: [
          out(`command not found: ${cmd}`, "error"),
          out("type 'help' to see what's available."),
        ],
      };
  }
}

// Rich text blocks for section-command output rendered inside the terminal
// (kept short - the full sections live on the page).
export function sectionSummary(section: Section): Line[] {
  switch (section) {
    case "about":
      return [out(profile.tagline)];
    case "projects":
      return projects.map((p) => out(`  • ${p.title}`));
    case "skills":
      return skills.map((s) => out(`  ${s.group}: ${s.items.join(", ")}`));
    case "experience":
      return experience.map((e) => out(`  [${e.when}] ${e.title}`));
    case "contact":
      return socials.map((s) => out(`  ${s.label}: ${s.handle}`));
  }
}
