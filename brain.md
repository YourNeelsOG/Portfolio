# brain.md - Brainstorm Record

Decisions reached while shaping Neel's portfolio, with the reasoning behind each.

## The idea

A personal portfolio for **Neel** (`YourNeelsOG`), a junior software developer from
Bangladesh. It must feel unique, modern, and elegant - memorable to recruiters and
peers without being noisy. The hook: an **interactive Linux-style terminal** as the
entry and navigation device, themed around an ASCII-art portrait of Kisuke Urahara
used in place of a personal photo.

## Decisions & why

| Question | Decision | Why |
|----------|----------|-----|
| Terminal role | Interactive, then docks to top-right corner | Owner wants real commands, but the site must stay usable after - dock keeps it present without blocking content. |
| Navigation | Dual: type commands OR scroll/click | Nerds get the terminal; everyone else gets a normal site. No one is forced to "learn commands." |
| Tech stack | Next.js + React + Tailwind + TypeScript | Industry standard, deploys free on Vercel, shows off the owner's own stack. |
| Photo | Urahara ASCII art (from GitHub) | Owner does not want a personal photo; the art sets the whole aesthetic. |
| Sections | about · projects · skills · experience · contact | Matches the owner's real material; no blog, no CV download (explicit non-goals). |
| Content source | Pulled from GitHub profile | Real content over placeholders. Only LinkedIn/Discord/Codeforces are placeholders. |
| Visual direction | Light "smooth white" + monochrome + one accent | Owner's explicit pick. Mono suits the monochrome ASCII art; single accent keeps it elegant. |
| Accent | Muted "Urahara green" (~`#5b8a72`) | Ties to the character; used sparingly (cursor, links, focus). |
| Background | Textured white (grain + slow gradient drift) | Owner asked for "smooth white, not plain." Depth without distraction. |
| Ambient motion | Floating monochrome tech-stack SVG icons | Owner asked for floating SVG icons; parallax, low opacity, never over text. |

## Content pulled from GitHub

- **Name:** Neel · **Location:** Bangladesh
- **Bio line:** *"What are you looking for? I am already a Deadman!"* (Bleach; matches Urahara)
- **Email:** `contactwithyourneels@gmail.com` · **GitHub:** `YourNeelsOG`
- **Skills:** HTML, CSS, Java, JavaScript, TypeScript, Python, Bash, LaTeX, n8n, Google Apps Script
- **Work themes (become project cards):** self-hosted infrastructure · media & download tooling ·
  automation & workflows (scrapers, monitoring, bots) · codebase internals (concurrency, third-party patches)
- **Repos:** mostly forks (Byparr, ECC, Upload-Assistant, mamu_tuning). Projects lead with
  the *theme/skill*, with repo links as supporting evidence.

## Known gaps (placeholders)

- LinkedIn, Discord, Codeforces URLs - owner to provide; marked clearly in `content.ts`.
- Junior-dev role details (company/date) - light framing until owner confirms.

## Process notes

- Ran the ui-ux-pro-max design intelligence pass. It recommended a Cyberpunk (dark-only)
  style with a blue accent - **overridden** in favor of the owner's explicit light + mono +
  Urahara-green choice. Kept from it: the Archivo / Space Grotesk font pairing, the zinc
  monochrome color scale, the stagger-reveal motion preset, and the pre-delivery checklist.
- See `design.md` for the resolved visual system and `specs.md` for the functional spec.
