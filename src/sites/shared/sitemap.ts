export type SitemapEntry = {
  url: string;
  lastModified?: string;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
  alternates?: Readonly<Record<string, string>>;
};

export function serializeSitemap(entries: readonly SitemapEntry[]) {
  const hasAlternates = entries.some((entry) => entry.alternates && Object.keys(entry.alternates).length > 0);
  const urls = entries
    .map((entry) => {
      const lastModified = entry.lastModified ? `\n<lastmod>${escapeXml(entry.lastModified)}</lastmod>` : "";
      const changeFrequency = entry.changeFrequency ? `\n<changefreq>${entry.changeFrequency}</changefreq>` : "";
      const priority = typeof entry.priority === "number" ? `\n<priority>${entry.priority}</priority>` : "";
      const alternates = Object.entries(entry.alternates ?? {})
        .map(([language, href]) => `\n<xhtml:link rel="alternate" hreflang="${escapeXml(language)}" href="${escapeXml(href)}" />`)
        .join("");

      return `<url>\n<loc>${escapeXml(entry.url)}</loc>${alternates}${lastModified}${changeFrequency}${priority}\n</url>`;
    })
    .join("\n");

  const alternateNamespace = hasAlternates ? ' xmlns:xhtml="http://www.w3.org/1999/xhtml"' : "";
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${alternateNamespace}>\n${urls}\n</urlset>\n`;
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
