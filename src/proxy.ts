import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPersonalSiteRouteDecision, isPersonalSiteHost, PERSONAL_SITE_SECURITY_HEADERS } from "@/sites/personal-homepage/server";

const CSTD_NOT_FOUND_HTML = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>404 // Signal Lost | CSTD</title>
<style>
*{box-sizing:border-box}html,body{margin:0;min-height:100%;background:#050709;color:#f2efe7;font-family:ui-monospace,SFMono-Regular,Consolas,monospace}body{min-height:100vh;display:grid;place-items:center;overflow:hidden;background-image:linear-gradient(rgba(36,224,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(36,224,255,.06) 1px,transparent 1px);background-size:64px 64px}main{position:relative;width:min(1100px,calc(100% - 40px));border-top:2px solid #f4d431;border-bottom:1px solid rgba(36,224,255,.35);padding:clamp(48px,9vw,112px) 0}main:before{content:"CSTD // DEAD CHANNEL";position:absolute;top:14px;left:0;color:#24e0ff;font-size:10px;font-weight:800}.code{font-size:clamp(6rem,22vw,16rem);font-weight:900;line-height:.72;color:#f4d431}.status{margin:34px 0 0;font-size:clamp(1.5rem,4vw,3.4rem);font-family:system-ui,sans-serif;font-weight:800}.copy{max-width:580px;margin:20px 0 0;color:#8f9ba0;font-family:system-ui,sans-serif;line-height:1.8}.return{display:inline-flex;margin-top:34px;padding:14px 18px;background:#f4d431;color:#050709;font-size:12px;font-weight:900;text-decoration:none}.return:hover{background:#24e0ff}.signal{position:absolute;right:0;bottom:18px;color:#ff5a50;font-size:10px;font-weight:800}@media(max-width:640px){.signal{position:static;margin-top:28px}.code{font-size:7rem}}
</style>
</head>
<body>
<main>
<div class="code">404</div>
<h1 class="status">SIGNAL LOST / 路径未接入</h1>
<p class="copy">这条神经链路不存在，或已经从 CSTD 网络中断开。返回主节点，继续浏览正在运行的系统。</p>
<a class="return" href="/">RETURN TO CSTD://ROOT</a>
<p class="signal">PACKET LOSS 100% · TRACE TERMINATED</p>
</main>
</body>
</html>`;

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const path = request.nextUrl.pathname;
  const cstdRouteDecision = getPersonalSiteRouteDecision(host, path);

  if (cstdRouteDecision.kind === "rewrite") {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = cstdRouteDecision.path;
    return withPersonalSiteHeaders(NextResponse.rewrite(rewriteUrl), host);
  }

  if (cstdRouteDecision.kind === "redirect") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = cstdRouteDecision.host;
    redirectUrl.protocol = "https:";
    return withPersonalSiteHeaders(NextResponse.redirect(redirectUrl, 308), host);
  }

  if (cstdRouteDecision.kind === "not-found") {
    return withPersonalSiteHeaders(new NextResponse(CSTD_NOT_FOUND_HTML, {
      status: 404,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-robots-tag": "noindex",
      },
    }), host);
  }

  return withPersonalSiteHeaders(NextResponse.next(), host);
}

function withPersonalSiteHeaders(response: NextResponse, host: string) {
  if (!isPersonalSiteHost(host)) return response;
  for (const [name, value] of Object.entries(PERSONAL_SITE_SECURITY_HEADERS)) response.headers.set(name, value);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
