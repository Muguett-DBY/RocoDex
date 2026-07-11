import { describe, expect, test } from "vitest";
import config from "./playwright.config";

describe("Playwright web server readiness", () => {
  test("waits for the auth session endpoint used by core flows", () => {
    expect(config.webServer).toMatchObject({
      url: "http://127.0.0.1:3100/api/auth/session",
    });
  });
});
