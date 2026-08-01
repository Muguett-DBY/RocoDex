export const CSTD_HOST = "custard.top";
const CSTD_REDIRECT_HOSTS = new Set(["www.custard.top"]);
const CSTD_HOSTS = new Set([CSTD_HOST, ...CSTD_REDIRECT_HOSTS]);
const CSTD_ENTRY_PATHS = new Set(["/", "/index.html"]);
const CSTD_EXPLICIT_ENTRY_PATHS = new Set(["/cstd"]);
const CSTD_ALLOWED_PATHS = new Set([
  "/cstd-mascot.svg",
  "/cstd-og.svg",
  "/cstd-systems-hero-v1.png",
  "/cstd-systems-map-v1.png",
  "/cstd-research-archive-v1.png",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
]);

export type CstdRouteDecision =
  | { kind: "rewrite"; path: "/cstd" }
  | { kind: "redirect"; host: typeof CSTD_HOST }
  | { kind: "next" }
  | { kind: "not-found" };

export function isCstdHost(host: string) {
  return CSTD_HOSTS.has(normalizeHost(host));
}

export function getCstdRouteDecision(host: string, path: string): CstdRouteDecision {
  const normalizedHost = normalizeHost(host);

  if (CSTD_REDIRECT_HOSTS.has(normalizedHost)) return { kind: "redirect", host: CSTD_HOST };
  if (!CSTD_HOSTS.has(normalizedHost)) return { kind: "next" };
  if (CSTD_ENTRY_PATHS.has(path)) return { kind: "rewrite", path: "/cstd" };
  if (CSTD_EXPLICIT_ENTRY_PATHS.has(path)) return { kind: "next" };
  if (isAllowedCstdPath(path)) return { kind: "next" };

  return { kind: "not-found" };
}

function isAllowedCstdPath(path: string) {
  return CSTD_ALLOWED_PATHS.has(path)
    || path.startsWith("/cstd-projects/")
    || path.startsWith("/cstd-archive/");
}

function normalizeHost(host: string) {
  return host.toLowerCase().split(":")[0] ?? "";
}
