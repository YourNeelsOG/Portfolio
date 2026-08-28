// Single source of truth for all site copy, links, and data.
// Edit here - nothing else needs to change. Items marked TODO are placeholders
// the owner should fill with real values.

export const profile = {
  name: "Neel",
  handle: "YourNeelsOG",
  role: "Junior Software Developer",
  location: "Bangladesh",
  // Bleach reference - matches the Urahara persona.
  bio: "What are you looking for? I am already a Deadman!",
  tagline:
    "Junior software developer from Bangladesh. I break things open to see how they work - servers, pipelines, third-party codebases - then make them run better.",
  email: "contactwithyourneels@gmail.com",
  avatar: "/img/urahara.png",
};

export type Social = {
  label: string;
  handle: string;
  href: string;
  todo?: boolean;
};

export const socials: Social[] = [
  { label: "GitHub", handle: "@YourNeelsOG", href: "https://github.com/YourNeelsOG" },
  { label: "Email", handle: profile.email, href: `mailto:${profile.email}` },
  { label: "Discord", handle: "@YourNeels", href: "https://discord.com/users/yourneels" },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "Java", "Bash", "LaTeX"] },
  { group: "Web", items: ["HTML", "CSS", "React", "Next.js"] },
  { group: "Automation & Tooling", items: ["n8n", "Google Apps Script", "Web scraping", "Bots"] },
  { group: "Infra", items: ["Linux servers", "Self-hosting", "Service debugging"] },
];

export type Project = {
  title: string;
  blurb: string;
  tags: string[];
  links?: { label: string; href: string }[];
};

// Organized by real work themes (repos are mostly forks, so themes lead).
export const projects: Project[] = [
  {
    title: "Self-hosted infrastructure",
    blurb:
      "Running and managing Linux servers - debugging service-level issues and keeping things stable in production.",
    tags: ["Linux", "Bash", "Ops"],
  },
  {
    title: "Media & download tooling",
    blurb:
      "Building and patching pipelines that survive real-world edge cases: proxy fallbacks, device spoofing, parallel API calls, and format detection.",
    tags: ["Python", "APIs", "Reliability"],
    links: [
      { label: "Upload-Assistant", href: "https://github.com/YourNeelsOG/Upload-Assistant" },
      { label: "Byparr", href: "https://github.com/YourNeelsOG/Byparr" },
    ],
  },
  {
    title: "Automation & workflows",
    blurb:
      "Web scrapers, monitoring systems, and custom bots built with Python, n8n, and Google Apps Script.",
    tags: ["Python", "n8n", "Apps Script"],
  },
  {
    title: "Codebase internals",
    blurb:
      "Reading and modifying third-party codebases - fixing concurrency bugs and extending functionality without breaking existing behavior.",
    tags: ["Debugging", "Concurrency", "Open source"],
    links: [{ label: "ECC", href: "https://github.com/YourNeelsOG/ECC" }],
  },
];

export type TimelineEntry = {
  when: string;
  title: string;
  detail: string;
  company?: string;
};

export const experience: TimelineEntry[] = [
  {
    when: "September 2026 - Present",
    company: "Automata One",
    title: "Junior Software Developer",
    // TODO: add company name + start date once confirmed.
    detail:
      "Building and maintaining production software. Learning the craft in a team, shipping real features.",
  },
  {
    when: "July 2025 - August 2026",
    company: "Phoenix Education",
    title: "Student Support & Community Manager",
    detail:
      "Managed student support and community engagement for an Undergraduate admission test course. Assisted students with technical issues and facilitated discussions. Managed Facebook page, group and Telegram groups for the course and as well as for Marketing.",
  },
  {
    when: "April 2025 - July 2025",
    company: "UY Labs",
    title: "Telesales & Communication Manager",
    detail:
      "Promoted and sold IT training courses and membership programs through outbound calls, converting leads into paying customers and consistently achieving sales targets.",
  },
  {
    when: "April 2022 - February 2025",
    company: "Union Bank PLC",
    title: "Customer Service Representative.",
    detail:
      "Handled high-volume inbound and outbound calls for banking products and accounts, resolving customer queries while consistently meeting Quality Check (QC) and compliance standards",
  },
];
