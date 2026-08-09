export const PERSONAL_SITE_HOST = "custard.top";
const PERSONAL_SITE_REDIRECT_HOSTS = new Set(["www.custard.top"]);
const PERSONAL_SITE_HOSTS = new Set([PERSONAL_SITE_HOST, ...PERSONAL_SITE_REDIRECT_HOSTS]);
const PERSONAL_SITE_ENTRY_PATHS = new Set(["/", "/index.html"]);
const PERSONAL_SITE_EXPLICIT_ENTRY_PATHS = new Set(["/cstd"]);
const PERSONAL_SITE_PUBLIC_PAGE_ROOTS = new Set([
  "/work",
  "/notes",
  "/lab",
  "/now",
  "/about",
  "/resume",
  "/resume.json",
  "/map",
  "/proof.json",
  "/graph.json",
  "/status.json",
  "/feed.json",
  "/llms.txt",
  "/en",
  "/en/work",
  "/en/notes",
  "/en/lab",
  "/en/now",
  "/en/about",
  "/en/resume",
  "/en/resume.json",
  "/en/map",
  "/en/proof.json",
  "/en/graph.json",
  "/en/status.json",
]);
const PERSONAL_SITE_ALLOWED_PATHS = new Set([
  "/cstd-mascot.svg",
  "/cstd-og.svg",
  "/cstd-og-v2.webp",
  "/cstd-systems-hero-v1.png",
  "/cstd-systems-map-v1.png",
  "/cstd-research-archive-v1.png",
  "/cstd-resume.pdf",
  "/favicon.ico",
  "/robots.txt",
  "/rss.xml",
  "/sitemap.xml",
  "/api/cstd-vitals",
  "/cstd-case-worker.js",
]);

export const PERSONAL_SITE_SECURITY_HEADERS = {
  "content-security-policy": "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; form-action 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self'; font-src 'self' data:; connect-src 'self' https://*.vercel-insights.com; worker-src 'self'; manifest-src 'self'; frame-src 'none'; upgrade-insecure-requests",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-content-type-options": "nosniff",
  "x-dns-prefetch-control": "off",
  "x-frame-options": "DENY",
} as const;

export type PersonalSiteRouteDecision =
  | { kind: "rewrite"; path: string }
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
  if (PERSONAL_SITE_EXPLICIT_ENTRY_PATHS.has(path) || path.startsWith("/cstd/")) return { kind: "next" };
  if (isPublicPersonalPagePath(path)) return { kind: "rewrite", path: `/cstd${path}` };
  if (isAllowedPersonalSitePath(path)) return { kind: "next" };

  return { kind: "not-found" };
}

function isPublicPersonalPagePath(path: string) {
  if (PERSONAL_SITE_PUBLIC_PAGE_ROOTS.has(path)) return true;
  return path.startsWith("/work/")
    || path.startsWith("/for/")
    || path.startsWith("/notes/")
    || path.startsWith("/lab/")
    || path.startsWith("/en/work/")
    || path.startsWith("/en/notes/")
    || path.startsWith("/en/lab/")
    || path === "/en/now"
    || path === "/en/about"
    || path === "/en/resume"
    || path === "/en/map";
}

function isAllowedPersonalSitePath(path: string) {
  return PERSONAL_SITE_ALLOWED_PATHS.has(path)
    || path.startsWith("/cstd-projects/")
    || path.startsWith("/cstd-archive/")
    || path.startsWith("/cstd-persona/")
    || path.startsWith("/cstd-world/")
    || path.startsWith("/cstd-universe/")
    || path.startsWith("/cstd-broadcasts/")
    || path.startsWith("/cstd-districts/");
}

function normalizeHost(host: string) {
  return host.toLowerCase().split(":")[0] ?? "";
}
