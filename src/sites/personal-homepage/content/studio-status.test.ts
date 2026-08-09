import { describe, expect, test } from "vitest";
import { createCstdStudioSnapshot } from "./studio-status";

describe("CSTD living studio snapshot", () => {
  test("derives five districts from published proof instead of hand-written status", () => {
    const snapshot = createCstdStudioSnapshot(new Date("2026-08-09T12:00:00Z"));

    expect(snapshot.release).toBe("CSTD-9.0");
    expect(snapshot.schemaVersion).toBe(3);
    expect(snapshot.source).toBe("build-time-public-evidence");
    expect(snapshot.provenance.contract).toBe("cstd.studio-snapshot/v3");
    expect(snapshot.provenance.digest).toMatch(/^fnv1a32:[a-f0-9]{8}$/);
    expect(snapshot.provenance.sources.map((source) => source.href)).toEqual(["/proof.json", "/graph.json", "/releases.json"]);
    expect(snapshot.districts).toHaveLength(5);
    expect(snapshot.totals.projects).toBe(6);
    expect(snapshot.totals.artifacts).toBeGreaterThanOrEqual(20);
    expect(snapshot.districts.every((district) => district.evidenceCount > 0)).toBe(true);
    expect(snapshot.districts.every((district) => district.state === "online")).toBe(true);
  });

  test("keeps the evidence digest stable across freshness checks", () => {
    expect(createCstdStudioSnapshot(new Date("2026-08-09T12:00:00Z")).provenance.digest)
      .toBe(createCstdStudioSnapshot(new Date("2027-08-09T12:00:00Z")).provenance.digest);
  });

  test("marks evidence that needs a refresh without hiding the district", () => {
    const snapshot = createCstdStudioSnapshot(new Date("2027-08-09T12:00:00Z"));

    expect(snapshot.districts.some((district) => district.state === "refresh")).toBe(true);
    expect(snapshot.districts.every((district) => district.projectCount > 0)).toBe(true);
  });
});
