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

    expect(loginPage).toContain("AccountStatusPanel");
    expect(loginPage).toContain("status={accountStatus}");
    expect(loginPage).toContain("account-status-submit-help");
    expect(loginPage).toContain("aria-describedby");
    expect(loginPage).toContain("账号服务可用后即可登录");
  });
});
