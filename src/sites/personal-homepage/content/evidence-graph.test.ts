import { describe, expect, test } from "vitest";
import { cstdCaseStudies } from "./case-studies";
import { cstdLabs } from "./labs";
import { cstdSystems } from "./systems";
import { cstdTechnicalNotes } from "./technical-notes";

const knownPaths = new Set([
  ...cstdCaseStudies.map((entry) => `/work/${entry.slug}`),
  ...cstdTechnicalNotes.map((entry) => `/notes/${entry.slug}`),
  ...cstdLabs.map((entry) => `/lab/${entry.slug}`),
]);

describe("CSTD evidence graph", () => {
  test("grounds every capability district in multiple real artifacts", () => {
    for (const system of cstdSystems) {
      expect(system.evidenceLinks.length).toBeGreaterThanOrEqual(2);
      expect(new Set(system.evidenceLinks.map((entry) => entry.kind)).size).toBeGreaterThanOrEqual(2);
      expect(system.evidenceLinks.every((entry) => knownPaths.has(entry.href))).toBe(true);
    }
  });

  test("gives every case a dated, linked proof ledger", () => {
    for (const entry of cstdCaseStudies) {
      expect(entry.artifacts.length).toBeGreaterThanOrEqual(2);
      expect(entry.artifacts.every((artifact) => /^2026-\d{2}-\d{2}$/.test(artifact.verifiedAt))).toBe(true);
      expect(entry.artifacts.every((artifact) => artifact.href.zh.startsWith("/") || artifact.href.zh.startsWith("https://"))).toBe(true);
    }
  });
});
