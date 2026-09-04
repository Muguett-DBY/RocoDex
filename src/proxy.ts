import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createCstdNotFoundHtml, cstdLocaleConfig, getCstdLocaleFromPathname, getPersonalSiteRouteDecision, isPersonalSiteHost, PERSONAL_SITE_SECURITY_HEADERS } from "@/sites/personal-homepage/server";
import { isRocoDexSiteHost, ROCODEX_SITE_SECURITY_HEADERS } from "@/sites/rocodex/security";

const CSTD_ENTRY_PATHS = new Set(["/", "/index.html"]);

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const path = request.nextUrl.pathname;
  const localeCookie = request.cookies.get("cstd-locale")?.value;
  const preferredLocale = localeCookie === "en" || localeCookie === "zh" ? localeCookie : undefined;
  const acceptLanguage = preferredLocale ? undefined : request.headers.get("accept-language") ?? undefined;
  const cstdRouteDecision = getPersonalSiteRouteDecision(host, path, preferredLocale, acceptLanguage);
  const varyAcceptLanguage = Boolean(acceptLanguage) && CSTD_ENTRY_PATHS.has(path) && isPersonalSiteHost(host);

  if (cstdRouteDecision.kind === "rewrite") {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = cstdRouteDecision.path;
    return withSiteSecurityHeaders(NextResponse.rewrite(rewriteUrl), host, path, { varyAcceptLanguage });
  }

  if (cstdRouteDecision.kind === "redirect") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = cstdRouteDecision.host;
    redirectUrl.protocol = "https:";
    return withSiteSecurityHeaders(NextResponse.redirect(redirectUrl, 308), host, path);
  }

  if (cstdRouteDecision.kind === "redirect-path") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = cstdRouteDecision.path;
    return withSiteSecurityHeaders(NextResponse.redirect(redirectUrl, 307), host, cstdRouteDecision.path, { varyAcceptLanguage });
  }

  if (cstdRouteDecision.kind === "not-found") {
    const locale = getCstdLocaleFromPathname(path);
    return withSiteSecurityHeaders(new NextResponse(createCstdNotFoundHtml(locale), {
      status: 404,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-robots-tag": "noindex",
      },
    }), host, path);
  }

  return withSiteSecurityHeaders(NextResponse.next(), host, path);
}

function withSiteSecurityHeaders(response: NextResponse, host: string, path: string, options: { varyAcceptLanguage?: boolean } = {}) {
  const headers = isPersonalSiteHost(host)
    ? PERSONAL_SITE_SECURITY_HEADERS
    : isRocoDexSiteHost(host)
      ? ROCODEX_SITE_SECURITY_HEADERS
      : null;
  if (!headers) return response;
  for (const [name, value] of Object.entries(headers)) response.headers.set(name, value);
  if (options.varyAcceptLanguage) response.headers.append("vary", "Accept-Language");
  if (isPersonalSiteHost(host)) response.headers.set("content-language", cstdLocaleConfig[getCstdLocaleFromPathname(path)].htmlLang);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
