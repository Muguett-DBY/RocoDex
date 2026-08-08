import { describe, expect, test } from "vitest";
import { serializeCstdRss } from "./rss";
import { getPersonalHomepageSitemapEntries } from "./sitemap";
import { parseCstdMetric } from "./telemetry";

describe("CSTD publishing infrastructure", () => {
  test("publishes every bilingual deep route in the sitemap", () => {
    const urls = getPersonalHomepageSitemapEntries().map((entry) => entry.url);
    expect(urls).toContain("https://custard.top/work/rocodex-platform");
    expect(urls).toContain("https://custard.top/en/work/rocodex-platform");
    expect(urls).toContain("https://custard.top/notes/evidence-first-ai-research");
    expect(urls).toContain("https://custard.top/en/lab/render-lab");
    expect(urls).toContain("https://custard.top/resume");
    expect(new Set(urls).size).toBe(urls.length);
  });

  test("publishes bilingual RSS with canonical article links", () => {
    expect(serializeCstdRss("zh")).toContain("https://custard.top/notes/host-boundaries-in-one-next-deployment");
    expect(serializeCstdRss("en")).toContain("https://custard.top/en/notes/host-boundaries-in-one-next-deployment");
    expect(serializeCstdRss("zh").match(/<item>/g)?.length).toBeGreaterThanOrEqual(8);
  });

  test("accepts only bounded anonymous telemetry", () => {
    const dimensions = { device: "desktop", renderTier: "lite" } as const;
    expect(parseCstdMetric({ name: "LCP", value: 842.3, page: "home", path: "/", ...dimensions })).toEqual({ name: "LCP", value: 842.3, page: "home", path: "/", ...dimensions });
    expect(parseCstdMetric({ name: "atlas_district", value: 3, page: "home", path: "/", device: "mobile", renderTier: "image" })).not.toBeNull();
    expect(parseCstdMetric({ name: "email", value: 1, page: "home", path: "/", ...dimensions })).toBeNull();
    expect(parseCstdMetric({ name: "CLS", value: Number.NaN, page: "home", path: "/", ...dimensions })).toBeNull();
    expect(parseCstdMetric({ name: "INP", value: 100, page: "x".repeat(81), path: "/", ...dimensions })).toBeNull();
    expect(parseCstdMetric({ name: "INP", value: 100, page: "home", path: "/", device: "desktop", renderTier: "unknown" })).toBeNull();
  });
});
