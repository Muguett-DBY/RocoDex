import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // The site is fully static (force-static pages + a couple of route handlers);
  // no incremental cache backend is needed.
});
