import type { NextRequest } from "next/server";
import { creatures } from "@/data/creatures";
import { guideBuilds } from "@/data/guide-builds";
import { archivedPvpTeams, pvpTeams } from "@/data/pvp-teams";
import { guideBuildSlug, seoLandingPages } from "@/lib/seo-pages";
import { pvpTeamSlug } from "@/lib/pvp-query";

type SitemapEntry = {
  url: string;
  lastModified?: string;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

const CSTD_BASE_URL = "https://custard.top";
const ROCODEX_BASE_URL = "https://rocodex.custard.top";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0].toLowerCase() ?? "";
  const entries = host === "custard.top" || host === "www.custard.top" ? cstdSitemapEntries() : rocodexSitemapEntries();

  return new Response(toSitemapXml(entries), {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function cstdSitemapEntries(): SitemapEntry[] {
  return [
    {
      url: `${CSTD_BASE_URL}/`,
      lastModified: "2026-04-28",
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}

function rocodexSitemapEntries(): SitemapEntry[] {
  const staticPages: SitemapEntry[] = [
    { url: ROCODEX_BASE_URL, lastModified: "2026-04-28", changeFrequency: "weekly", priority: 1 },
    { url: `${ROCODEX_BASE_URL}/creatures`, lastModified: "2026-04-28", changeFrequency: "weekly", priority: 0.9 },
    { url: `${ROCODEX_BASE_URL}/guides`, lastModified: "2026-04-28", changeFrequency: "weekly", priority: 0.9 },
    { url: `${ROCODEX_BASE_URL}/pvp-teams`, lastModified: "2026-04-28", changeFrequency: "weekly", priority: 0.8 },
    { url: `${ROCODEX_BASE_URL}/matchups`, lastModified: "2026-04-05", changeFrequency: "monthly", priority: 0.7 },
    { url: `${ROCODEX_BASE_URL}/skills`, lastModified: "2026-04-05", changeFrequency: "monthly", priority: 0.7 },
    { url: `${ROCODEX_BASE_URL}/compare`, lastModified: "2026-04-05", changeFrequency: "monthly", priority: 0.6 },
    { url: `${ROCODEX_BASE_URL}/discover`, lastModified: "2026-04-28", changeFrequency: "monthly", priority: 0.6 },
    { url: `${ROCODEX_BASE_URL}/rkti`, lastModified: "2026-04-28", changeFrequency: "monthly", priority: 0.6 },
    { url: `${ROCODEX_BASE_URL}/data-status`, lastModified: "2026-04-28", changeFrequency: "weekly", priority: 0.5 },
    { url: `${ROCODEX_BASE_URL}/about`, lastModified: "2026-04-05", changeFrequency: "monthly", priority: 0.4 },
  ];

  const creaturePages: SitemapEntry[] = creatures.map((creature) => ({
    url: `${ROCODEX_BASE_URL}/creatures/${creature.id}`,
    lastModified: creature.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const guidePages: SitemapEntry[] = guideBuilds.map((build) => ({
    url: `${ROCODEX_BASE_URL}/guides/${guideBuildSlug(build)}`,
    lastModified: build.updatedAt,
    changeFrequency: "weekly",
    priority: build.pvpTier === "S" || build.pvpTier === "A" ? 0.7 : 0.5,
  }));

  const allTeams = [...pvpTeams, ...archivedPvpTeams];
  const pvpTeamPages: SitemapEntry[] = allTeams.map((team) => ({
    url: `${ROCODEX_BASE_URL}/pvp-teams/${pvpTeamSlug(team)}`,
    lastModified: team.metaDate,
    changeFrequency: "weekly",
    priority: team.sourceFreshness === "current" ? 0.7 : 0.3,
  }));

  const discoverPages: SitemapEntry[] = seoLandingPages.map((page) => ({
    url: `${ROCODEX_BASE_URL}${page.href}`,
    lastModified: "2026-04-28",
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticPages, ...creaturePages, ...guidePages, ...pvpTeamPages, ...discoverPages];
}

function toSitemapXml(entries: SitemapEntry[]) {
  const urls = entries
    .map((entry) => {
      const lastModified = entry.lastModified ? `\n<lastmod>${escapeXml(entry.lastModified)}</lastmod>` : "";
      const changeFrequency = entry.changeFrequency ? `\n<changefreq>${entry.changeFrequency}</changefreq>` : "";
      const priority = typeof entry.priority === "number" ? `\n<priority>${entry.priority}</priority>` : "";

      return `<url>\n<loc>${escapeXml(entry.url)}</loc>${lastModified}${changeFrequency}${priority}\n</url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
