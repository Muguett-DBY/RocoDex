import { describe, expect, test } from "vitest";
import { createCstdStudioSnapshot } from "./studio-status";

describe("CSTD living studio snapshot", () => {
  test("derives five districts from published proof instead of hand-written status", () => {
    const snapshot = createCstdStudioSnapshot(new Date("2026-08-09T12:00:00Z"));

    expect(snapshot.release).toBe("CSTD-7.0");
    expect(snapshot.source).toBe("build-time-public-evidence");
    expect(snapshot.districts).toHaveLength(5);
    expect(snapshot.totals.projects).toBe(6);
    expect(snapshot.totals.artifacts).toBeGreaterThanOrEqual(20);
    expect(snapshot.districts.every((district) => district.evidenceCount > 0)).toBe(true);
    expect(snapshot.districts.every((district) => district.state === "online")).toBe(true);
  });

  test("marks evidence that needs a refresh without hiding the district", () => {
    const snapshot = createCstdStudioSnapshot(new Date("2027-08-09T12:00:00Z"));

    expect(snapshot.districts.some((district) => district.state === "refresh")).toBe(true);
    expect(snapshot.districts.every((district) => district.projectCount > 0)).toBe(true);
  });
});
