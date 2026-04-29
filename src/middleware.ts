import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCstdRewritePath } from "@/lib/cstd-routing";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const path = request.nextUrl.pathname;
  const cstdRewritePath = getCstdRewritePath(host, path);

  // Landing page: custard.top (root domain, not subdomain)
  if (cstdRewritePath) {
    return NextResponse.rewrite(new URL(cstdRewritePath, request.url));
  }

  // Subdomain: rocodex.custard.top serves main app as usual
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
