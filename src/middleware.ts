import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const path = request.nextUrl.pathname;

  // Landing page: custard.top (root domain, not subdomain)
  if (host === "custard.top" || host === "www.custard.top") {
    if (path === "/" || path === "/index.html") {
      return NextResponse.rewrite(new URL("/home.html", request.url));
    }
    return NextResponse.next();
  }

  // Subdomain: rocodex.custard.top serves main app as usual
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
