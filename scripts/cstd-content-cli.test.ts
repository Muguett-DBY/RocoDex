import { describe, expect, test } from "vitest";
import { assertCstdSlug, createCaseDraftTemplate, createNoteDraftTemplate, verifyCstdContent } from "./cstd-content-cli.mts";

describe("CSTD publishing CLI", () => {
  test("creates bilingual schema-shaped drafts without publishing them", () => {
    const caseDraft = createCaseDraftTemplate("decision-led-system", "2026-08-09");
    const noteDraft = createNoteDraftTemplate("versioned-boundaries", "2026-08-09");
    expect(caseDraft).toContain('publicationStatus: "draft"');
    expect(caseDraft.match(/<LocaleBlock locale=/g)).toHaveLength(2);
    expect(noteDraft).toContain('relatedCaseSlugs: ["rocodex-platform"]');
    expect(noteDraft.match(/<LocaleBlock locale=/g)).toHaveLength(2);
    expect(() => assertCstdSlug("Unsafe Slug")).toThrow(/Slug/);
  });

  test("verifies current proof, assets, links, and bilingual coverage", async () => {
    await expect(verifyCstdContent(new Date("2026-08-09T12:00:00Z"))).resolves.toMatchObject({
      cases: 7,
      notes: 8,
      status: "verified",
    });
  });
});
