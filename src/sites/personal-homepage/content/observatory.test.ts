import { describe, expect, test } from "vitest";
import { createCstdEngineeringObservatory, createCstdHomepageObservatory } from "./observatory";

describe("CSTD engineering observatory", () => {
  test("links a production build to its commit and evidence contracts", () => {
    const snapshot = createCstdEngineeringObservatory({
      VERCEL_ENV: "production",
      VERCEL_GIT_COMMIT_SHA: "c024523abcdef0123456789abcdef0123456789",
      VERCEL_URL: "rocodex.example.vercel.app",
    }, new Date("2026-08-12T12:00:00Z"));

    expect(snapshot.release).toBe("CSTD-17.0");
    expect(snapshot.schemaVersion).toBe(2);
    expect(snapshot.deployment.environment).toBe("production");
    expect(snapshot.deployment.url).toBe("https://custard.top");
    expect(snapshot.deployment.shortCommit).toBe("c024523");
    expect(snapshot.deployment.sourceHref).toContain("/commit/c024523");
    expect(snapshot.verification).toHaveLength(4);
    expect(snapshot.verification.map(({ id, value, checkedAt }) => ({ id, value, checkedAt }))).toEqual([
      { id: "unit-tests", value: 245, checkedAt: "2026-08-12" },
      { id: "browser-tests", value: 31, checkedAt: "2026-08-12" },
      { id: "static-output", value: 830, checkedAt: "2026-08-12" },
      { id: "initial-js", value: 180_551, checkedAt: "2026-08-12" },
    ]);
    expect(snapshot.totals.contentHealth).toBe(100);
    expect(snapshot.provenance.contract).toBe("cstd.engineering-observatory/v2");
    expect(snapshot.performance.budgets.initialJavascriptBytes).toBe(200_000);
    expect(snapshot.performance.budgets.startupJavascriptBytes).toBe(800_000);
  });

  test("keeps local snapshots honest when no deployment metadata exists", () => {
    const snapshot = createCstdEngineeringObservatory({}, new Date("2026-08-12T12:00:00Z"));

    expect(snapshot.deployment.environment).toBe("local");
    expect(snapshot.deployment.buildLinked).toBe(false);
    expect(snapshot.deployment.shortCommit).toBe("LOCAL");
    expect(snapshot.freshness).toBe("current");
  });

  test("projects only homepage-visible observatory fields to the client", () => {
    const full = createCstdEngineeringObservatory({}, new Date("2026-08-12T12:00:00Z"));
    const homepage = createCstdHomepageObservatory(full);

    expect(homepage.verification[0].label).toBe("单元与契约测试");
    expect(homepage.content).toEqual({ score: 100, coverage: full.content.coverage });
    expect(homepage).not.toHaveProperty("totals");
    expect(homepage).not.toHaveProperty("provenance");
  });
});
