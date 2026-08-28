"use client";

import type { GithubData, GithubRepo } from "@/lib/store";
import { profile } from "@/data/content";

const USER = profile.handle;

// Fetch live GitHub data directly from the browser. Done client-side (rather
// than via a server route) so it works on static hosting like GitHub Pages.
// api.github.com and the contributions API both allow CORS.
export async function loadGithub(): Promise<GithubData | null> {
  try {
    const [userRes, reposRes, contribRes] = await Promise.allSettled([
      fetch(`https://api.github.com/users/${USER}`),
      fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`),
      fetch(`https://github-contributions-api.jogruber.de/v4/${USER}?y=last`),
    ]);

    let user: GithubData["user"] = null;
    if (userRes.status === "fulfilled" && userRes.value.ok) {
      const u = await userRes.value.json();
      user = { public_repos: u.public_repos, followers: u.followers, following: u.following };
    }

    let repos: GithubRepo[] = [];
    if (reposRes.status === "fulfilled" && reposRes.value.ok) {
      const list = (await reposRes.value.json()) as Array<Record<string, unknown>>;
      repos = list
        .map((r) => ({
          name: String(r.name),
          description: (r.description as string) ?? null,
          stars: Number(r.stargazers_count) || 0,
          language: (r.language as string) ?? null,
          url: String(r.html_url),
          fork: Boolean(r.fork),
          updated: String(r.pushed_at ?? r.updated_at ?? ""),
        }))
        .sort((a, b) => b.stars - a.stars || b.updated.localeCompare(a.updated));
    }

    let weeks: number[][] = [];
    let totalContributions = 0;
    if (contribRes.status === "fulfilled" && contribRes.value.ok) {
      const c = (await contribRes.value.json()) as {
        total?: Record<string, number>;
        contributions?: Array<{ level: number }>;
      };
      const days = c.contributions ?? [];
      totalContributions = Object.values(c.total ?? {}).reduce((a, b) => a + b, 0);
      for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7).map((d) => d.level));
      }
    }

    if (!user && !repos.length && !weeks.length) return null;
    return { user, repos, weeks, totalContributions };
  } catch {
    return null;
  }
}
