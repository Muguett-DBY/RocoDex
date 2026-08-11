import { describe, expect, test } from "vitest";
import { isRocoDexSiteHost, ROCODEX_SITE_SECURITY_HEADERS } from "./security";

describe("RocoDex production security", () => {
  test("targets only the production RocoDex host", () => {
    expect(isRocoDexSiteHost("rocodex.custard.top")).toBe(true);
    expect(isRocoDexSiteHost("rocodex.custard.top:443")).toBe(true);
    expect(isRocoDexSiteHost("custard.top")).toBe(false);
    expect(isRocoDexSiteHost("localhost:3000")).toBe(false);
  });

  test("blocks framing and restricts executable browser resources", () => {
    const policy = ROCODEX_SITE_SECURITY_HEADERS["content-security-policy"];
    expect(policy).toContain("default-src 'self'");
    expect(policy).toContain("frame-ancestors 'none'");
    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain("frame-src 'none'");
    expect(ROCODEX_SITE_SECURITY_HEADERS["x-frame-options"]).toBe("DENY");
    expect(ROCODEX_SITE_SECURITY_HEADERS["permissions-policy"]).toContain("camera=()");
  });
});
