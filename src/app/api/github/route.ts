import { NextResponse } from "next/server";
import { profile } from "@/data/content";

// Server-side aggregation of live GitHub data. Runs on the server so there are
// no CORS/CSP issues and no token is exposed to the client. Cached hourly.
export const revalidate = 3600;

const USER = profile.handle;

type Repo = {
  name: string;
  description: string | null;
  stars: number;
  language: string | null;
  url: string;
  fork: boolean;
  updated: string;
};

export async function GET() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "neel-portfolio",
  };

  const [userRes, reposRes, contribRes] = await Promise.allSettled([
    fetch(`https://api.github.com/users/${USER}`, { headers, next: { revalidate } }),
    fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`, {
      headers,
      next: { revalidate },
    }),
    fetch(`https://github-contributions-api.jogruber.de/v4/${USER}?y=last`, {
      next: { revalidate },
    }),
  ]);

  let user: { public_repos: number; followers: number; following: number } | null = null;
  if (userRes.status === "fulfilled" && userRes.value.ok) {
    const u = await userRes.value.json();
    user = { public_repos: u.public_repos, followers: u.followers, following: u.following };
  }

  let repos: Repo[] = [];
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

  // Contribution levels (0-4) for the last year, grouped into week columns.
  let weeks: number[][] = [];
  let totalContributions = 0;
  if (contribRes.status === "fulfilled" && contribRes.value.ok) {
    const c = (await contribRes.value.json()) as {
      total?: Record<string, number>;
      contributions?: Array<{ level: number; count: number }>;
    };
    const days = c.contributions ?? [];
    totalContributions = Object.values(c.total ?? {}).reduce((a, b) => a + b, 0);
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7).map((d) => d.level));
    }
  }

  return NextResponse.json(
    { user, repos, weeks, totalContributions, fetchedAt: Date.now() },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
  );
}
