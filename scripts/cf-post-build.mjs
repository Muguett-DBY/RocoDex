// Windows-compensation for the OpenNext build: the adapter's copy phases fail
// with EPERM on Windows symlinks/locked files. This re-copies, deterministically:
//  1. every prerendered page HTML into the assets dir (served statically)
//  2. the traced node_modules packages that failed to copy into the server bundle
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const nextApp = path.join(root, ".next", "server", "app");
const assets = path.join(root, ".open-next", "assets");
let pages = 0;
function copyPrerendered(dir, base) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const from = path.join(dir, entry.name);
    const rel = path.join(base, entry.name);
    if (entry.isDirectory()) {
      copyPrerendered(from, rel);
    } else if (entry.name.endsWith(".html")) {
      const to = path.join(assets, rel);
      cpSync(from, to);
      pages += 1;
    }
  }
}
copyPrerendered(nextApp, "");

console.log(`[cf-post-build] prerendered pages copied: ${pages}, runtime packages restored: ${packages}`);
