import { describe, expect, test } from "vitest";
import { shouldApplyCstdMascotMoodChange } from "./cstd-mascot-mood";

describe("CSTD mascot mood transitions", () => {
  test("keeps click feedback visible while the happy window is active", () => {
    expect(
      shouldApplyCstdMascotMoodChange({
        nextMood: "working",
        now: 1_000,
        happyUntil: 1_500,
      }),
    ).toBe(false);
  });

  test("allows pointer mood changes outside the click feedback window", () => {
    expect(
      shouldApplyCstdMascotMoodChange({
        nextMood: "working",
        now: 1_600,
        happyUntil: 1_500,
      }),
    ).toBe(true);
    expect(
      shouldApplyCstdMascotMoodChange({
        nextMood: "curious",
        now: 1_000,
        happyUntil: 1_500,
      }),
    ).toBe(true);
  });
});
