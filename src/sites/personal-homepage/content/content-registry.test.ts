import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { cstdCaseStudies } from "./case-studies";
import { cstdLabs } from "./labs";
import { cstdTechnicalNotes } from "./technical-notes";
import { cstdTopics } from "./topics";

function unique(values: readonly string[]) {
  return new Set(values).size === values.length;
}

function localeBodyLength(source: string, locale: "zh" | "en") {
  const match = source.match(new RegExp(`<LocaleBlock locale="${locale}">([\\s\\S]*?)</LocaleBlock>`));
  return match?.[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().length ?? 0;
}

describe("CSTD content registry", () => {
  test("keeps every public slug unique", () => {
    expect(unique(cstdCaseStudies.map((entry) => entry.slug))).toBe(true);
    expect(unique(cstdTechnicalNotes.map((entry) => entry.slug))).toBe(true);
    expect(unique(cstdLabs.map((entry) => entry.slug))).toBe(true);
    expect(unique(cstdTopics.map((entry) => entry.slug))).toBe(true);
  });

  test("keeps every curated topic grounded in cases, notes, and executable labs", () => {
    expect(cstdTopics).toHaveLength(5);
    for (const topic of cstdTopics) {
      expect(topic.caseSlugs.every((slug) => cstdCaseStudies.some((entry) => entry.slug === slug))).toBe(true);
      expect(topic.noteSlugs.every((slug) => cstdTechnicalNotes.some((entry) => entry.slug === slug))).toBe(true);
      expect(topic.labSlugs.every((slug) => cstdLabs.some((entry) => entry.slug === slug))).toBe(true);
    }
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

  test("keeps both published language blocks substantial enough to read", () => {
    for (const [directory, entries] of [["cases", cstdCaseStudies], ["notes", cstdTechnicalNotes]] as const) {
      for (const entry of entries) {
        const source = readFileSync(path.join(process.cwd(), "src", "sites", "personal-homepage", "content", "documents", directory, `${entry.slug}.mdx`), "utf8");
        expect(localeBodyLength(source, "zh")).toBeGreaterThan(280);
        expect(localeBodyLength(source, "en")).toBeGreaterThan(700);
      }
    }
  });

  test("offers five interactive laboratories including the proof museum", () => {
    expect(cstdLabs.map((entry) => entry.slug)).toEqual([
      "system-trace",
      "agent-replay",
      "data-lens",
      "render-lab",
      "proof-museum",
    ]);
    expect(new Set(cstdLabs.map((entry) => entry.renderer)).size).toBe(cstdLabs.length);
    expect(cstdLabs.every((entry) => /^\d+\.\d+\.\d+$/.test(entry.version))).toBe(true);
  });
});
