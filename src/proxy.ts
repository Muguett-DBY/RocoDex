import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCstdRouteDecision } from "@/lib/cstd-routing";

const CSTD_NOT_FOUND_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>404 Not Found</title>
</head>
<body>
<main>
<h1>404 Not Found</h1>
<p>This path is not available on custard.top.</p>
</main>
</body>
</html>`;

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const path = request.nextUrl.pathname;
  const cstdRouteDecision = getCstdRouteDecision(host, path);

  if (cstdRouteDecision.kind === "rewrite") {
    return NextResponse.rewrite(new URL(cstdRouteDecision.path, request.url));
  }

  if (cstdRouteDecision.kind === "not-found") {
    return new NextResponse(CSTD_NOT_FOUND_HTML, {
      status: 404,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-robots-tag": "noindex",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
