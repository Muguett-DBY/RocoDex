import type { CstdLocale } from "../content/content-types";
import { cstdLocaleConfig } from "./i18n";

export const cstdNotFoundCopy: Readonly<Record<CstdLocale, {
  eyebrow: string;
  heading: string;
  body: string;
  action: string;
  signal: string;
}>> = {
  zh: {
    eyebrow: "CSTD // DEAD CHANNEL",
    heading: "信号丢失 / 路径未接入",
    body: "这条神经链路不存在，或已经从 CSTD 网络中断开。返回主节点，继续浏览正在运行的系统。",
    action: "返回 CSTD://ROOT",
    signal: "丢包率 100% / 追踪已终止",
  },
  en: {
    eyebrow: "CSTD // DEAD CHANNEL",
    heading: "Signal lost / Route disconnected",
    body: "This neural route does not exist or has disconnected from the CSTD network. Return to the root node and continue through the systems still online.",
    action: "Return to CSTD://ROOT",
    signal: "PACKET LOSS 100% / TRACE TERMINATED",
  },
};

export function getCstdNotFoundEntryPath(locale: CstdLocale) {
  return locale === "en" ? "/en" : "/";
}

export function createCstdNotFoundHtml(locale: CstdLocale) {
  const copy = cstdNotFoundCopy[locale];
  const title = locale === "zh" ? "404 // 信号丢失 | CSTD" : "404 // Signal Lost | CSTD";
  return `<!doctype html>
<html lang="${cstdLocaleConfig[locale].htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title}</title>
<style>
*{box-sizing:border-box}html,body{margin:0;min-height:100%;background:#050709;color:#f2efe7;font-family:ui-monospace,SFMono-Regular,Consolas,monospace}body{min-height:100vh;display:grid;place-items:center;overflow:hidden;background-image:linear-gradient(rgba(36,224,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(36,224,255,.06) 1px,transparent 1px);background-size:64px 64px}main{position:relative;width:min(1100px,calc(100% - 40px));border-top:2px solid #f4d431;border-bottom:1px solid rgba(36,224,255,.35);padding:clamp(48px,9vw,112px) 0}main:before{content:"CSTD // DEAD CHANNEL";position:absolute;top:14px;left:0;color:#24e0ff;font-size:10px;font-weight:800}.code{font-size:clamp(6rem,22vw,16rem);font-weight:900;line-height:.72;color:#f4d431}.status{margin:34px 0 0;font-size:clamp(1.5rem,4vw,3.4rem);font-family:system-ui,sans-serif;font-weight:800;text-transform:uppercase}.copy{max-width:580px;margin:20px 0 0;color:#8f9ba0;font-family:system-ui,sans-serif;line-height:1.8}.return{display:inline-flex;margin-top:34px;padding:14px 18px;background:#f4d431;color:#050709;font-size:12px;font-weight:900;text-decoration:none;text-transform:uppercase}.return:hover{background:#24e0ff}.signal{position:absolute;right:0;bottom:18px;color:#ff5a50;font-size:10px;font-weight:800;text-transform:uppercase}@media(max-width:640px){.signal{position:static;margin-top:28px}.code{font-size:7rem}}
</style>
</head>
<body>
<main>
<div class="code">404</div>
<h1 class="status">${copy.heading}</h1>
<p class="copy">${copy.body}</p>
<a class="return" href="${getCstdNotFoundEntryPath(locale)}">${copy.action}</a>
<p class="signal">${copy.signal}</p>
</main>
</body>
</html>`;
}
