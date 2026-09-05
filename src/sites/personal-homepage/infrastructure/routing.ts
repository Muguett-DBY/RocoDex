const PERSONAL_SITE_HOST = "custard.top";
const PERSONAL_SITE_REDIRECT_HOSTS = new Set(["www.custard.top"]);
const PERSONAL_SITE_HOSTS = new Set([PERSONAL_SITE_HOST, ...PERSONAL_SITE_REDIRECT_HOSTS]);
const PERSONAL_SITE_ENTRY_PATHS = new Set(["/", "/index.html"]);
const PERSONAL_SITE_EXPLICIT_ENTRY_PATHS = new Set(["/cstd"]);
export const PERSONAL_SITE_PUBLIC_PAGE_ROOTS: ReadonlySet<string> = new Set([
  "/work",
  "/notes",
  "/lab",
  "/voxel",
  "/topics",
  "/now",
  "/about",
  "/resume",
  "/resume.json",
  "/map",
  "/proof.json",
  "/graph.json",
  "/status.json",
  "/studio.json",
  "/observatory.json",
  "/content-health.json",
  "/performance.json",
  "/experience.json",
  "/releases.json",
  "/feed.json",
  "/topics.json",
  "/llms.txt",
  "/manifest.webmanifest",
  "/en",
  "/en/work",
  "/en/notes",
  "/en/lab",
  "/en/voxel",
  "/en/topics",
  "/en/now",
  "/en/about",
  "/en/resume",
  "/en/resume.json",
  "/en/map",
  "/en/proof.json",
  "/en/graph.json",
  "/en/status.json",
  "/en/topics.json",
  "/en/studio.json",
  "/en/observatory.json",
  "/en/content-health.json",
  "/en/performance.json",
  "/en/experience.json",
  "/en/releases.json",
  "/en/feed.json",
  "/en/manifest.webmanifest",
  "/en/llms.txt",
]);
export const PERSONAL_SITE_DYNAMIC_PAGE_PREFIXES: readonly string[] = [
  "/work/",
  "/for/",
  "/notes/",
  "/lab/",
  "/topics/",
  "/en/work/",
  "/en/notes/",
  "/en/lab/",
  "/en/topics/",
  "/en/for/",
];

export const PERSONAL_SITE_PUBLIC_EXACT_PATHS: ReadonlySet<string> = new Set([
  "/en/now",
  "/en/about",
  "/en/resume",
  "/en/map",
]);
const PERSONAL_SITE_ALLOWED_PATHS = new Set([
  "/cstd-mascot.svg",
  "/cstd-og.svg",
  "/cstd-og-v2.webp",
  "/favicon.ico",
  "/robots.txt",
  "/rss.xml",
  "/sitemap.xml",
  "/.well-known/security.txt",
  "/api/cstd-vitals",
  "/cstd-case-worker.js",
]);

export const PERSONAL_SITE_SECURITY_HEADERS = {
  "content-security-policy": "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; form-action 'self'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self'; font-src 'self' data:; connect-src 'self' https://*.vercel-insights.com https://cloudflareinsights.com; worker-src 'self'; manifest-src 'self'; frame-src 'none'; upgrade-insecure-requests",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
  "permissions-policy": "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), xr-spatial-tracking=(), browsing-topics=()",
  "referrer-policy": "strict-origin-when-cross-origin",
  "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
  "x-content-type-options": "nosniff",
  "x-dns-prefetch-control": "off",
  "x-download-options": "noopen",
  "x-frame-options": "DENY",
  "origin-agent-cluster": "?1",
  "x-permitted-cross-domain-policies": "none",
} as const;

export type PersonalSiteRouteDecision =
  | { kind: "rewrite"; path: string }
  | { kind: "redirect"; host: typeof PERSONAL_SITE_HOST }
  | { kind: "redirect-path"; path: "/en" }
  | { kind: "next" }
  | { kind: "not-found" };

export function isPersonalSiteHost(host: string) {
  return PERSONAL_SITE_HOSTS.has(normalizeHost(host));
}

export function parseCstdAcceptLanguage(header: string | undefined | null): "zh" | "en" {
  if (!header) return "zh";
  const candidates = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qualityParam = params.find((param) => param.trim().startsWith("q="));
      const quality = qualityParam ? Number.parseFloat(qualityParam.trim().slice(2)) : 1;
      return { tag: (tag ?? "").trim().toLowerCase(), quality: Number.isFinite(quality) ? quality : 0 };
    })
    .filter((candidate) => candidate.tag.length > 0 && candidate.quality > 0);
  let winner: { language: "zh" | "en"; quality: number } | null = null;
  for (const candidate of candidates) {
    const language = candidate.tag === "*" || candidate.tag.startsWith("zh") ? "zh"
      : candidate.tag.startsWith("en") ? "en"
      : null;
    if (!language) continue;
    if (!winner || candidate.quality > winner.quality) {
      winner = { language, quality: candidate.quality };
      if (language === "en" && candidate.quality === 1 && candidate.tag !== "*") break;
    }
  }
  return winner?.language ?? "zh";
}

export function getPersonalSiteRouteDecision(
  host: string,
  path: string,
  preferredLocale?: "zh" | "en",
  acceptLanguage?: string,
): PersonalSiteRouteDecision {
  const normalizedHost = normalizeHost(host);

  if (PERSONAL_SITE_REDIRECT_HOSTS.has(normalizedHost)) return { kind: "redirect", host: PERSONAL_SITE_HOST };
  if (!PERSONAL_SITE_HOSTS.has(normalizedHost)) return { kind: "next" };
  if (PERSONAL_SITE_ENTRY_PATHS.has(path)) {
    const locale = preferredLocale ?? parseCstdAcceptLanguage(acceptLanguage);
    if (locale === "en") return { kind: "redirect-path", path: "/en" };
    return { kind: "rewrite", path: "/cstd" };
  }
  if (PERSONAL_SITE_EXPLICIT_ENTRY_PATHS.has(path) || path.startsWith("/cstd/")) return { kind: "next" };
  if (isPublicPersonalPagePath(path)) return { kind: "rewrite", path: `/cstd${path}` };
  if (isAllowedPersonalSitePath(path)) return { kind: "next" };

  return { kind: "not-found" };
}

function isPublicPersonalPagePath(path: string) {
  if (PERSONAL_SITE_PUBLIC_PAGE_ROOTS.has(path)) return true;
  if (PERSONAL_SITE_PUBLIC_EXACT_PATHS.has(path)) return true;
  return PERSONAL_SITE_DYNAMIC_PAGE_PREFIXES.some((prefix) => path.startsWith(prefix));
}

function isAllowedPersonalSitePath(path: string) {
  return PERSONAL_SITE_ALLOWED_PATHS.has(path)
    || path.startsWith("/cstd-projects/")
    || path.startsWith("/cstd-archive/")
    || path.startsWith("/cstd-materials/")
    || path.startsWith("/cstd-persona/")
    || path.startsWith("/cstd-stage/")
    || path.startsWith("/cstd-themes/")
    || path.startsWith("/cstd-world/")
    || path.startsWith("/cstd-universe/")
    || path.startsWith("/cstd-districts/")
    || path.startsWith("/fonts/cstd/");
}

function normalizeHost(host: string) {
  return host.toLowerCase().split(":")[0] ?? "";
}
