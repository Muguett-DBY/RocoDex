import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

// Next 16.3 namespaces route cache keys by their source module. OpenNext still
// emits pathname-based files, so publish the immutable seeds at both locations.
// Keeping the namespace preserves isolation between routes with the same URL.
export function copyScopedRouteCacheEntries(source, destination) {
  let copied = 0;

  function walk(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(filename);
        continue;
      }
      if (!entry.name.endsWith(".cache")) continue;

      const data = JSON.parse(readFileSync(filename, "utf8"));
      const route = data.meta?.routeCache;
      if (!route) continue;

      const match = /^\/route-cache\/(APP_PAGE|APP_ROUTE|PAGES)\/([a-f0-9]{64})\/\$\/(.+)$/.exec(route.key ?? "");
      const segments = route.key?.slice(1).split("/") ?? [];
      if (!match || segments.some((part) => !part || part === "." || part === ".." || /[\\\0]/.test(part))) {
        throw new Error(`[cf-post-build] invalid scoped cache key in ${filename}`);
      }
      const owner = route.owner;
      if (owner?.kind !== match[1] || typeof owner.sourceRoute !== "string" ||
          createHash("sha256").update(owner.sourceRoute).digest("hex") !== match[2]) {
        throw new Error(`[cf-post-build] route cache owner mismatch in ${filename}`);
      }

      const buildId = path.relative(source, filename).split(path.sep)[0];
      const target = path.join(destination, buildId, ...segments) + ".cache";
      mkdirSync(path.dirname(target), { recursive: true });
      copyFileSync(filename, target);
      copied += 1;
    }
  }

  walk(source);
  return copied;
}
