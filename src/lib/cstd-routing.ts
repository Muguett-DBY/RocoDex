const CSTD_HOSTS = new Set(["custard.top", "www.custard.top"]);
const CSTD_ENTRY_PATHS = new Set(["/", "/index.html"]);

export function isCstdHost(host: string) {
  return CSTD_HOSTS.has(normalizeHost(host));
}

export function getCstdRewritePath(host: string, path: string) {
  if (!isCstdHost(host)) return null;
  return CSTD_ENTRY_PATHS.has(path) ? "/cstd" : null;
}

function normalizeHost(host: string) {
  return host.toLowerCase().split(":")[0] ?? "";
}
