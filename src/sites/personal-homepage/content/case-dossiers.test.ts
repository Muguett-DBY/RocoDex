import { describe, expect, test } from "vitest";
import { cstdCaseDossiers, getCstdCaseDossier } from "./case-dossiers";

describe("CSTD flagship case dossiers", () => {
  test("covers the three flagship systems with architecture, tradeoffs, and failure containment", () => {
    expect(cstdCaseDossiers.map((entry) => entry.caseSlug)).toEqual([
      "rocodex-platform",
      "cfzzs-crm",
      "alpha-research-system",
    ]);
    for (const entry of cstdCaseDossiers) {
      expect(entry.architecture.length).toBeGreaterThanOrEqual(4);
      expect(entry.decisions.length).toBeGreaterThanOrEqual(2);
      expect(entry.failureModes.length).toBeGreaterThanOrEqual(2);
      const nodeIds = new Set(entry.architecture.map((node) => node.id));
      expect(entry.flows.every((flow) => nodeIds.has(flow.from) && nodeIds.has(flow.to))).toBe(true);
      expect(entry.decisions.every((decision) => decision.proofHref.zh.startsWith("/"))).toBe(true);
      expect(entry.failureModes.every((failure) => failure.proofHref.en.startsWith("/en/"))).toBe(true);
    }
  });

  test("does not invent dossiers for secondary work", () => {
    expect(getCstdCaseDossier("portrait-booking")).toBeUndefined();
  });
});
