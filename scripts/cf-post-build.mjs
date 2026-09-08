// Windows compensation for the OpenNext build: the adapter's asset-copy phase
// fails with EPERM on Windows symlinks. This re-copies every prerendered page
// HTML into the assets dir, where it is served statically by Workers Assets.
import { copyFileSync, existsSync, readdirSync } from "node:fs";
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
      copyFileSync(from, path.join(assets, rel));
      pages += 1;
    }
  }
}

copyPrerendered(nextApp, "");
console.log(`[cf-post-build] prerendered pages copied: ${pages}`);
