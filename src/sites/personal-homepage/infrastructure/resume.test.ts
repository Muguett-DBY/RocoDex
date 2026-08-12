import { describe, expect, test } from "vitest";
import { serializeCstdResume } from "./resume";

describe("machine-readable CSTD resume", () => {
  test.each(["zh", "en"] as const)("publishes linked %s capability evidence", (locale) => {
    const resume = serializeCstdResume(locale);
    expect(resume.schemaVersion).toBe(1);
    expect(resume.capabilities).toHaveLength(5);
    expect(resume.capabilities.every((capability) => capability.evidence.length >= 2)).toBe(true);
    expect(resume.work.length).toBeGreaterThanOrEqual(6);
    expect(resume.timeline.length).toBeGreaterThanOrEqual(6);
    if (locale === "en") expect(resume.capabilities.every((capability) => !/[\p{Script=Han}]/u.test(capability.title))).toBe(true);
  });
});
