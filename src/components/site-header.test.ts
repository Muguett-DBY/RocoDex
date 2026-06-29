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

  it("keeps authenticated mobile menu controls on the same touch-target contract", () => {
    const siteHeader = readFileSync(join(process.cwd(), "src", "components", "site-header.tsx"), "utf8");

    expect(siteHeader).toContain("<AuthControls");
    expect(siteHeader).toContain("onNavigate={closeMobileMenu}");
    expect(siteHeader).toContain('rootClassName="grid gap-2"');
    expect(siteHeader).toContain('controlClassName="h-11 justify-start px-3"');
  });

  it("keeps the expanded mobile menu constrained within the viewport", () => {
    const siteHeader = readFileSync(join(process.cwd(), "src", "components", "site-header.tsx"), "utf8");

    expect(siteHeader).toContain("max-h-[calc(100dvh-5rem)]");
    expect(siteHeader).toContain("overflow-y-auto");
    expect(siteHeader).toContain("overscroll-contain");
  });
});
