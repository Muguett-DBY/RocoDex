import { describe, expect, test } from "vitest";
import { getPersonalHomepageMetadata, getPersonalHomepageStructuredData, getCstdAudienceMetadata } from "../metadata";
import { createCstdJsonFeed } from "./json-feed";
import { createCstdManifest } from "./manifest";
import { getPersonalHomepageSitemapEntries } from "./sitemap";

describe("CSTD localized publishing", () => {
  test.each([
    ["zh", "https://custard.top/", "zh-CN", "/manifest.webmanifest"],
    ["en", "https://custard.top/en", "en-AU", "/en/manifest.webmanifest"],
  ] as const)("publishes complete %s homepage metadata", (locale, canonical, language, manifest) => {
    const metadata = getPersonalHomepageMetadata(locale);
    const serialized = JSON.stringify(metadata);

    expect(metadata.alternates?.canonical).toBe(canonical);
    expect(metadata.manifest).toBe(manifest);
    expect(metadata.other?.["content-language"]).toBe(language);
    expect(serialized).toContain("https://custard.top/");
    expect(serialized).toContain("https://custard.top/en");
    expect(serialized).toContain("zh-CN");
    expect(serialized).toContain("en-AU");
  });

  test("localizes profile schema and audience metadata", () => {
    const chineseSchema = getPersonalHomepageStructuredData("zh");
    const englishSchema = getPersonalHomepageStructuredData("en");
    const englishAudience = getCstdAudienceMetadata("research", "en");

    expect(chineseSchema.every((entry) => entry.inLanguage === "zh-CN")).toBe(true);
    expect(JSON.stringify(chineseSchema)).toContain("CSTD 工程观测站");
    expect(englishSchema.every((entry) => entry.inLanguage === "en-AU")).toBe(true);
    expect(JSON.stringify(englishSchema)).toContain("Custard");
    expect(getPersonalHomepageMetadata("en").title).toBe("Custard | Product engineer building creative tools and research systems | CSTD");
    expect(englishAudience.alternates?.canonical).toBe("https://custard.top/en/for/research");
    expect(englishAudience.other?.["content-language"]).toBe("en-AU");
  });

  test("publishes locale-specific manifests and JSON feeds", () => {
    expect(createCstdManifest("zh")).toMatchObject({ lang: "zh-CN", start_url: "/" });
    expect(createCstdManifest("en")).toMatchObject({ lang: "en-AU", start_url: "/en" });
    expect(createCstdJsonFeed("zh").feed_url).toBe("https://custard.top/feed.json");
    expect(createCstdJsonFeed("en").feed_url).toBe("https://custard.top/en/feed.json");
  });

  test("pairs every public page with hreflang sitemap alternates", () => {
    const entries = getPersonalHomepageSitemapEntries();
    const englishAudience = entries.find((entry) => entry.url === "https://custard.top/en/for/research");

    expect(entries.find((entry) => entry.url === "https://custard.top/")?.alternates).toEqual({
      "zh-CN": "https://custard.top/",
      "en-AU": "https://custard.top/en",
      "x-default": "https://custard.top/",
    });
    expect(englishAudience?.alternates?.["zh-CN"]).toBe("https://custard.top/for/research");
    expect(entries.every((entry) => entry.alternates?.["zh-CN"] && entry.alternates?.["en-AU"])).toBe(true);
  });
});
