const CSTD_HOSTS = new Set(["custard.top", "www.custard.top"]);

export function shouldDisableSessionProvider(pathname: string, hostname?: string | null) {
  return pathname === "/cstd" || CSTD_HOSTS.has(normalizeHostname(hostname));
}

function normalizeHostname(hostname?: string | null) {
  return (hostname ?? "").toLowerCase().split(":")[0] ?? "";
}
