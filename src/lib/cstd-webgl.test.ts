import { describe, expect, test } from "vitest";
import { canUseCstdWebgl } from "./cstd-webgl";

describe("CSTD WebGL support", () => {
  test("falls back when browser globals are unavailable", () => {
    expect(canUseCstdWebgl()).toBe(false);
  });

  test("falls back when canvas contexts are unavailable", () => {
    const fakeWindow = {
      document: {
        createElement: () => ({
          getContext: () => null,
        }),
      },
    };

    expect(canUseCstdWebgl(fakeWindow)).toBe(false);
  });

  test("uses WebGL when a supported context can be created", () => {
    const fakeWindow = {
      document: {
        createElement: () => ({
          getContext: (name: string) => (name === "webgl" ? {} : null),
        }),
      },
    };

    expect(canUseCstdWebgl(fakeWindow)).toBe(true);
  });
});
