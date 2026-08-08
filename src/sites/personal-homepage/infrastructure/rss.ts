import type { CstdLocale } from "../content/content-types";
import { cstdTechnicalNotes, getTechnicalNotePath } from "../content/technical-notes";

function escapeXml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

export function serializeCstdRss(locale: CstdLocale) {
  const title = locale === "zh" ? "CSTD 技术札记" : "CSTD Technical Notes";
  const description = locale === "zh" ? "关于系统、数据、AI、研究与视觉工程的长期技术札记。" : "Durable notes on systems, data, AI, research, and visual engineering.";
  const link = locale === "zh" ? "https://custard.top/notes" : "https://custard.top/en/notes";
  const items = cstdTechnicalNotes.map((note) => {
    const url = `https://custard.top${getTechnicalNotePath(note, locale)}`;
    return `<item>\n<title>${escapeXml(note.title[locale])}</title>\n<link>${escapeXml(url)}</link>\n<guid isPermaLink="true">${escapeXml(url)}</guid>\n<description>${escapeXml(note.summary[locale])}</description>\n<pubDate>${new Date(`${note.publishedAt}T00:00:00Z`).toUTCString()}</pubDate>\n</item>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n<title>${escapeXml(title)}</title>\n<link>${escapeXml(link)}</link>\n<description>${escapeXml(description)}</description>\n<language>${locale === "zh" ? "zh-CN" : "en-AU"}</language>\n<lastBuildDate>${new Date("2026-08-08T00:00:00Z").toUTCString()}</lastBuildDate>\n${items}\n</channel>\n</rss>\n`;
}
