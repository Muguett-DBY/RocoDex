import type { SitemapEntry } from "@/sites/shared/sitemap";

export function getPersonalHomepageSitemapEntries(): SitemapEntry[] {
  return [
    {
      url: "https://custard.top/",
      lastModified: "2026-08-02",
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
