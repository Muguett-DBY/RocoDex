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
});
