export function isPersonalSiteHost(host: string) {
  return ["custard.top", "www.custard.top"].includes(host.toLowerCase().split(":")[0] ?? "");
}

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
