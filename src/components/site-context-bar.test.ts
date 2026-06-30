import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("site context bar integration", () => {
  it("is rendered by PageShell below the global header", () => {
    const pageShell = readFileSync(join(process.cwd(), "src", "components", "page-shell.tsx"), "utf8");

    expect(pageShell).toContain("SiteContextBar");
    expect(pageShell.indexOf("<SiteHeader")).toBeLessThan(pageShell.indexOf("<SiteContextBar"));
  });

  it("uses route context and accessible labels for the current module", () => {
    const contextBar = readFileSync(join(process.cwd(), "src", "components", "site-context-bar.tsx"), "utf8");

    expect(contextBar).toContain("usePathname");
    expect(contextBar).toContain("getSiteNavigationContext");
    expect(contextBar).toContain('aria-label="当前站点位置"');
    expect(contextBar).toContain("context.current.label");
    expect(contextBar).toContain("min-h-11");
  });

  it("renders a homepage action from the context helper before related links", () => {
    const contextBar = readFileSync(join(process.cwd(), "src", "components", "site-context-bar.tsx"), "utf8");

    expect(contextBar).toContain("getSiteNavigationHomeAction");
    expect(contextBar).toContain("homeAction");
    expect(contextBar).toContain("homeAction.href");
    expect(contextBar).toContain("homeAction.label");
    expect(contextBar.indexOf("homeAction")).toBeLessThan(contextBar.indexOf("context.relatedItems.map"));
  });
});
