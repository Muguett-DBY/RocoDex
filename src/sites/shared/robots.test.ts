import { describe, expect, test } from "vitest";
import { buildRobotsTxt } from "./robots";

describe("site robots policy", () => {
  test("includes crawl permission, sitemap discovery, and AI-training reservations", () => {
    const robots = buildRobotsTxt();

    expect(robots).toContain("User-agent: *");
    expect(robots).toContain("Allow: /");
    expect(robots).toContain("Content-Signal: search=yes,ai-train=no,use=reference");
    expect(robots).toContain("User-agent: GPTBot");
    expect(robots).toContain("Disallow: /");
    expect(robots.match(/^Sitemap: .*$/gm)).toEqual(["Sitemap: https://custard.top/sitemap.xml"]);
  });
});
