import { describe, expect, test } from "vitest";
import { CstdFrameBudgetController } from "./quality-controller";
import {
  cstdSceneManifest,
  getCstdSceneWindow,
} from "./scene-manifest";

describe("CSTD scene experience", () => {
  test("defines one continuous six-scene journey with camera continuity", () => {
    expect(cstdSceneManifest.map((scene) => scene.id)).toEqual([
      "hero",
      "systems",
      "proof",
      "operator",
      "path",
      "finale",
    ]);
    expect(new Set(cstdSceneManifest.map((scene) => scene.elementId)).size).toBe(6);

    for (let index = 0; index < cstdSceneManifest.length - 1; index += 1) {
      expect(cstdSceneManifest[index].camera.to).toEqual(cstdSceneManifest[index + 1].camera.from);
    }
  });

  test("keeps only the active and adjacent scene assets in the render window", () => {
    expect(getCstdSceneWindow("hero").map((scene) => scene.id)).toEqual(["hero", "systems"]);
    expect(getCstdSceneWindow("proof").map((scene) => scene.id)).toEqual(["systems", "proof", "operator"]);
    expect(getCstdSceneWindow("finale").map((scene) => scene.id)).toEqual(["path", "finale"]);
  });

  test("gives every scene a shareable anchor and a directed transition", () => {
    expect(cstdSceneManifest.every((scene) => scene.shareHref === `#${scene.elementId}`)).toBe(true);
    expect(new Set(cstdSceneManifest.map((scene) => scene.transition.aperture))).toEqual(new Set(["iris", "split", "shutter"]));
  });

  test("degrades only after two consecutive low-frame windows", () => {
    const controller = new CstdFrameBudgetController();
    for (let frame = 0; frame < 65; frame += 1) expect(controller.sample(1 / 60)).toBe(false);
    for (let frame = 0; frame < 31; frame += 1) expect(controller.sample(1 / 30)).toBe(false);

    let declined = false;
    for (let frame = 0; frame < 32; frame += 1) declined ||= controller.sample(1 / 30);
    expect(declined).toBe(true);
  });
});
