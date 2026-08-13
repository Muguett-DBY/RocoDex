import { describe, expect, it } from "vitest";
import { consumeCstdTelemetryQuota, parseCstdMetric } from "./telemetry";

const baseMetric = { value: 1, page: "work-rocodex-platform", path: "/work/rocodex-platform", device: "desktop", renderTier: "full" } as const;

describe("bounded anonymous CSTD telemetry", () => {
  it("accepts only the new release's named experience signals", () => {
    for (const name of [
      "case_act_share",
      "case_failure_drill",
      "lab_conflict",
      "route_transition",
      "reading_quiet",
      "theme_neon-district",
      "theme_ink-protocol",
      "theme_press-room",
      "theme_pixel-quest",
    ]) {
      expect(parseCstdMetric({ ...baseMetric, name })?.name).toBe(name);
    }
    expect(parseCstdMetric({ ...baseMetric, name: "free_form_user_payload" })).toBeNull();
  });

  it("keeps per-identity ingestion bounded", () => {
    expect(consumeCstdTelemetryQuota("test-release-17", 1_000, 1).allowed).toBe(true);
    expect(consumeCstdTelemetryQuota("test-release-17", 1_100, 1).allowed).toBe(false);
  });
});
