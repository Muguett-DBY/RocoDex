import type { SitemapEntry } from "@/sites/shared/sitemap";
import { cstdCaseStudies } from "../content/case-studies";
import { cstdLabs } from "../content/labs";
import { cstdTechnicalNotes } from "../content/technical-notes";
import { cstdTopics } from "../content/topics";

export function getPersonalHomepageSitemapEntries(): SitemapEntry[] {
  const stablePages = ["/work", "/notes", "/lab", "/topics", "/map", "/about", "/now", "/resume"];
  const audiencePages = ["/for/builder", "/for/research", "/for/collaboration"];
  const zhPaths = [
    ...stablePages,
    ...cstdCaseStudies.map((entry) => `/work/${entry.slug}`),
    ...cstdTechnicalNotes.map((entry) => `/notes/${entry.slug}`),
    ...cstdLabs.map((entry) => `/lab/${entry.slug}`),
    ...cstdTopics.map((entry) => `/topics/${entry.slug}`),
  ];
  const createPair = (path: string, changeFrequency: SitemapEntry["changeFrequency"], zhPriority: number, enPriority: number): SitemapEntry[] => {
    const zhUrl = `https://custard.top${path || "/"}`;
    const enUrl = `https://custard.top/en${path}`;
    const alternates = { "zh-CN": zhUrl, "en-AU": enUrl, "x-default": zhUrl };
    return [
      { url: zhUrl, alternates, lastModified: "2026-08-12", changeFrequency, priority: zhPriority },
      { url: enUrl, alternates, lastModified: "2026-08-12", changeFrequency, priority: enPriority },
    ];
  };
  const contentEntries = zhPaths.flatMap((path) => createPair(path, path === "/now" ? "weekly" : "monthly", path.split("/").length === 2 ? 0.8 : 0.7, path.split("/").length === 2 ? 0.75 : 0.65));

  return [
    ...createPair("", "weekly", 1, 0.95),
    ...audiencePages.flatMap((path) => createPair(path, "monthly", 0.85, 0.8)),
    ...contentEntries,
  ];
}
