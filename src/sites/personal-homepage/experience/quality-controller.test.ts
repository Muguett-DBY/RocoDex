import { describe, expect, test } from "vitest";
import { CstdFrameBudgetController } from "./quality-controller";

function sampleWindow(controller: CstdFrameBudgetController, fps: number) {
  let decision = null;
  for (let frame = 0; frame <= fps; frame += 1) decision = controller.sample(1 / fps) ?? decision;
  return decision;
}

describe("CSTD frame budget controller", () => {
  test("requires two consecutive low windows before balancing", () => {
    const controller = new CstdFrameBudgetController();
    expect(sampleWindow(controller, 30)).toBeNull();
    expect(sampleWindow(controller, 30)).toMatchObject({ action: "decline", fps: 30, lowWindows: 2 });
  });

  test("a healthy window clears the decline streak", () => {
    const controller = new CstdFrameBudgetController();
    expect(sampleWindow(controller, 30)).toBeNull();
    expect(sampleWindow(controller, 60)).toBeNull();
    expect(controller.snapshot().lowWindows).toBe(0);
    expect(sampleWindow(controller, 30)).toBeNull();
  });
});
