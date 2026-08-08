import type { SitemapEntry } from "@/sites/shared/sitemap";
import { cstdCaseStudies } from "../content/case-studies";
import { cstdLabs } from "../content/labs";
import { cstdTechnicalNotes } from "../content/technical-notes";

export function getPersonalHomepageSitemapEntries(): SitemapEntry[] {
  const stablePages = ["/work", "/notes", "/lab", "/map", "/about", "/now", "/resume"];
  const zhPaths = [
    ...stablePages,
    ...cstdCaseStudies.map((entry) => `/work/${entry.slug}`),
    ...cstdTechnicalNotes.map((entry) => `/notes/${entry.slug}`),
    ...cstdLabs.map((entry) => `/lab/${entry.slug}`),
  ];
  const contentEntries = zhPaths.flatMap((path): SitemapEntry[] => [
    { url: `https://custard.top${path}`, lastModified: "2026-08-09", changeFrequency: path === "/now" ? "weekly" : "monthly", priority: path.split("/").length === 2 ? 0.8 : 0.7 },
    { url: `https://custard.top/en${path}`, lastModified: "2026-08-09", changeFrequency: path === "/now" ? "weekly" : "monthly", priority: path.split("/").length === 2 ? 0.75 : 0.65 },
  ]);

  return [
    {
      url: "https://custard.top/",
      lastModified: "2026-08-09",
      changeFrequency: "weekly",
      priority: 1,
    },
    { url: "https://custard.top/en", lastModified: "2026-08-09", changeFrequency: "weekly", priority: 0.9 },
    ...contentEntries,
  ];
}
