import type { CstdLocale } from "../content/content-types";
import { cstdTechnicalNotes, getTechnicalNotePath } from "../content/technical-notes";

export function createCstdJsonFeed(locale: CstdLocale) {
  const isEnglish = locale === "en";
  const homePageUrl = isEnglish ? "https://custard.top/en/notes" : "https://custard.top/notes";
  return {
    version: "https://jsonfeed.org/version/1.1",
    title: isEnglish ? "CSTD Technical Notes" : "CSTD 技术札记",
    home_page_url: homePageUrl,
    feed_url: isEnglish ? "https://custard.top/en/feed.json" : "https://custard.top/feed.json",
    language: isEnglish ? "en-AU" : "zh-CN",
    authors: [{ name: isEnglish ? "Custard" : "奶黄包", url: "https://custard.top" }],
    items: cstdTechnicalNotes.map((note) => {
      const url = `https://custard.top${getTechnicalNotePath(note, locale)}`;
      return {
        id: url,
        url,
        title: note.title[locale],
        summary: note.summary[locale],
        date_published: `${note.publishedAt}T00:00:00.000Z`,
        date_modified: `${note.updatedAt}T00:00:00.000Z`,
        tags: [...note.tags],
      };
    }),
  } as const;
}
