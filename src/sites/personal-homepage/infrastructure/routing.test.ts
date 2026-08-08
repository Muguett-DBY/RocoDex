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
    expect(getPersonalSiteRouteDecision("custard.top", "/cstd/work/rocodex-platform")).toEqual({ kind: "next" });
  });

  test("rewrites clean bilingual archive routes into the internal personal route group", () => {
    expect(getPersonalSiteRouteDecision("custard.top", "/work")).toEqual({ kind: "rewrite", path: "/cstd/work" });
    expect(getPersonalSiteRouteDecision("custard.top", "/work/rocodex-platform")).toEqual({ kind: "rewrite", path: "/cstd/work/rocodex-platform" });
    expect(getPersonalSiteRouteDecision("custard.top", "/notes/evidence-first-ai-research")).toEqual({ kind: "rewrite", path: "/cstd/notes/evidence-first-ai-research" });
    expect(getPersonalSiteRouteDecision("custard.top", "/lab/data-lens")).toEqual({ kind: "rewrite", path: "/cstd/lab/data-lens" });
    expect(getPersonalSiteRouteDecision("custard.top", "/about")).toEqual({ kind: "rewrite", path: "/cstd/about" });
    expect(getPersonalSiteRouteDecision("custard.top", "/en")).toEqual({ kind: "rewrite", path: "/cstd/en" });
    expect(getPersonalSiteRouteDecision("custard.top", "/en/work")).toEqual({ kind: "rewrite", path: "/cstd/en/work" });
    expect(getPersonalSiteRouteDecision("custard.top", "/en/notes")).toEqual({ kind: "rewrite", path: "/cstd/en/notes" });
    expect(getPersonalSiteRouteDecision("custard.top", "/en/lab")).toEqual({ kind: "rewrite", path: "/cstd/en/lab" });
    expect(getPersonalSiteRouteDecision("custard.top", "/en/work/cfzzs-crm")).toEqual({ kind: "rewrite", path: "/cstd/en/work/cfzzs-crm" });
    expect(getPersonalSiteRouteDecision("custard.top", "/en/resume")).toEqual({ kind: "rewrite", path: "/cstd/en/resume" });
    expect(getPersonalSiteRouteDecision("custard.top", "/resume.json")).toEqual({ kind: "rewrite", path: "/cstd/resume.json" });
    expect(getPersonalSiteRouteDecision("custard.top", "/en/resume.json")).toEqual({ kind: "rewrite", path: "/cstd/en/resume.json" });
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
    expect(getPersonalSiteRouteDecision("custard.top", "/cstd-universe/cstd-neural-city-v3.webp")).toEqual({ kind: "next" });
    expect(getPersonalSiteRouteDecision("custard.top", "/cstd-universe/cstd-neural-gate-v1.webp")).toEqual({ kind: "next" });
    expect(getPersonalSiteRouteDecision("custard.top", "/cstd-universe/cstd-skill-reactor-v1.webp")).toEqual({ kind: "next" });
    expect(getPersonalSiteRouteDecision("custard.top", "/cstd-universe/cstd-broadcast-nexus-v1.webp")).toEqual({ kind: "next" });
    expect(getPersonalSiteRouteDecision("custard.top", "/cstd-universe/cstd-departure-city-v1.webp")).toEqual({ kind: "next" });
    expect(getPersonalSiteRouteDecision("custard.top", "/cstd-broadcasts/rocodex-broadcast-v1.webm")).toEqual({ kind: "next" });
    expect(getPersonalSiteRouteDecision("custard.top", "/cstd-broadcasts/rocodex-broadcast-v1.mp4")).toEqual({ kind: "next" });
    expect(getPersonalSiteRouteDecision("custard.top", "/favicon.ico")).toEqual({ kind: "next" });
    expect(getPersonalSiteRouteDecision("custard.top", "/robots.txt")).toEqual({ kind: "next" });
    expect(getPersonalSiteRouteDecision("custard.top", "/sitemap.xml")).toEqual({ kind: "next" });
    expect(getPersonalSiteRouteDecision("custard.top", "/rss.xml")).toEqual({ kind: "next" });
    expect(getPersonalSiteRouteDecision("custard.top", "/api/cstd-vitals")).toEqual({ kind: "next" });
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
