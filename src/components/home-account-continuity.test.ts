import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("homepage account continuity", () => {
  it("mounts the account continuity notice in the homepage hero", () => {
    const homePage = readFileSync(join(process.cwd(), "src", "app", "page.tsx"), "utf8");

    expect(homePage).toContain("HomeAccountContinuity");
    expect(homePage.indexOf("<HomeSearch />")).toBeLessThan(homePage.indexOf("<HomeAccountContinuity />"));
  });

  it("shows account recovery only for blocked account states", () => {
    const component = readFileSync(join(process.cwd(), "src", "components", "home-account-continuity.tsx"), "utf8");

    expect(component).toContain('"use client"');
    expect(component).toContain("useAccountServiceStatus");
    expect(component).toContain("AccountStatusPanel");
    expect(component).toContain('status.state === "ready"');
    expect(component).toContain("return null");
    expect(component).toContain('aria-label="账号服务状态"');
  });
});
