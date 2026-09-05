import { describe, expect, test } from "vitest";
import { createCstdContentHealth } from "./content-health";

describe("CSTD content health", () => {
  test("publishes complete bilingual and relationship coverage", () => {
    const snapshot = createCstdContentHealth(new Date("2026-08-09T12:00:00Z"));

    expect(snapshot.release).toBe("CSTD-17.0");
    expect(snapshot.provenance.contract).toBe("cstd.content-health/v1");
    expect(snapshot.provenance.digest).toMatch(/^fnv1a32:[a-f0-9]{8}$/);
    expect(snapshot.status).toBe("healthy");
    expect(snapshot.score).toBe(100);
    expect(snapshot.coverage).toEqual({ bilingualPercent: 100, topicPercent: 100, relationPercent: 100 });
    expect(snapshot.issues.brokenRelations).toEqual([]);
    expect(snapshot.issues.orphanedEntries).toEqual([]);
    expect(snapshot.totals.cases).toBe(7);
    expect(snapshot.totals.notes).toBe(8);
    expect(snapshot.totals.labs).toBe(5);
  });

  test("reports stale public artifacts without changing the source digest", () => {
    const current = createCstdContentHealth(new Date("2026-08-09T12:00:00Z"));
    const old = createCstdContentHealth(new Date("2027-08-09T12:00:00Z"));

    expect(old.issues.staleArtifacts.length).toBeGreaterThan(0);
    expect(old.status).toBe("attention");
    expect(old.provenance.digest).toBe(current.provenance.digest);
  });
});
