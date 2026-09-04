const CSTD_PRODUCTION_ORIGIN = "https://custard.top";

export function resolveCstdSiteOrigin(environment: Readonly<Record<string, string | undefined>> = process.env) {
  const configured = environment.CSTD_ORIGIN?.trim();
  if (!configured) return CSTD_PRODUCTION_ORIGIN;
  return configured.replace(/\/+$/, "") || CSTD_PRODUCTION_ORIGIN;
}

export const CSTD_SITE_ORIGIN = resolveCstdSiteOrigin();

export function createCstdUrl(path: string) {
  return `${CSTD_SITE_ORIGIN}${path}`;
}
