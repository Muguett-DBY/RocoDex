import { describe, expect, test } from "vitest";
import config from "./playwright.config";

describe("Playwright web server readiness", () => {
  test("uses a static cross-site health endpoint instead of coupling startup to auth", () => {
    const port = Number(process.env.PLAYWRIGHT_PORT ?? 3100);
    expect(config.webServer).toMatchObject({
      command: `npm run build && npx wrangler dev --ip 127.0.0.1 --local-protocol https --port ${port}`,
      url: `https://127.0.0.1:${port}/status.json`,
      reuseExistingServer: !process.env.CI,
      timeout: 300_000,
    });
  });
});
