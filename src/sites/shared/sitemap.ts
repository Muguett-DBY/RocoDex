export type SitemapEntry = {
  url: string;
  lastModified?: string;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

export function serializeSitemap(entries: readonly SitemapEntry[]) {
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
