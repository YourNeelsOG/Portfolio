"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { profile, skills, projects, experience, socials } from "@/data/content";

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay, ease: [0.2, 0.65, 0.3, 0.9] }}
    >
      {children}
    </motion.div>
  );
}

function Heading({ file, title }: { file: string; title: string }) {
  return (
    <div className="mb-8">
      <p className="font-mono text-xs text-[color:var(--color-accent)] sm:text-sm">
        <span className="text-zinc-400">~$</span> cat {file}
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-600 tracking-tight text-[color:var(--color-foreground)] sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto w-full max-w-[1120px] scroll-mt-24 px-6 py-20 sm:py-28">
      {children}
    </section>
  );
}

// About
export function About() {
  return (
    <Section id="about">
      <Heading file="about.md" title="About" />
      <div className="grid items-center gap-10 md:grid-cols-[300px_1fr]">
        <Reveal>
          <div className="mx-auto w-fit rounded-xl border border-[color:var(--color-border)] bg-[#0d0d0f] p-3 shadow-xl shadow-black/20">
            <Image
              src={profile.avatar}
              alt="ASCII-art portrait of Kisuke Urahara"
              width={260}
              height={260}
              className="h-[240px] w-[240px] rounded-lg object-cover"
            />
            <p className="mt-2 text-center font-mono text-[11px] text-zinc-500">
              ./persona --render ascii
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div>
            <p className="font-mono text-sm text-[color:var(--color-accent)]">
              &ldquo;{profile.bio}&rdquo;
            </p>
            <p className="mt-4 text-lg leading-relaxed text-[color:var(--color-secondary)]">
              {profile.tagline}
            </p>
            <p className="mt-4 leading-relaxed text-[color:var(--color-secondary)]">
              I&rsquo;m {profile.name}, a {profile.role.toLowerCase()} based in{" "}
              {profile.location}. I like the layer most people skip - the shell, the server,
              the internals of code I didn&rsquo;t write - and making it all behave.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

// Projects
export function Projects() {
  return (
    <Section id="projects">
      <Heading file="projects/*" title="What I build" />
      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.06}>
            <article className="group h-full rounded-xl border border-[color:var(--color-border)] bg-white/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--color-accent)]/50 hover:shadow-lg hover:shadow-black/5">
              <h3 className="font-[family-name:var(--font-display)] text-xl font-600 text-[color:var(--color-foreground)]">
                {p.title}
              </h3>
              <p className="mt-2 leading-relaxed text-[color:var(--color-secondary)]">{p.blurb}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-[color:var(--color-border)] px-2 py-0.5 font-mono text-[11px] text-zinc-500"
                  >
                    {t}
                  </span>
                ))}
              </div>
              {p.links && (
                <div className="mt-4 flex flex-wrap gap-4">
                  {p.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs text-[color:var(--color-accent-strong)] underline-offset-4 hover:underline"
                    >
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

// Skills
export function Skills() {
  return (
    <Section id="skills">
      <Heading file="skills.json" title="The stack" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((g, i) => (
          <Reveal key={g.group} delay={i * 0.06}>
            <div className="h-full rounded-xl border border-[color:var(--color-border)] bg-white/50 p-5 backdrop-blur-sm">
              <p className="font-mono text-xs text-[color:var(--color-accent)]">{g.group}</p>
              <ul className="mt-3 space-y-1.5">
                {g.items.map((it) => (
                  <li key={it} className="flex items-center gap-2 text-sm text-[color:var(--color-secondary)]">
                    <span className="text-[color:var(--color-accent)]">▹</span> {it}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

// Experience
export function Experience() {
  return (
    <Section id="experience">
      <Heading file="experience.log" title="The timeline" />
      <div className="relative border-l border-[color:var(--color-border)] pl-8">
        {experience.map((e, i) => (
          <Reveal key={e.title} delay={i * 0.08}>
            <div className="relative mb-10 last:mb-0">
              <span className="absolute -left-[38px] top-1.5 h-3 w-3 rounded-full border-2 border-[color:var(--color-accent)] bg-[color:var(--color-background)]" />
              <p className="font-mono text-xs text-[color:var(--color-accent)]">{e.when}</p>
              <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl font-600 text-[color:var(--color-foreground)]">
                {e.title}
              </h3>
              {e.company && (
                <p className="mt-0.5 font-mono text-sm text-[color:var(--color-secondary)]">
                  {e.company}
                </p>
              )}
              <p className="mt-1.5 max-w-2xl leading-relaxed text-[color:var(--color-secondary)]">
                {e.detail}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

// Contact
export function Contact() {
  return (
    <Section id="contact">
      <Heading file="contact.sh" title="Get in touch" />
      <Reveal>
        <p className="max-w-xl leading-relaxed text-[color:var(--color-secondary)]">
          Open to opportunities and good conversations. The fastest way is email or GitHub -
          the rest are coming online soon.
        </p>
      </Reveal>
      <div className="mt-8 grid gap-3 sm:max-w-xl">
        {socials.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.05}>
            <a
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              aria-disabled={s.todo}
              onClick={(e) => s.todo && e.preventDefault()}
              className={`flex items-center justify-between rounded-lg border border-[color:var(--color-border)] bg-white/50 px-5 py-4 backdrop-blur-sm transition-all ${
                s.todo
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer hover:-translate-y-0.5 hover:border-[color:var(--color-accent)]/60 hover:shadow-md hover:shadow-black/5"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="font-mono text-xs text-[color:var(--color-accent)]">{s.label}</span>
                <span className="text-[color:var(--color-secondary)]">{s.handle}</span>
              </span>
              <span className="font-mono text-xs text-zinc-400">
                {s.todo ? "soon" : "→"}
              </span>
            </a>
          </Reveal>
        ))}
      </div>
      <p className="mt-14 text-center font-mono text-xs text-zinc-400">
        built by {profile.name} · react · next.js · framer-motion - {new Date().getFullYear()}
      </p>
    </Section>
  );
}
