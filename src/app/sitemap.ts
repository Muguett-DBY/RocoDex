import type { MetadataRoute } from "next";
import { creatures } from "@/data/creatures";
import { guideBuilds } from "@/data/guide-builds";
import { archivedPvpTeams, pvpTeams } from "@/data/pvp-teams";
import { guideBuildSlug, seoLandingPages } from "@/lib/seo-pages";
import { pvpTeamSlug } from "@/lib/pvp-query";

const BASE_URL = "https://rocodex.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: "2026-04-26", changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/creatures`, lastModified: "2026-04-26", changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/guides`, lastModified: "2026-04-26", changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/pvp-teams`, lastModified: "2026-04-26", changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/matchups`, lastModified: "2026-04-05", changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/skills`, lastModified: "2026-04-05", changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/compare`, lastModified: "2026-04-05", changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/discover`, lastModified: "2026-04-26", changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/data-status`, lastModified: "2026-04-26", changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/about`, lastModified: "2026-04-05", changeFrequency: "monthly", priority: 0.4 },
  ];

  const creaturePages: MetadataRoute.Sitemap = creatures.map((creature) => ({
    url: `${BASE_URL}/creatures/${creature.id}`,
    lastModified: creature.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const guidePages: MetadataRoute.Sitemap = guideBuilds.map((build) => ({
    url: `${BASE_URL}/guides/${guideBuildSlug(build)}`,
    lastModified: build.updatedAt,
    changeFrequency: "weekly" as const,
    priority: build.pvpTier === "S" || build.pvpTier === "A" ? 0.7 : 0.5,
  }));

  const allTeams = [...pvpTeams, ...archivedPvpTeams];
  const pvpTeamPages: MetadataRoute.Sitemap = allTeams.map((team) => ({
    url: `${BASE_URL}/pvp-teams/${pvpTeamSlug(team)}`,
    lastModified: team.metaDate,
    changeFrequency: "weekly" as const,
    priority: team.sourceFreshness === "current" ? 0.7 : 0.3,
  }));

  const discoverPages: MetadataRoute.Sitemap = seoLandingPages.map((page) => ({
    url: `${BASE_URL}${page.href}`,
    lastModified: "2026-04-26",
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...creaturePages, ...guidePages, ...pvpTeamPages, ...discoverPages];
}
