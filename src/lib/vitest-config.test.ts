import config from "../../vitest.config.mts";
import { describe, expect, test } from "vitest";

describe("Vitest configuration", () => {
  test("excludes Playwright end-to-end specs from unit test collection", () => {
    expect(config.test?.exclude).toEqual(expect.arrayContaining(["e2e/**"]));
  });
});
