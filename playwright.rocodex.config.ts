import { defineConfig } from "@playwright/test";
import config from "./playwright.config";

const port = Number(process.env.PLAYWRIGHT_PORT ?? 3101);
const baseURL = `https://127.0.0.1:${port}`;

export default defineConfig({
  ...config,
  outputDir: "test-results/rocodex",
  use: { ...config.use, baseURL },
  webServer: {
    command: `npm run build && npx wrangler dev --config archive/rocodex/wrangler.jsonc --local-protocol https --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    ignoreHTTPSErrors: true,
    timeout: 300_000,
  },
});
