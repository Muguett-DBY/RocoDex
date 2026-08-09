import { describe, expect, it } from "vitest";
import { cstdFailureDrillPhases, getFailureDrillProgress, getNextFailureDrillPhase } from "./failure-drill";

describe("failure drill state machine", () => {
  it("moves deterministically from injection to visible outcome", () => {
    expect(cstdFailureDrillPhases).toEqual(["idle", "trigger", "containment", "outcome"]);
    expect(getNextFailureDrillPhase("idle")).toBe("trigger");
    expect(getNextFailureDrillPhase("trigger")).toBe("containment");
    expect(getNextFailureDrillPhase("containment")).toBe("outcome");
    expect(getNextFailureDrillPhase("outcome")).toBe("outcome");
  });

  it("reports bounded progress for the documentary timeline", () => {
    expect(cstdFailureDrillPhases.map(getFailureDrillProgress)).toEqual([0, 1 / 3, 2 / 3, 1]);
  });
});
