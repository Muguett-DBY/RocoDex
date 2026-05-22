import { describe, expect, it } from "vitest";
import { shouldDisableSessionProvider } from "@/lib/auth-provider-routing";

describe("shouldDisableSessionProvider", () => {
  it("disables auth session polling on the CSTD route", () => {
    expect(shouldDisableSessionProvider("/cstd", "rocodex.custard.top")).toBe(true);
  });

  it("disables auth session polling on the custard apex host after middleware rewrite", () => {
    expect(shouldDisableSessionProvider("/", "custard.top")).toBe(true);
    expect(shouldDisableSessionProvider("/", "www.custard.top")).toBe(true);
  });

  it("keeps auth session polling for the RocoDex app host", () => {
    expect(shouldDisableSessionProvider("/", "rocodex.custard.top")).toBe(false);
    expect(shouldDisableSessionProvider("/creatures", "rocodex.custard.top")).toBe(false);
  });
});
