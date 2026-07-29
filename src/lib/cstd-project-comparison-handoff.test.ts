import { describe, expect, test } from "vitest";

import { getCstdProjectComparisonHandoff } from "./cstd-project-comparison-handoff";
import { cstdProjectGuides } from "./cstd-project-guide";
import { cstdProjects } from "./cstd-projects";

const gameDataGuide = cstdProjectGuides.find((guide) => guide.id === "game-data")!;
const rocodex = cstdProjects.find((project) => project.id === "rocodex")!;
const photography = cstdProjects.find((project) => project.id === "photography")!;

describe("getCstdProjectComparisonHandoff", () => {
  test("preserves the goal and horizontal reference when the direct case opens", () => {
    expect(
      getCstdProjectComparisonHandoff(gameDataGuide, rocodex, [rocodex, photography]),
    ).toEqual({
      eyebrow: "Decision handoff",
      label: "目标案例已就位",
      detail:
        "目标路径“查精灵资料与玩法工具”指向洛克图鉴 / RocoDex；保留与奶黄包摄影的横向对比。",
      actionLabel: "打开图鉴",
      href: "https://rocodex.custard.top",
    });
  });

  test("does not invent comparison provenance for unrelated or incomplete state", () => {
    expect(getCstdProjectComparisonHandoff(gameDataGuide, photography, [rocodex, photography])).toBeNull();
    expect(getCstdProjectComparisonHandoff(gameDataGuide, rocodex, [photography])).toBeNull();
    expect(getCstdProjectComparisonHandoff(null, rocodex, [rocodex, photography])).toBeNull();
  });
});
