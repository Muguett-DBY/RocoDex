import type { CstdLocale } from "../content/content-types";
import { cstdTechnicalNotes, getTechnicalNotePath } from "../content/technical-notes";
import { createCstdUrl } from "./origin";

export function createCstdJsonFeed(locale: CstdLocale) {
  const isEnglish = locale === "en";
  const homePageUrl = createCstdUrl(isEnglish ? "/en/notes" : "/notes");
  return {
    version: "https://jsonfeed.org/version/1.1",
    title: isEnglish ? "CSTD Technical Notes" : "CSTD 技术札记",
    home_page_url: homePageUrl,
    feed_url: createCstdUrl(isEnglish ? "/en/feed.json" : "/feed.json"),
    language: isEnglish ? "en-AU" : "zh-CN",
    authors: [{ name: isEnglish ? "Custard" : "奶黄包", url: createCstdUrl("/") }],
    items: cstdTechnicalNotes.map((note) => {
      const url = createCstdUrl(getTechnicalNotePath(note, locale));
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
