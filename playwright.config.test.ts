import { describe, expect, test } from "vitest";
import config from "./playwright.config";

describe("Playwright web server readiness", () => {
  test("uses a static cross-site health endpoint instead of coupling startup to auth", () => {
    expect(config.webServer).toMatchObject({
      command: "npm run build && npm run start -- --hostname 127.0.0.1 --port 3100",
      url: "http://127.0.0.1:3100/cstd/status.json",
      reuseExistingServer: false,
      timeout: 300_000,
    });
  });
});
