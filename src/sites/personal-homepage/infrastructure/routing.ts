export const PERSONAL_SITE_HOST = "custard.top";
const PERSONAL_SITE_REDIRECT_HOSTS = new Set(["www.custard.top"]);
const PERSONAL_SITE_HOSTS = new Set([PERSONAL_SITE_HOST, ...PERSONAL_SITE_REDIRECT_HOSTS]);
const PERSONAL_SITE_ENTRY_PATHS = new Set(["/", "/index.html"]);
const PERSONAL_SITE_EXPLICIT_ENTRY_PATHS = new Set(["/cstd"]);
const PERSONAL_SITE_ALLOWED_PATHS = new Set([
  "/cstd-mascot.svg",
  "/cstd-og.svg",
  "/cstd-og-v2.webp",
  "/cstd-systems-hero-v1.png",
  "/cstd-systems-map-v1.png",
  "/cstd-research-archive-v1.png",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
]);

export type PersonalSiteRouteDecision =
  | { kind: "rewrite"; path: "/cstd" }
  | { kind: "redirect"; host: typeof PERSONAL_SITE_HOST }
  | { kind: "next" }
  | { kind: "not-found" };

export function isPersonalSiteHost(host: string) {
  return PERSONAL_SITE_HOSTS.has(normalizeHost(host));
}

export function getPersonalSiteRouteDecision(host: string, path: string): PersonalSiteRouteDecision {
  const normalizedHost = normalizeHost(host);

  if (PERSONAL_SITE_REDIRECT_HOSTS.has(normalizedHost)) return { kind: "redirect", host: PERSONAL_SITE_HOST };
  if (!PERSONAL_SITE_HOSTS.has(normalizedHost)) return { kind: "next" };
  if (PERSONAL_SITE_ENTRY_PATHS.has(path)) return { kind: "rewrite", path: "/cstd" };
  if (PERSONAL_SITE_EXPLICIT_ENTRY_PATHS.has(path)) return { kind: "next" };
  if (isAllowedPersonalSitePath(path)) return { kind: "next" };

  return { kind: "not-found" };
}

function isAllowedPersonalSitePath(path: string) {
  return PERSONAL_SITE_ALLOWED_PATHS.has(path)
    || path.startsWith("/cstd-projects/")
    || path.startsWith("/cstd-archive/")
    || path.startsWith("/cstd-persona/")
    || path.startsWith("/cstd-world/")
    || path.startsWith("/cstd-universe/")
    || path.startsWith("/cstd-broadcasts/");
}

function normalizeHost(host: string) {
  return host.toLowerCase().split(":")[0] ?? "";
}
