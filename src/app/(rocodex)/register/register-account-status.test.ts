import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("register page account status preflight", () => {
  it("checks account status before users submit credentials", () => {
    const registerPage = readFileSync(join(process.cwd(), "src", "app", "(rocodex)", "register", "page.tsx"), "utf8");

    expect(registerPage).toContain("accountStatus");
    expect(registerPage).toContain("accountStatus.state !== \"ready\"");
    expect(registerPage).toContain('accountStatus?.state !== "ready"');
    expect(registerPage).toContain("if (!accountStatus)");
    expect(registerPage).toContain("useAccountServiceStatus");
    expect(registerPage).toContain("AccountStatusPanel");
  });

  it("renders an actionable unavailable-state notice", () => {
    const registerPage = readFileSync(join(process.cwd(), "src", "app", "(rocodex)", "register", "page.tsx"), "utf8");

    expect(registerPage).toContain("AccountStatusPanel");
    expect(registerPage).toContain("status={accountStatus}");
    expect(registerPage).toContain("account-status-submit-help");
    expect(registerPage).toContain("aria-describedby");
    expect(registerPage).toContain("账号服务可用后即可注册");
  });
});
