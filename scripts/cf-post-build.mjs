// Post-build step for the Cloudflare bundle: prerendered pages are served by
// the worker through the static-assets incremental cache, which reads
// cdn-cgi/_next_cache inside the assets bucket (public requests to /cdn-cgi/*
// never reach the origin, but the ASSETS binding can read them). No HTML is
// copied into assets, so RSC/flight requests reach the Next server instead of
// being shadowed by document responses; media stays asset-first per the
// run_worker_first rules in wrangler.jsonc.
import { cpSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const assets = path.join(root, ".open-next", "assets");

const requiredMediaRoots = [
  "_next/static",
  "cstd-archive",
  "cstd-districts",
  "cstd-materials",
  "cstd-persona",
  "cstd-projects",
  "cstd-stage",
  "cstd-themes",
  "cstd-universe",
  "cstd-world",
  "fonts",
  "images",
];

for (const mediaRoot of requiredMediaRoots) {
  if (!existsSync(path.join(assets, mediaRoot))) {
    throw new Error(`[cf-post-build] missing media root in assets: ${mediaRoot}`);
  }
}

const cacheSource = path.join(root, ".open-next", "cache");
const cacheDir = path.join(assets, "cdn-cgi", "_next_cache");
if (!existsSync(cacheSource)) {
  throw new Error("[cf-post-build] missing .open-next/cache from the OpenNext build");
}
cpSync(cacheSource, cacheDir, { recursive: true });

let cacheEntries = 0;
function countEntries(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) countEntries(entryPath);
    else {
      if (statSync(entryPath).size === 0) {
        throw new Error(`[cf-post-build] empty cache entry: ${entryPath}`);
      }
      cacheEntries += 1;
    }
  }
}

countEntries(cacheDir);

const strays = readdirSync(assets).filter((entry) => entry.endsWith(".html"));
if (strays.length > 0) {
  throw new Error(
    `[cf-post-build] prerendered HTML in assets would shadow the ISR cache: ${strays.join(", ")}`,
  );
}

console.log(
  `[cf-post-build] bundle OK: ${requiredMediaRoots.length} media roots, ${cacheEntries} incremental cache entries, assets clean of prerendered HTML`,
);
