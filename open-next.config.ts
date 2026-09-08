import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
  // The site only serves deploy-time prerendered data (no revalidation), so the
  // read-only static-assets incremental cache is the zero-backend choice: ISR
  // cache entries are bundled into assets under cdn-cgi/_next_cache and read
  // through the ASSETS binding.
  incrementalCache: staticAssetsIncrementalCache,
});
