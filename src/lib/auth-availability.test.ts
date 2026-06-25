import { describe, expect, it } from "vitest";
import { isAuthConfigured } from "@/lib/auth-availability";

describe("auth availability", () => {
  it("accepts either supported Auth.js secret name", () => {
    expect(isAuthConfigured({ AUTH_SECRET: "secret" })).toBe(true);
    expect(isAuthConfigured({ NEXTAUTH_SECRET: "legacy-secret" })).toBe(true);
  });

  it("rejects missing and blank secrets", () => {
    expect(isAuthConfigured({})).toBe(false);
    expect(isAuthConfigured({ AUTH_SECRET: "   " })).toBe(false);
  });
});
