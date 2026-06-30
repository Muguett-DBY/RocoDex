import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("auth page runtime configuration", () => {
  it("keeps login and register layouts dynamic so runtime auth env is not frozen at build time", () => {
    const registerLayout = readFileSync(join(process.cwd(), "src", "app", "register", "layout.tsx"), "utf8");
    const loginLayout = readFileSync(join(process.cwd(), "src", "app", "login", "layout.tsx"), "utf8");

    expect(registerLayout).toContain('export const dynamic = "force-dynamic"');
    expect(loginLayout).toContain('export const dynamic = "force-dynamic"');
  });
});
