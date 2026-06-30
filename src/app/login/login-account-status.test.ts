import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("login account status preflight", () => {
  it("blocks credential submission until account storage is ready", () => {
    const loginPage = readFileSync(join(process.cwd(), "src", "app", "login", "page.tsx"), "utf8");

    expect(loginPage).toContain("useAccountServiceStatus");
    expect(loginPage).toContain('accountStatus?.state !== "ready"');
    expect(loginPage).toContain("if (!accountStatus)");
    expect(loginPage).toContain("blockedAccountStatus");
  });

  it("provides checking and local recovery states", () => {
    const loginPage = readFileSync(join(process.cwd(), "src", "app", "login", "page.tsx"), "utf8");

    expect(loginPage).toContain("正在检查账号服务");
    expect(loginPage).toContain("blockedAccountStatus.actionHref");
    expect(loginPage).toContain("blockedAccountStatus.actionLabel");
  });
});
