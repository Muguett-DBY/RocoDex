import { describe, expect, it } from "vitest";
import { serializeSitemap } from "./sitemap";

describe("serializeSitemap", () => {
  it("serializes optional metadata and escapes URLs", () => {
    const sitemap = serializeSitemap([
      {
        url: "https://example.com/search?a=1&b=2",
        lastModified: "2026-08-02",
        changeFrequency: "weekly",
        priority: 0.8,
      },
    ]);

    expect(sitemap).toContain("<loc>https://example.com/search?a=1&amp;b=2</loc>");
    expect(sitemap).toContain("<lastmod>2026-08-02</lastmod>");
    expect(sitemap).toContain("<changefreq>weekly</changefreq>");
    expect(sitemap).toContain("<priority>0.8</priority>");
  });

  it("serializes escaped hreflang alternates when a site is localized", () => {
    const sitemap = serializeSitemap([{
      url: "https://example.com/en/notes",
      alternates: {
        "zh-CN": "https://example.com/notes?a=1&b=2",
        "en-AU": "https://example.com/en/notes",
        "x-default": "https://example.com/notes",
      },
    }]);

    expect(sitemap).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
    expect(sitemap).toContain('hreflang="en-AU" href="https://example.com/en/notes"');
    expect(sitemap).toContain('hreflang="zh-CN" href="https://example.com/notes?a=1&amp;b=2"');
  });
});
