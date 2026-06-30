import { describe, expect, test, vi } from "vitest";
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

  test("falls back without probing a context in automated browsers", () => {
    const createElement = vi.fn(() => ({
      getContext: vi.fn(() => ({})),
    }));
    const fakeWindow = {
      navigator: { webdriver: true },
      document: { createElement },
    };

    expect(canUseCstdWebgl(fakeWindow)).toBe(false);
    expect(createElement).not.toHaveBeenCalled();
  });

  test("uses WebGL when a supported context can be created", () => {
    const getContext = vi.fn((name: string) => (name === "webgl" ? {} : null));
    const fakeWindow = {
      document: {
        createElement: () => ({
          getContext,
        }),
      },
    };

    expect(canUseCstdWebgl(fakeWindow)).toBe(true);
    expect(getContext).toHaveBeenCalledWith("webgl2", { failIfMajorPerformanceCaveat: true });
    expect(getContext).toHaveBeenCalledWith("webgl", { failIfMajorPerformanceCaveat: true });
  });
});
