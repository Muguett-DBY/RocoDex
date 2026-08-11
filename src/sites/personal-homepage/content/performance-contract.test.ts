import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { cstdPerformanceContract } from "./performance-contract";

describe("CSTD performance contract", () => {
  it("publishes the same hard budgets used by the experience runtime", () => {
    expect(cstdPerformanceContract.release).toBe("CSTD-17.0");
    expect(cstdPerformanceContract.budgets.initialJavascriptBytes).toBe(200_000);
    expect(cstdPerformanceContract.budgets.startupJavascriptBytes).toBe(800_000);
    expect(cstdPerformanceContract.budgets.sceneAssetBytes).toBe(320_000);
    expect(cstdPerformanceContract.delivery.runtimeFallbackOrder).toEqual(["webgpu", "webgl", "image"]);
    expect(cstdPerformanceContract.delivery.defaultRuntimeTier).toBe("image");
    expect(cstdPerformanceContract.delivery.enhancedRuntimeTrigger).toBe("explicit-user-action");
    expect(cstdPerformanceContract.invariants).toContain("homepage-gpu-runtime-requires-explicit-opt-in");
    expect(cstdPerformanceContract.invariants).toContain("all-eager-homepage-js-is-budgeted-from-prerendered-html");
  });

  it("records the Cache Components decision instead of enabling it across incompatible static contracts", () => {
    const nextConfig = readFileSync(new URL("../../../../next.config.ts", import.meta.url), "utf8");
    expect(cstdPerformanceContract.cacheComponents.status).toBe("evaluated-not-enabled");
    expect(nextConfig).not.toContain("cacheComponents:");
  });
});
