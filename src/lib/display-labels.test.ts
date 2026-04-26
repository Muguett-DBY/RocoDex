import { describe, expect, it } from "vitest";
import { availabilityStatusLabel, confidenceLabel, triStateLabel } from "@/lib/display-labels";

describe("display labels", () => {
  it("translates player-facing status labels", () => {
    expect(availabilityStatusLabel.available).toBe("可获得");
    expect(availabilityStatusLabel["event-limited"]).toBe("活动限定");
    expect(availabilityStatusLabel.unavailable).toBe("可能绝版");
    expect(availabilityStatusLabel.unknown).toBe("待确认");
    expect(confidenceLabel.partial).toBe("部分确认");
    expect(triStateLabel(false)).toBe("否");
  });
});
