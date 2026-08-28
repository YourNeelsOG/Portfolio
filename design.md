# design.md - Visual & Interaction System

The resolved design system for the portfolio. Derived from the ui-ux-pro-max pass,
reconciled with the owner's explicit choices (light, monochrome, one accent).

## 1. Principles

1. **Monochrome-first.** Black/near-black on smooth textured white. Color is an event,
   not a default.
2. **The terminal is the brand.** Every heading, section label, and state echoes a
   Linux terminal without becoming a costume.
3. **Ambient, never noisy.** Background texture and floating icons stay at the edge of
   perception. Content is always the loudest thing.
4. **Elegant restraint.** Generous space, precise type, one accent. No neon, no glitch
   spam - the ASCII art carries the "tech" mood.

## 2. Color tokens

Monochrome zinc scale + a single muted-green accent. Light is the intended, designed
mode (the tool's "light mode = anti-pattern" note is intentionally overridden - this
site is light by design).

| Role | Hex | CSS variable | Use |
|------|-----|--------------|-----|
| Background | `#FAFAFA` | `--color-background` | Page canvas (with texture on top) |
| Foreground | `#09090B` | `--color-foreground` | Primary text |
| Primary | `#18181B` | `--color-primary` | Terminal body, UI surfaces |
| On primary | `#FFFFFF` | `--color-on-primary` | Text on dark surfaces |
| Secondary | `#3F3F46` | `--color-secondary` | Secondary text |
| Muted | `#E8ECF0` | `--color-muted` | Subtle fills |
| Border | `#E4E4E7` | `--color-border` | Hairlines, card edges |
| Accent (Urahara green) | `#5B8A72` | `--color-accent` | Prompt cursor, links, focus ring, active command |
| Destructive | `#DC2626` | `--color-destructive` | `command not found`, errors |

Contrast: foreground on background and on-primary on primary both clear WCAG AA. Accent
is used for non-text-critical emphasis; where it carries text, it sits on dark surfaces.

## 3. Typography

| Role | Family | Fallback | Notes |
|------|--------|----------|-------|
| Terminal / code / labels | **JetBrains Mono** | `ui-monospace, SFMono-Regular, Menlo, monospace` | All terminal output, section prompts (`~$ cat about.md`), code, tags. |
| Headings | **Archivo** | `system-ui, sans-serif` | Section titles, name. Weights 300–700. |
| Body | **Space Grotesk** | `system-ui, sans-serif` | Paragraphs, card copy. Weights 300–700. |

- Base size 16px, body line-height 1.5. Headings tight (1.05–1.2).
- Google Fonts, loaded via `next/font` (self-hosted, no layout shift).

## 4. Effects & texture

- **Background texture:** faint SVG/CSS film grain overlay (~3–5% opacity) + a very slow
  drifting radial-gradient mesh in near-white grays. Fixed behind all content.
- **Terminal window:** rounded corners, soft large-radius shadow, dark surface
  (`--color-primary`), traffic-light dots, titlebar `neel@portfolio: ~`.
- **Floating icons:** monochrome devicon SVGs (Python, JS, TS, Java, Bash, LaTeX, HTML,
  CSS), ~6–10% opacity, slow drift + mouse/scroll parallax.
- **Focus ring:** 2px accent-green outline, always visible for keyboard users.
- No neon glow, no scanlines, no glitch - deliberately dropped from the tool's Cyberpunk
  suggestion.

## 5. Motion

Framer Motion for window/section transitions; GSAP only if the icon field needs it.

- **Entry (hero):** black hold ~600ms → terminal slides up from bottom to center,
  ease-out, scale `0.96→1`, fade, subtle blur-in. ~500–700ms.
- **Dock:** terminal scales down and translates to top-right corner, ~400ms, ease-in-out.
  Reverse on re-open.
- **Typewriter:** boot text types at a readable cadence; cursor blinks ~1s cycle.
- **Section reveal (stagger preset from ui-ux-pro-max):**
  ```js
  gsap.from('.reveal-item', {
    opacity: 0, scale: 0.92, y: 16, duration: 0.4,
    stagger: { each: 0.06, from: 'start' }, ease: 'back.out(1.4)'
  });
  ```
- Durations 150–450ms. Exits faster than entrances. **`prefers-reduced-motion`**
  disables slide, typewriter, drift, and stagger - content appears immediately.

## 6. Layout & responsive

- Content max-width ~1120px, centered, generous gutters.
- Breakpoints: 375 / 768 / 1024 / 1440.
- **Mobile:** terminal becomes a near-fullscreen sheet; dock is a smaller tap target;
  icon field thins; ASCII art scales down. No horizontal scroll. Zoom not disabled.
- Touch targets ≥ 44×44px, ≥ 8px apart.

## 7. Component inventory

| Component | One job |
|-----------|---------|
| `BootTerminal` | Black screen + slide-up + typewriter boot sequence. |
| `Terminal` | The window shell (chrome, buffer, input). |
| `TerminalDock` | Corner icon + expand/collapse state. |
| `CommandEngine` | Parse input → actions. Single source of command truth. |
| `FloatingIcons` | Ambient drifting SVG field. |
| `TexturedBg` | Grain + drifting gradient background. |
| `About` / `Projects` / `Skills` / `Experience` / `Contact` | Section content. |
| `SectionHeading` | Renders `~$ cat <name>.md` prompt-style headers. |

## 8. Pre-delivery checklist (from ui-ux-pro-max)

- [ ] No emojis as icons - SVG only (Lucide / devicon).
- [ ] `cursor-pointer` on all clickable elements.
- [ ] Hover states with 150–300ms transitions.
- [ ] Text contrast ≥ 4.5:1 (light mode).
- [ ] Visible focus states for keyboard nav.
- [ ] `prefers-reduced-motion` respected.
- [ ] Responsive at 375 / 768 / 1024 / 1440.
