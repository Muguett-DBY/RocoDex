import { describe, expect, test } from "vitest";
import {
  CSTD_INTRO_SEEN_KEY,
  CSTD_MOTION_PREFERENCE_KEY,
  getCstdIntroControlLabel,
  getCstdPointerTilt,
  shouldPlayCstdIntroReplay,
  shouldPlayCstdIntro,
} from "./cstd-motion";

describe("CSTD motion preferences", () => {
  test("uses stable browser storage keys", () => {
    expect(CSTD_MOTION_PREFERENCE_KEY).toBe("cstd.motionPreference");
    expect(CSTD_INTRO_SEEN_KEY).toBe("cstd.introSeen");
  });

  test("plays the intro only when motion is allowed and the intro has not been seen", () => {
    expect(shouldPlayCstdIntro({ reducedMotion: false, motionPreference: null, introSeen: null })).toBe(true);
    expect(shouldPlayCstdIntro({ reducedMotion: false, motionPreference: "enabled", introSeen: null })).toBe(true);
    expect(shouldPlayCstdIntro({ reducedMotion: false, motionPreference: "enabled", introSeen: "true" })).toBe(false);
    expect(shouldPlayCstdIntro({ reducedMotion: false, motionPreference: "disabled", introSeen: null })).toBe(false);
    expect(shouldPlayCstdIntro({ reducedMotion: true, motionPreference: "enabled", introSeen: null })).toBe(false);
  });

  test("allows explicit replay even when automatic intro is skipped for reduced motion", () => {
    expect(shouldPlayCstdIntroReplay({ reducedMotion: true, motionPreference: "enabled" })).toBe(true);
    expect(shouldPlayCstdIntroReplay({ reducedMotion: false, motionPreference: "enabled" })).toBe(true);
    expect(shouldPlayCstdIntroReplay({ reducedMotion: false, motionPreference: "disabled" })).toBe(false);
  });

  test("labels the intro switch without exposing system motion jargon", () => {
    expect(getCstdIntroControlLabel("enabled")).toBe("开场动画：开");
    expect(getCstdIntroControlLabel(null)).toBe("开场动画：开");
    expect(getCstdIntroControlLabel("disabled")).toBe("开场动画：关");
  });

  test("converts cursor position into bounded mascot tilt values", () => {
    expect(
      getCstdPointerTilt({
        clientX: 200,
        clientY: 150,
        rectLeft: 100,
        rectTop: 100,
        rectWidth: 200,
        rectHeight: 100,
      }),
    ).toMatchObject({ x: 0, y: 0, rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 });

    expect(
      getCstdPointerTilt({
        clientX: 1000,
        clientY: -100,
        rectLeft: 100,
        rectTop: 100,
        rectWidth: 200,
        rectHeight: 100,
      }),
    ).toMatchObject({ x: 1, y: -1, rotateX: 8, rotateY: 10, glowX: 100, glowY: 0 });
  });
});
