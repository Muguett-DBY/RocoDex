import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("site header mobile navigation", () => {
  it("renders a route-backed current summary inside the expanded mobile menu", () => {
    const siteHeader = readFileSync(join(process.cwd(), "src", "components", "site-header.tsx"), "utf8");

    expect(siteHeader).toContain("getMobileNavigationSummary");
    expect(siteHeader).toContain("mobileMenuSummary");
    expect(siteHeader).toContain('aria-label="移动主导航"');
    expect(siteHeader).toContain("mobileMenuSummary.label");
    expect(siteHeader).toContain("mobileMenuSummary.description");
  });
});
