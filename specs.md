# specs.md - Functional Specification

Portfolio website for Neel (`YourNeelsOG`). Terminal-themed, Urahara aesthetic.
Companion docs: `brain.md` (decisions), `design.md` (visual system).

## Stack

Next.js (App Router) + React + TypeScript + Tailwind CSS + Framer Motion (+ GSAP if
needed). Content in one typed `data/content.ts`. Deploy: Vercel. Repo: git.

## Feature 1 - Entry sequence

- On load: full **black screen**, held ~600ms.
- **Terminal window slides up from bottom to center** (Super+T style): ease-out, scale
  up, fade, subtle blur-in. Window chrome: traffic-light dots + titlebar `neel@portfolio: ~`.
- Terminal **auto-types a fastfetch-style boot**: ASCII Urahara portrait (left) + profile
  summary (right - name, role "junior software developer", Bangladesh, a playful uptime
  line, the Deadman bio line).
- Ends at a live prompt with blinking cursor: `neel@portfolio:~$ █` and hint
  `type 'help' or click anywhere to explore`.
- `prefers-reduced-motion`: terminal shown already-open, content visible, no typewriter.

## Feature 2 - Interactive terminal

- Real typed input, blinking cursor, command history (↑/↓). Optional tab-autocomplete.
- Commands: `help`, `about`, `projects`, `skills`, `experience`, `contact`, `socials`,
  `whoami`, `neofetch`, `clear`.
- Easter eggs: `sudo` (cheeky denial), `ls`, `bankai` (Bleach nod).
- Unknown input → `command not found` (destructive color) + hint to try `help`.
- `CommandEngine` is the single source of command truth, shared by boot + docked states.

## Feature 3 - Dock behavior

- First navigation (a section command OR a click outside the terminal) → terminal
  **shrinks and flies to the top-right corner** as a taskbar-style icon/pill; site fades
  in beneath.
- Clicking the corner icon **re-expands** the terminal (reverse animation from top-right).
- Terminal persists site-wide; retains history and buffer.

## Feature 4 - Main site

- **Background:** textured smooth white - grain overlay + slow drifting gradient mesh
  (`TexturedBg`), fixed behind content.
- **Floating icons:** monochrome devicon SVGs (Python, JS, TS, Java, Bash, LaTeX, HTML,
  CSS) drifting with parallax, low opacity (`FloatingIcons`).
- **Sections** (reachable by scroll AND terminal command), headers styled `~$ cat <name>.md`:
  - **about** - Urahara ASCII portrait + bio/narrative.
  - **projects** - cards by work theme (self-hosted infra · media/download tooling ·
    automation & workflows · codebase internals) with supporting repo links.
  - **skills** - HTML, CSS, Java, JS, TS, Python, Bash, LaTeX, n8n, Google Apps Script.
  - **experience** - timeline: Computer Technology student → junior software developer.
  - **contact** - email `contactwithyourneels@gmail.com` (real), GitHub `YourNeelsOG`
    (real); **placeholders** for LinkedIn, Discord, Codeforces.

## Feature 5 - Responsive & accessibility

- Breakpoints 375 / 768 / 1024 / 1440. No horizontal scroll. Zoom enabled.
- Mobile: terminal = near-fullscreen sheet; dock smaller; icon field thinned; art scaled.
- Reduced motion respected. Keyboard-navigable, visible focus. Text contrast ≥ 4.5:1.
- Touch targets ≥ 44×44px.

## Non-goals (YAGNI)

No CMS/DB, no blog, no CV/resume download, no personal photo (Urahara art instead),
no auth, no backend beyond static hosting.

## Acceptance criteria

- [ ] Black screen → terminal slide-up boot plays on load (skipped under reduced-motion).
- [ ] Boot shows ASCII Urahara + profile summary, ends at live prompt.
- [ ] All listed commands work; unknown commands handled gracefully.
- [ ] First nav docks the terminal to top-right; clicking it re-expands.
- [ ] All five sections reachable by both scroll and command; real content present.
- [ ] Textured white background + floating monochrome icons render, non-distracting.
- [ ] Responsive at all four breakpoints; passes the `design.md` pre-delivery checklist.
- [ ] Placeholders (LinkedIn/Discord/Codeforces, role details) clearly marked in `content.ts`.

## Open items (resolve during build / owner input)

- Exact accent green hex (start `#5B8A72`).
- ASCII-portrait treatment on white (dark panel vs. invert).
- Real URLs for LinkedIn / Discord / Codeforces.
- Shared state: React context vs. Zustand.
