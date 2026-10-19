import { describe, expect, test } from "vitest";
import config from "./playwright.config";

describe("Playwright web server readiness", () => {
  test("uses a static cross-site health endpoint instead of coupling startup to auth", () => {
    expect(config.webServer).toMatchObject({
      command: "npm run build && npx wrangler dev --local-protocol https --port 3100",
      url: "https://127.0.0.1:3100/status.json",
      reuseExistingServer: !process.env.CI,
      timeout: 300_000,
    });
  });
});
