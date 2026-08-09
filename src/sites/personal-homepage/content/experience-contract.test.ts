import { describe, expect, it } from "vitest";
import { cstdExperienceContract } from "./experience-contract";
import { cstdSceneIds } from "../experience/scene-manifest";
import { cstdPerformanceContract } from "./performance-contract";

describe("CSTD experience contract", () => {
  it("keeps the six-act experience aligned with the runtime scene order", () => {
    expect(cstdExperienceContract.acts.map((act) => act.id)).toEqual(cstdSceneIds);
    expect(new Set(cstdExperienceContract.acts.map((act) => act.promise)).size).toBe(6);
  });

  it("publishes strict visual and interaction budgets", () => {
    expect(cstdExperienceContract.release).toBe("CSTD-17.0");
    expect(cstdExperienceContract.runtime.initialJavaScriptBytes).toBeLessThanOrEqual(150_000);
    expect(cstdExperienceContract.runtime.sceneAssetBytes).toBeLessThanOrEqual(320_000);
    expect(cstdExperienceContract.runtime.inpMilliseconds).toBeLessThanOrEqual(150);
    expect(cstdExperienceContract.runtime.cls).toBeLessThanOrEqual(0.03);
    expect(cstdExperienceContract.runtime.progressiveOrder).toBe(cstdPerformanceContract.delivery.runtimeFallbackOrder);
    expect(cstdExperienceContract.runtime.initialJavaScriptBytes).toBe(cstdPerformanceContract.budgets.initialJavascriptBytes);
    expect(cstdExperienceContract.runtime.sceneAssetBytes).toBe(cstdPerformanceContract.budgets.sceneAssetBytes);
  });
});
