const CSTD_HOST = "custard.top";
const UNSUPPORTED_CSTD_HOSTS = new Set(["www.custard.top"]);
const CSTD_ENTRY_PATHS = new Set(["/", "/index.html"]);
const CSTD_EXPLICIT_ENTRY_PATHS = new Set(["/cstd"]);
const CSTD_ALLOWED_PATHS = new Set(["/cstd-mascot.svg", "/cstd-og.svg", "/favicon.ico", "/sitemap.xml"]);

export type CstdRouteDecision =
  | { kind: "rewrite"; path: "/cstd" }
  | { kind: "next" }
  | { kind: "not-found" };

export function isCstdHost(host: string) {
  return normalizeHost(host) === CSTD_HOST;
}

export function getCstdRouteDecision(host: string, path: string): CstdRouteDecision {
  const normalizedHost = normalizeHost(host);

  if (UNSUPPORTED_CSTD_HOSTS.has(normalizedHost)) return { kind: "not-found" };
  if (normalizedHost !== CSTD_HOST) return { kind: "next" };
  if (CSTD_ENTRY_PATHS.has(path)) return { kind: "rewrite", path: "/cstd" };
  if (CSTD_EXPLICIT_ENTRY_PATHS.has(path)) return { kind: "next" };
  if (isAllowedCstdPath(path)) return { kind: "next" };

  return { kind: "not-found" };
}

function isAllowedCstdPath(path: string) {
  return CSTD_ALLOWED_PATHS.has(path) || path.startsWith("/cstd-audio/");
}

function normalizeHost(host: string) {
  return host.toLowerCase().split(":")[0] ?? "";
}
