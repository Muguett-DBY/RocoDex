import { describe, expect, it } from "vitest";
import { summarizeCollectionInsights } from "@/lib/collection-insights";
import type { Creature } from "@/types/creature";
import type { GuideCreatureBuild } from "@/types/guide";

const creature = (id: string, name: string, attributes: Creature["attributes"]): Creature =>
  ({
    id,
    name,
    attributes,
  }) as Creature;

const guide = (
  dexId: string,
  name: string,
  pvpTier: GuideCreatureBuild["pvpTier"],
  roles: string[],
  recommendedTeams: string[] = [],
): GuideCreatureBuild =>
  ({
    dexId,
    name,
    pvpTier,
    roles,
    recommendedTeams,
  }) as GuideCreatureBuild;

describe("collection insights", () => {
  it("summarizes valid saved creatures against guide coverage and next actions", () => {
    const insights = summarizeCollectionInsights(
      ["001", "005", "999"],
      [
        creature("001", "迪莫", ["光"]),
        creature("005", "火花", ["火"]),
        creature("008", "水蓝蓝", ["水"]),
      ],
      [
        guide("001", "迪莫", "A", ["输出", "辅助"], ["光系快攻"]),
        guide("005", "火花", "未评级", ["输出"]),
      ],
    );

    expect(insights).toMatchObject({
      savedCount: 3,
      validCount: 2,
      staleCount: 1,
      guideMatchedCount: 2,
      pvpRatedCount: 1,
      pvpUnratedCount: 1,
      recommendedTeamCount: 1,
      compareReady: true,
    });
    expect(insights.attributes).toEqual([
      { name: "光", count: 1 },
      { name: "火", count: 1 },
    ]);
    expect(insights.roles).toEqual([
      { name: "输出", count: 2 },
      { name: "辅助", count: 1 },
    ]);
    expect(insights.nextActions).toEqual(
      expect.arrayContaining([
        "已满足 2 只以上收藏，可直接进入对比确认面板差异。",
        "有 1 只收藏精灵暂无 PVP 评级，优先查看详情页来源和攻略缺口。",
      ]),
    );
  });
});
