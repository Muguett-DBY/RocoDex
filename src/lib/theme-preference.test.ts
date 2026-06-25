import { describe, expect, it } from "vitest";
import { resolveDarkThemePreference } from "@/lib/theme-preference";

describe("theme preference", () => {
  it("uses an explicit stored preference before the system preference", () => {
    expect(resolveDarkThemePreference("dark", false)).toBe(true);
    expect(resolveDarkThemePreference("light", true)).toBe(false);
  });

  it("falls back to the system preference for missing or invalid storage", () => {
    expect(resolveDarkThemePreference(null, true)).toBe(true);
    expect(resolveDarkThemePreference("invalid", false)).toBe(false);
  });
});
