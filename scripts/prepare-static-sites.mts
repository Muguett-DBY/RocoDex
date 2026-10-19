import { appendFileSync, copyFileSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PERSONAL_SITE_SECURITY_HEADERS } from "../src/sites/personal-homepage/infrastructure/routing.ts";
import { createCstdNotFoundHtml } from "../src/sites/personal-homepage/infrastructure/not-found.ts";
import { ROCODEX_SITE_SECURITY_HEADERS } from "../src/sites/rocodex/security.ts";

function headers(values: Record<string, string>) {
  return "/*\n" + Object.entries(values).map(([key, value]) => `  ${key}: ${value}`).join("\n") + "\n\n";
}

writeFileSync("out/404.html", createCstdNotFoundHtml("zh"));
const assetHeaders = readFileSync("public/_headers", "utf8").replace(/^\/\*\r?\n[^\n]*nosniff\r?\n\r?\n/, "");
writeFileSync("out/_headers", headers(PERSONAL_SITE_SECURITY_HEADERS) + assetHeaders);
for (const file of readdirSync("out")) {
  if (!/\.(?:html|json|webmanifest|xml|txt)$/.test(file) || file === "_headers" || file === "en.html") continue;
  const route = file === "index.html" ? "/" : `/${file.replace(/\.html$/, "")}`;
  appendFileSync("out/_headers", `\n${route}\n  Content-Language: zh-CN\n`);
  if (file === "rss.xml") appendFileSync("out/_headers", "  Content-Type: application/rss+xml; charset=utf-8\n");
  if (file.endsWith(".html") && file !== "index.html") {
    appendFileSync("out/_headers", `\n${route}/*\n  Content-Language: zh-CN\n`);
  }
}
appendFileSync("out/_headers", "\n/en/*\n  Content-Language: en-AU\n\n/en\n  Content-Language: en-AU\n");
appendFileSync("out/_headers", "\n/en/rss.xml\n  Content-Type: application/rss+xml; charset=utf-8\n");
writeFileSync("out/_redirects", "/cstd / 301\n/cstd/* /:splat 301\n");
writeFileSync("archive/rocodex/out/_headers", headers(ROCODEX_SITE_SECURITY_HEADERS) + "/_next/static/*\n  Cache-Control: public, max-age=31536000, immutable\n\n/images/*\n  Cache-Control: public, max-age=604800\n");
// Next.js #85374: Windows export leaves nested segment files. Normalize only
// build artifacts to the same flat names produced by Next on Linux.
for (const root of ["out", "archive/rocodex/out"]) {
  for (const file of readdirSync(root, { recursive: true }) as string[]) {
    const normalized = file.replaceAll("\\", "/");
    const segmentStart = normalized.indexOf("__next.");
    if (segmentStart < 0 || !normalized.endsWith(".txt") || !normalized.slice(segmentStart).includes("/")) continue;
    const target = normalized.slice(0, segmentStart) + normalized.slice(segmentStart).replaceAll("/", ".");
    copyFileSync(path.join(root, file), path.join(root, target));
  }
}
console.log("Both domains are ready for assets-only hosting; no Worker script or API bindings.");
