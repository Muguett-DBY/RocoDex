import { describe, expect, test } from "vitest";
import { cstdCaseStudies } from "./case-studies";
import { cstdLabs } from "./labs";
import { cstdTechnicalNotes } from "./technical-notes";

function unique(values: readonly string[]) {
  return new Set(values).size === values.length;
}

describe("CSTD content registry", () => {
  test("keeps every public slug unique", () => {
    expect(unique(cstdCaseStudies.map((entry) => entry.slug))).toBe(true);
    expect(unique(cstdTechnicalNotes.map((entry) => entry.slug))).toBe(true);
    expect(unique(cstdLabs.map((entry) => entry.slug))).toBe(true);
  });

  test("ships deep, bilingual case studies with evidence", () => {
    expect(cstdCaseStudies.length).toBeGreaterThanOrEqual(6);
    for (const entry of cstdCaseStudies) {
      expect(entry.title.zh.length).toBeGreaterThan(2);
      expect(entry.title.en.length).toBeGreaterThan(2);
      expect(entry.sections.length).toBeGreaterThanOrEqual(3);
      expect(entry.evidence.length).toBeGreaterThanOrEqual(3);
      expect(entry.technologies.length).toBeGreaterThanOrEqual(4);
    }
  });

  test("publishes a substantial technical library grounded in related work", () => {
    expect(cstdTechnicalNotes.length).toBeGreaterThanOrEqual(8);
    for (const note of cstdTechnicalNotes) {
      expect(note.sections.length).toBeGreaterThanOrEqual(3);
      expect(note.relatedCaseSlugs.length).toBeGreaterThan(0);
      expect(note.relatedCaseSlugs.every((slug) => cstdCaseStudies.some((entry) => entry.slug === slug))).toBe(true);
    }
  });

  test("offers all four interactive laboratories", () => {
    expect(cstdLabs.map((entry) => entry.slug)).toEqual([
      "system-trace",
      "agent-replay",
      "data-lens",
      "render-lab",
    ]);
  });
});
