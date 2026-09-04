import { describe, expect, test } from "vitest";

import { cstdBrandSystem } from "./brand-system";
import { cstdContentHealth } from "./content-health";
import { cstdExperienceContract } from "./experience-contract";
import { cstdPerformanceContract } from "./performance-contract";
import { cstdProofMeshManifest } from "./proof-mesh";
import { CSTD_RELEASE } from "./release";
import { cstdReleaseLedger } from "./release-ledger";
import { cstdEngineeringObservatory } from "./observatory";
import { cstdStudioSnapshot } from "./studio-status";

describe("CSTD release identity", () => {
  test("every public contract reports the same release version", () => {
    expect(CSTD_RELEASE).toMatch(/^CSTD-\d+\.\d+$/);
    expect(cstdPerformanceContract.release).toBe(CSTD_RELEASE);
    expect(cstdContentHealth.release).toBe(CSTD_RELEASE);
    expect(cstdEngineeringObservatory.release).toBe(CSTD_RELEASE);
    expect(cstdStudioSnapshot.release).toBe(CSTD_RELEASE);
    expect(cstdBrandSystem.release).toBe(CSTD_RELEASE);
    expect(cstdExperienceContract.release).toBe(CSTD_RELEASE);
    expect(cstdProofMeshManifest.release).toBe(CSTD_RELEASE);
    expect(cstdReleaseLedger.release).toBe(CSTD_RELEASE);
  });

  test("RUM audit budget references resolve inside the shared budgets block", () => {
    for (const [metricName, config] of Object.entries(cstdPerformanceContract.rumAudit.metrics)) {
      for (const budgetKey of [config.desktopBudgetKey, config.mobileBudgetKey]) {
        const threshold = cstdPerformanceContract.budgets[budgetKey as keyof typeof cstdPerformanceContract.budgets];
        expect(threshold, `${metricName} references unknown budget ${budgetKey}`).toBeGreaterThan(0);
        expect(cstdPerformanceContract.rumAudit.bucketEdges[metricName as keyof typeof cstdPerformanceContract.rumAudit.bucketEdges]).toContain(threshold);
      }
    }
  });
});
