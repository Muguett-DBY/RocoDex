import { describe, expect, test } from "vitest";
import { GET as getRootSecurityTxt } from "../../../app/.well-known/security.txt/route";
import { serializeCstdRss } from "./rss";
import { createCstdJsonFeed } from "./json-feed";
import { serializeCstdLlms } from "./llms";
import { CSTD_SECURITY_TXT, createCstdSecurityTxtResponse } from "./security";
import { getPersonalHomepageSitemapEntries } from "./sitemap";
import { consumeCstdTelemetryQuota, parseCstdMetric } from "./telemetry";

describe("CSTD publishing infrastructure", () => {
  test("publishes every bilingual deep route in the sitemap", () => {
    const urls = getPersonalHomepageSitemapEntries().map((entry) => entry.url);
    expect(urls).toContain("https://custard.top/work/rocodex-platform");
    expect(urls).toContain("https://custard.top/en/work/rocodex-platform");
    expect(urls).toContain("https://custard.top/notes/evidence-first-ai-research");
    expect(urls).toContain("https://custard.top/en/lab/render-lab");
    expect(urls).toContain("https://custard.top/lab/proof-museum");
    expect(urls).toContain("https://custard.top/topics/system-boundaries");
    expect(urls).toContain("https://custard.top/en/topics/visual-computing");
    expect(urls).toContain("https://custard.top/resume");
    expect(urls).toContain("https://custard.top/map");
    expect(urls).toContain("https://custard.top/en/map");
    expect(urls).toContain("https://custard.top/for/builder");
    expect(urls).toContain("https://custard.top/for/research");
    expect(new Set(urls).size).toBe(urls.length);
  });

  test("publishes JSON Feed and an LLM-readable evidence index", () => {
    const feed = createCstdJsonFeed("en");
    expect(feed.version).toBe("https://jsonfeed.org/version/1.1");
    expect(feed.items.length).toBeGreaterThanOrEqual(8);
    expect(feed.items[0].url).toMatch(/^https:\/\/custard\.top\/en\/notes\//);
    const llms = serializeCstdLlms();
    expect(llms).toContain("https://custard.top/graph.json");
    expect(llms).toContain("https://custard.top/studio.json");
    expect(llms).toContain("https://custard.top/observatory.json");
    expect(llms).toContain("https://custard.top/content-health.json");
    expect(llms).toContain("https://custard.top/en/topics");
    expect(llms).toContain("RocoDex dual-site platform");
  });

  test("publishes bilingual RSS with canonical article links", () => {
    expect(serializeCstdRss("zh")).toContain("https://custard.top/notes/host-boundaries-in-one-next-deployment");
    expect(serializeCstdRss("en")).toContain("https://custard.top/en/notes/host-boundaries-in-one-next-deployment");
    expect(serializeCstdRss("zh").match(/<item>/g)?.length).toBeGreaterThanOrEqual(8);
    expect(serializeCstdRss("zh")).toContain("<lastBuildDate>Thu, 27 Aug 2026");
  });

  test("publishes one canonical RFC 9116 security contract", () => {
    expect(CSTD_SECURITY_TXT).toContain("Contact: mailto:cstd@custard.top");
    expect(CSTD_SECURITY_TXT).toContain("Canonical: https://custard.top/.well-known/security.txt");
    const response = createCstdSecurityTxtResponse();
    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8");
    expect(response.headers.get("cache-control")).toContain("s-maxage=86400");
    expect(getRootSecurityTxt().status).toBe(200);
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

  test("rate limits telemetry by a non-reversible in-memory identity", () => {
    expect(consumeCstdTelemetryQuota("203.0.113.10", 1_000, 2).allowed).toBe(true);
    expect(consumeCstdTelemetryQuota("203.0.113.10", 1_100, 2).allowed).toBe(true);
    expect(consumeCstdTelemetryQuota("203.0.113.10", 1_200, 2)).toMatchObject({ allowed: false });
    expect(consumeCstdTelemetryQuota("203.0.113.10", 62_000, 2).allowed).toBe(true);
  });
});
