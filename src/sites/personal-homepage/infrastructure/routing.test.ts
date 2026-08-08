import { describe, expect, test } from "vitest";
import { getPersonalSiteRouteDecision, isPersonalSiteHost } from "./routing";

describe("CSTD host routing", () => {
  test("detects only the apex CSTD domain", () => {
    expect(isPersonalSiteHost("custard.top")).toBe(true);
    expect(isPersonalSiteHost("custard.top:443")).toBe(true);
    expect(isPersonalSiteHost("www.custard.top")).toBe(true);
    expect(isPersonalSiteHost("rocodex.custard.top")).toBe(false);
  });

  test("rewrites only the CSTD root entry points to the React landing route", () => {
    expect(getPersonalSiteRouteDecision("custard.top", "/")).toEqual({ kind: "rewrite", path: "/cstd" });
    expect(getPersonalSiteRouteDecision("custard.top", "/index.html")).toEqual({ kind: "rewrite", path: "/cstd" });
  });

  test("serves the CSTD landing route on both canonical and explicit CSTD paths", () => {
    expect(getPersonalSiteRouteDecision("custard.top", "/cstd")).toEqual({ kind: "next" });
  });

  test("returns not found for CSTD paths that belong on the RocoDex subdomain", () => {
    expect(getPersonalSiteRouteDecision("custard.top", "/creatures")).toEqual({ kind: "not-found" });
    expect(getPersonalSiteRouteDecision("custard.top", "/guides/example")).toEqual({ kind: "not-found" });
    expect(getPersonalSiteRouteDecision("custard.top", "/login")).toEqual({ kind: "not-found" });
    expect(getPersonalSiteRouteDecision("custard.top", "/api/register")).toEqual({ kind: "not-found" });
  });

  test("allows CSTD assets and SEO endpoints on the apex domain", () => {
    expect(getPersonalSiteRouteDecision("custard.top", "/cstd-mascot.svg")).toEqual({ kind: "next" });
    expect(getPersonalSiteRouteDecision("custard.top", "/cstd-og.svg")).toEqual({ kind: "next" });
    expect(getPersonalSiteRouteDecision("custard.top", "/cstd-og-v2.webp")).toEqual({ kind: "next" });
    expect(getPersonalSiteRouteDecision("custard.top", "/cstd-systems-hero-v1.png")).toEqual({ kind: "next" });
    expect(getPersonalSiteRouteDecision("custard.top", "/cstd-systems-map-v1.png")).toEqual({ kind: "next" });
    expect(getPersonalSiteRouteDecision("custard.top", "/cstd-research-archive-v1.png")).toEqual({ kind: "next" });
    expect(getPersonalSiteRouteDecision("custard.top", "/cstd-archive/cstd-archive-resin-circuit-v1.webp")).toEqual({ kind: "next" });
    expect(getPersonalSiteRouteDecision("custard.top", "/cstd-world/cstd-kinetic-studio-v2.webp")).toEqual({ kind: "next" });
    expect(getPersonalSiteRouteDecision("custard.top", "/cstd-persona/cstd-night-runner-v1.webp")).toEqual({ kind: "next" });
    expect(getPersonalSiteRouteDecision("custard.top", "/cstd-projects/rocodex.png")).toEqual({ kind: "next" });
    expect(getPersonalSiteRouteDecision("custard.top", "/favicon.ico")).toEqual({ kind: "next" });
    expect(getPersonalSiteRouteDecision("custard.top", "/robots.txt")).toEqual({ kind: "next" });
    expect(getPersonalSiteRouteDecision("custard.top", "/sitemap.xml")).toEqual({ kind: "next" });
  });

  test("leaves RocoDex subdomain routes untouched", () => {
    expect(getPersonalSiteRouteDecision("rocodex.custard.top", "/")).toEqual({ kind: "next" });
    expect(getPersonalSiteRouteDecision("rocodex.custard.top", "/creatures")).toEqual({ kind: "next" });
  });

  test("redirects the www CSTD host to the apex domain before route handling", () => {
    expect(getPersonalSiteRouteDecision("www.custard.top", "/")).toEqual({ kind: "redirect", host: "custard.top" });
    expect(getPersonalSiteRouteDecision("www.custard.top:443", "/cstd")).toEqual({
      kind: "redirect",
      host: "custard.top",
    });
  });
});
