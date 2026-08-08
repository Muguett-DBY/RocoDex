import { readFileSync } from "node:fs";
import path from "node:path";
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
      expect(entry.toc.length).toBeGreaterThanOrEqual(3);
      expect(entry.evidence.length).toBeGreaterThanOrEqual(3);
      expect(entry.technologies.length).toBeGreaterThanOrEqual(4);
      expect(entry.artifacts.length).toBeGreaterThanOrEqual(2);
      expect(entry.capabilityIds.length).toBeGreaterThan(0);
      expect(entry.film.durationSeconds).toBeGreaterThanOrEqual(45);
      expect(entry.film.beats.length).toBeGreaterThanOrEqual(4);
      expect(unique(entry.film.beats.map((beat) => beat.id))).toBe(true);
      expect(entry.film.beats.every((beat) => beat.title.zh && beat.title.en && beat.signal.zh && beat.signal.en)).toBe(true);
    }
  });

  test("publishes a substantial technical library grounded in related work", () => {
    expect(cstdTechnicalNotes.length).toBeGreaterThanOrEqual(8);
    for (const note of cstdTechnicalNotes) {
      expect(note.toc.length).toBeGreaterThanOrEqual(3);
      expect(note.relatedCaseSlugs.length).toBeGreaterThan(0);
      expect(note.relatedCaseSlugs.every((slug) => cstdCaseStudies.some((entry) => entry.slug === slug))).toBe(true);
    }
  });

  test("keeps one bilingual MDX source document per case and note", () => {
    for (const [directory, entries] of [["cases", cstdCaseStudies], ["notes", cstdTechnicalNotes]] as const) {
      for (const entry of entries) {
        const source = readFileSync(path.join(process.cwd(), "src", "sites", "personal-homepage", "content", "documents", directory, `${entry.slug}.mdx`), "utf8");
        expect(source).toContain('<LocaleBlock locale="zh">');
        expect(source).toContain('<LocaleBlock locale="en">');
        expect(source).not.toMatch(/\b[a-zA-Z][a-zA-Z0-9]*=\{"/);
      }
    }
  });

  test("offers all four interactive laboratories", () => {
    expect(cstdLabs.map((entry) => entry.slug)).toEqual([
      "system-trace",
      "agent-replay",
      "data-lens",
      "render-lab",
    ]);
    expect(new Set(cstdLabs.map((entry) => entry.renderer)).size).toBe(cstdLabs.length);
    expect(cstdLabs.every((entry) => /^\d+\.\d+\.\d+$/.test(entry.version))).toBe(true);
  });
});
