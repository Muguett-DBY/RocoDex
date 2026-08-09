import { describe, expect, test } from "vitest";
import { selectCstdRuntimeTier, type CstdRuntimeProbe } from "./runtime-capabilities";

const capableProbe: CstdRuntimeProbe = {
  backend: "webgl2",
  webgpu: true,
  hardwareConcurrency: 12,
  deviceMemory: 16,
  dpr: 1.5,
  viewportPixels: 3_500_000,
  saveData: false,
  effectiveType: "4g",
  renderer: "NVIDIA GeForce",
  maximumTexture: 16_384,
};

describe("CSTD runtime tier selection", () => {
  test("keeps capable devices on the full renderer", () => {
    expect(selectCstdRuntimeTier(capableProbe)).toMatchObject({ tier: "full", reason: "full-capability", webgpu: true });
  });

  test("honors explicit data savings and constrained networks", () => {
    expect(selectCstdRuntimeTier({ ...capableProbe, saveData: true })).toMatchObject({ tier: "lite", reason: "data-saver" });
    expect(selectCstdRuntimeTier({ ...capableProbe, effectiveType: "2g" })).toMatchObject({ tier: "lite", reason: "constrained-network" });
  });

  test("balances dense displays on moderate hardware", () => {
    expect(selectCstdRuntimeTier({ ...capableProbe, hardwareConcurrency: 6, deviceMemory: 6, dpr: 2, viewportPixels: 8_000_000 }))
      .toMatchObject({ tier: "lite", reason: "dense-display" });
  });

  test("falls back to images without WebGL", () => {
    expect(selectCstdRuntimeTier({ ...capableProbe, backend: "image", renderer: "", maximumTexture: 0 }))
      .toMatchObject({ tier: "image", reason: "no-webgl" });
  });
});
