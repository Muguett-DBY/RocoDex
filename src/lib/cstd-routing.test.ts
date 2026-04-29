import { describe, expect, test } from "vitest";
import { getCstdRewritePath, isCstdHost } from "./cstd-routing";

describe("CSTD host routing", () => {
  test("detects the apex and www CSTD domains", () => {
    expect(isCstdHost("custard.top")).toBe(true);
    expect(isCstdHost("www.custard.top")).toBe(true);
    expect(isCstdHost("custard.top:443")).toBe(true);
    expect(isCstdHost("rocodex.custard.top")).toBe(false);
  });

  test("rewrites only the CSTD root entry points to the React landing route", () => {
    expect(getCstdRewritePath("custard.top", "/")).toBe("/cstd");
    expect(getCstdRewritePath("www.custard.top", "/index.html")).toBe("/cstd");
    expect(getCstdRewritePath("custard.top", "/projects")).toBeNull();
    expect(getCstdRewritePath("rocodex.custard.top", "/")).toBeNull();
  });
});
