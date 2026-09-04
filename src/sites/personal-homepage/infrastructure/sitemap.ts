import type { SitemapEntry } from "@/sites/shared/sitemap";
import { cstdCaseStudies } from "../content/case-studies";
import { cstdLabs } from "../content/labs";
import { cstdTechnicalNotes } from "../content/technical-notes";
import { cstdTopics } from "../content/topics";
import { createCstdUrl } from "./origin";

export function getPersonalHomepageSitemapEntries(): SitemapEntry[] {
  const stablePages = ["/work", "/notes", "/lab", "/voxel", "/topics", "/map", "/about", "/now", "/resume"];
  const audiencePages = ["/for/builder", "/for/research", "/for/collaboration"];
  const latestContentDate = [...cstdCaseStudies, ...cstdTechnicalNotes, ...cstdLabs]
    .map((entry) => entry.updatedAt)
    .sort()
    .at(-1) ?? "1970-01-01";
  const createPair = (path: string, changeFrequency: SitemapEntry["changeFrequency"], zhPriority: number, enPriority: number, lastModified = latestContentDate): SitemapEntry[] => {
    const zhUrl = createCstdUrl(path || "/");
    const enUrl = createCstdUrl(`/en${path}`);
    const alternates = { "zh-CN": zhUrl, "en-AU": enUrl, "x-default": zhUrl };
    return [
      { url: zhUrl, alternates, lastModified, changeFrequency, priority: zhPriority },
      { url: enUrl, alternates, lastModified, changeFrequency, priority: enPriority },
    ];
  };
  const contentPages = [
    ...stablePages.map((path) => ({ path, lastModified: latestContentDate })),
    ...cstdCaseStudies.map((entry) => ({ path: `/work/${entry.slug}`, lastModified: entry.updatedAt })),
    ...cstdTechnicalNotes.map((entry) => ({ path: `/notes/${entry.slug}`, lastModified: entry.updatedAt })),
    ...cstdLabs.map((entry) => ({ path: `/lab/${entry.slug}`, lastModified: entry.updatedAt })),
    ...cstdTopics.map((entry) => ({ path: `/topics/${entry.slug}`, lastModified: latestContentDate })),
  ];
  const contentEntries = contentPages.flatMap(({ path, lastModified }) => createPair(path, path === "/now" ? "weekly" : "monthly", path.split("/").length === 2 ? 0.8 : 0.7, path.split("/").length === 2 ? 0.75 : 0.65, lastModified));

  return [
    ...createPair("", "weekly", 1, 0.95),
    ...audiencePages.flatMap((path) => createPair(path, "monthly", 0.85, 0.8)),
    ...contentEntries,
  ];
}
