import { creatures } from "@/data/creatures";
import { guideBuilds } from "@/data/guide-builds";
import { archivedPvpTeams, pvpTeams } from "@/data/pvp-teams";
import { guideBuildSlug, seoLandingPages } from "@/lib/seo-pages";
import { pvpTeamSlug } from "@/lib/pvp-query";
import type { SitemapEntry } from "@/sites/shared/sitemap";

const ROCODEX_BASE_URL = "https://rocodex.custard.top";

export function getRocoDexSitemapEntries(): SitemapEntry[] {
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

  const pvpTeamPages: SitemapEntry[] = [...pvpTeams, ...archivedPvpTeams].map((team) => ({
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
