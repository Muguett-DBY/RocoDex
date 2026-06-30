import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("register page account status preflight", () => {
  it("checks account status before users submit credentials", () => {
    const registerPage = readFileSync(join(process.cwd(), "src", "app", "register", "page.tsx"), "utf8");

    expect(registerPage).toContain('fetch("/api/account-status"');
    expect(registerPage).toContain("accountStatus");
    expect(registerPage).toContain("accountStatus.state !== \"ready\"");
    expect(registerPage).toContain('accountStatus?.state !== "ready"');
    expect(registerPage).toContain("if (!accountStatus)");
  });

  it("renders an actionable unavailable-state notice", () => {
    const registerPage = readFileSync(join(process.cwd(), "src", "app", "register", "page.tsx"), "utf8");

    expect(registerPage).toContain("blockedAccountStatus.title");
    expect(registerPage).toContain("blockedAccountStatus.message");
    expect(registerPage).toContain("blockedAccountStatus.actionHref");
    expect(registerPage).toContain("blockedAccountStatus.actionLabel");
  });
});
