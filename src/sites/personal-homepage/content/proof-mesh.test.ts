import { describe, expect, test } from "vitest";
import { cstdCaseStudies } from "./case-studies";
import { cstdProofMesh, cstdProofMeshManifest, getCstdProofFreshness } from "./proof-mesh";

describe("CSTD proof mesh", () => {
  test("publishes one build-time proof node for every case", () => {
    expect(cstdProofMesh.map((entry) => entry.caseSlug).sort()).toEqual(cstdCaseStudies.map((entry) => entry.slug).sort());
    expect(cstdProofMeshManifest.schemaVersion).toBe(2);
    expect(cstdProofMeshManifest.release).toBe("CSTD-17.0");
    expect(cstdProofMeshManifest.totals.artifacts).toBeGreaterThanOrEqual(20);
    expect(cstdProofMeshManifest.related.graph).toBe("https://custard.top/graph.json");
    expect(cstdProofMeshManifest.related.observatory).toBe("https://custard.top/observatory.json");
    expect(cstdProofMeshManifest.related.performance).toBe("https://custard.top/performance.json");
  });

  test("requires multi-lane evidence and bounded scores", () => {
    for (const entry of cstdProofMesh) {
      expect(entry.status).toBe("verified");
      expect(entry.artifactCount).toBeGreaterThanOrEqual(2);
      expect(entry.artifactKinds.length).toBeGreaterThanOrEqual(2);
      expect(entry.coverageScore).toBeGreaterThanOrEqual(64);
      expect(entry.coverageScore).toBeLessThanOrEqual(100);
    }
  });

  test("classifies proof age against an explicit clock", () => {
    const now = new Date("2026-08-09T12:00:00Z");
    expect(getCstdProofFreshness("2026-08-01", now)).toBe("current");
    expect(getCstdProofFreshness("2026-05-15", now)).toBe("aging");
    expect(getCstdProofFreshness("2025-01-01", now)).toBe("stale");
    expect(getCstdProofFreshness("invalid", now)).toBe("stale");
  });
});
