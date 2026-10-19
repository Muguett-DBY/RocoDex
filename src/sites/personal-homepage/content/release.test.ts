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

});
