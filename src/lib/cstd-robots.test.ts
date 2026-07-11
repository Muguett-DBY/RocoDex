import { describe, expect, test } from "vitest";
import { buildRobotsTxt, getRobotsSitemapUrl } from "./cstd-robots";

describe("site robots policy", () => {
  test("points the CSTD host at the canonical personal-site sitemap", () => {
    expect(getRobotsSitemapUrl("custard.top")).toBe("https://custard.top/sitemap.xml");
    expect(getRobotsSitemapUrl("www.custard.top:443")).toBe("https://custard.top/sitemap.xml");
  });

  test("points non-CSTD hosts at the RocoDex sitemap", () => {
    expect(getRobotsSitemapUrl("rocodex.custard.top")).toBe("https://rocodex.custard.top/sitemap.xml");
    expect(getRobotsSitemapUrl("localhost:3000")).toBe("https://rocodex.custard.top/sitemap.xml");
  });

  test("includes crawl permission, sitemap discovery, and AI-training reservations", () => {
    const robots = buildRobotsTxt("custard.top");

    expect(robots).toContain("User-agent: *");
    expect(robots).toContain("Allow: /");
    expect(robots).toContain("Content-Signal: search=yes,ai-train=no,use=reference");
    expect(robots).toContain("User-agent: GPTBot");
    expect(robots).toContain("Disallow: /");
    expect(robots).toContain("Sitemap: https://custard.top/sitemap.xml");
  });
});
