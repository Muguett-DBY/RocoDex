import { describe, expect, test } from "vitest";
import { cstdTimeline, getCstdTimelineDateLabel, getCstdTimelineSortKey } from "./timeline";
import { cstdTimelineDetails } from "./timeline-details";
import { cstdTechnicalNotes } from "./technical-notes";
import { serializeCstdResume } from "../infrastructure/resume";

describe("public capability timeline", () => {
  test("covers the full chronology without inventing precise dates for study periods", () => {
    expect(cstdTimeline.length).toBeGreaterThanOrEqual(70);
    expect([...new Set(cstdTimeline.map((entry) => entry.date.slice(0, 4)))]).toEqual(["2020", "2021", "2022", "2023", "2024", "2025", "2026"]);
    const dates = cstdTimeline.map((entry) => getCstdTimelineSortKey(entry.date));
    expect(dates).toEqual([...dates].sort((left, right) => left.localeCompare(right)));
    for (const entry of cstdTimeline) {
      expect(entry.date).toMatch(entry.datePrecision === "half-year" ? /^\d{4}-H[12]$/ : entry.datePrecision === "month" ? /^\d{4}-(0[1-9]|1[0-2])$/ : /^\d{4}-\d{2}-\d{2}$/);
    }
    const early = cstdTimeline.find((entry) => entry.id === "chemistry-foundations")!;
    expect(getCstdTimelineDateLabel(early, "zh")).toBe("2020 下半年");
    expect(getCstdTimelineDateLabel(early, "en")).toBe("Second half of 2020");
    const activity = cstdTimeline.find((entry) => entry.id === "activity-data-checkpoint")!;
    expect(getCstdTimelineDateLabel(activity, "en")).toBe("September 2024");
  });

  test("gives every entry bilingual learning, practice and writing details", () => {
    expect(new Set(cstdTimeline.map((entry) => entry.id)).size).toBe(cstdTimeline.length);
    expect(Object.keys(cstdTimelineDetails).sort()).toEqual(cstdTimeline.map((entry) => entry.id).sort());
    for (const entry of cstdTimeline) {
      const detail = cstdTimelineDetails[entry.id];
      expect(entry.technologies.length).toBeGreaterThanOrEqual(4);
      expect(detail.outputs.length).toBeGreaterThan(0);
      for (const locale of ["zh", "en"] as const) {
        expect(detail.learning[locale].length).toBeGreaterThan(25);
        expect(detail.practice[locale].length).toBeGreaterThan(25);
        expect(detail.outputs.every((output) => output[locale].length > 8)).toBe(true);
      }
      expect(JSON.stringify([entry.title.en, entry.summary.en, detail.learning.en, detail.practice.en, detail.outputs.map((output) => output.en)])).not.toMatch(/\p{Script=Han}/u);
    }
  });

  test("keeps publication dates and research-plan status tied to the right kind of output", () => {
    for (const entry of cstdTimeline.filter((item) => item.recordType === "public-note")) {
      const note = cstdTechnicalNotes.find((item) => entry.evidence.zh === `/notes/${item.slug}`);
      expect(note, entry.id).toBeDefined();
      expect(entry.date).toBe(note!.publishedAt);
    }
    for (const id of ["agent-reliability-plan", "fact-checking-plan"]) {
      const entry = cstdTimeline.find((item) => item.id === id)!;
      expect(entry.recordType).toBe("research-plan");
      expect(cstdTimelineDetails[id].practice.en).toMatch(/preliminary|preparation/);
    }
    expect(cstdTimelineDetails["hireway-studio"].practice.en).toContain("team project");
  });

  test.each(["zh", "en"] as const)("publishes the detailed %s chronology without private identifiers or source files", (locale) => {
    const timeline = serializeCstdResume(locale).timeline;
    expect(timeline).toHaveLength(cstdTimeline.length);
    const privateMatch = JSON.stringify(timeline).match(/monash|莫纳什|usyd|university of sydney|悉尼大学|\b(?:FIT|CHEM|CHNG|ENGG|DATA|MAT|MGF|COMP)\d{4}\b|31378714|500519943|ysuu0054|yiping su|苏一平|(?:^|["\s])[A-Z]:[\\/]|\.docx|\.ipynb|@[^"\s]*\.edu/i);
    expect(privateMatch?.[0] ?? null).toBeNull();
    expect(timeline.every((entry) => entry.learning && entry.practice && entry.outputs.length)).toBe(true);
    expect(timeline.every((entry) => entry.datePrecision)).toBe(true);
  });
});
