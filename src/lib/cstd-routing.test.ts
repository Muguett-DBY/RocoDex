import { describe, expect, test } from "vitest";
import { getCstdRouteDecision, isCstdHost } from "./cstd-routing";

describe("CSTD host routing", () => {
  test("detects only the apex CSTD domain", () => {
    expect(isCstdHost("custard.top")).toBe(true);
    expect(isCstdHost("custard.top:443")).toBe(true);
    expect(isCstdHost("www.custard.top")).toBe(true);
    expect(isCstdHost("rocodex.custard.top")).toBe(false);
  });

  test("rewrites only the CSTD root entry points to the React landing route", () => {
    expect(getCstdRouteDecision("custard.top", "/")).toEqual({ kind: "rewrite", path: "/cstd" });
    expect(getCstdRouteDecision("custard.top", "/index.html")).toEqual({ kind: "rewrite", path: "/cstd" });
  });

  test("serves the CSTD landing route on both canonical and explicit CSTD paths", () => {
    expect(getCstdRouteDecision("custard.top", "/cstd")).toEqual({ kind: "next" });
  });

  test("returns not found for CSTD paths that belong on the RocoDex subdomain", () => {
    expect(getCstdRouteDecision("custard.top", "/creatures")).toEqual({ kind: "not-found" });
    expect(getCstdRouteDecision("custard.top", "/guides/example")).toEqual({ kind: "not-found" });
    expect(getCstdRouteDecision("custard.top", "/login")).toEqual({ kind: "not-found" });
    expect(getCstdRouteDecision("custard.top", "/api/register")).toEqual({ kind: "not-found" });
  });

  test("allows CSTD assets and SEO endpoints on the apex domain", () => {
    expect(getCstdRouteDecision("custard.top", "/cstd-mascot.svg")).toEqual({ kind: "next" });
    expect(getCstdRouteDecision("custard.top", "/cstd-og.svg")).toEqual({ kind: "next" });
    expect(getCstdRouteDecision("custard.top", "/cstd-audio/intro-custard-stinger.wav")).toEqual({ kind: "next" });
    expect(getCstdRouteDecision("custard.top", "/favicon.ico")).toEqual({ kind: "next" });
    expect(getCstdRouteDecision("custard.top", "/robots.txt")).toEqual({ kind: "next" });
    expect(getCstdRouteDecision("custard.top", "/sitemap.xml")).toEqual({ kind: "next" });
  });

  test("leaves RocoDex subdomain routes untouched", () => {
    expect(getCstdRouteDecision("rocodex.custard.top", "/")).toEqual({ kind: "next" });
    expect(getCstdRouteDecision("rocodex.custard.top", "/creatures")).toEqual({ kind: "next" });
  });

  test("redirects the www CSTD host to the apex domain before route handling", () => {
    expect(getCstdRouteDecision("www.custard.top", "/")).toEqual({ kind: "redirect", host: "custard.top" });
    expect(getCstdRouteDecision("www.custard.top:443", "/cstd")).toEqual({
      kind: "redirect",
      host: "custard.top",
    });
  });
});
