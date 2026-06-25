import type { Creature } from "@/types/creature";
import type { GuideCreatureBuild } from "@/types/guide";

type CoverageItem = {
  name: string;
  count: number;
};

export type CollectionInsights = {
  savedCount: number;
  validCount: number;
  staleCount: number;
  guideMatchedCount: number;
  pvpRatedCount: number;
  pvpUnratedCount: number;
  recommendedTeamCount: number;
  compareReady: boolean;
  attributes: CoverageItem[];
  roles: CoverageItem[];
  nextActions: string[];
};

export function summarizeCollectionInsights(
  ids: string[],
  creatures: Creature[],
  guideBuilds: GuideCreatureBuild[],
): CollectionInsights {
  const creatureById = new Map(creatures.map((creature) => [creature.id, creature]));
  const guideByDexId = new Map(guideBuilds.map((build) => [build.dexId, build]));
  const validCreatures = ids.flatMap((id) => {
    const creature = creatureById.get(id);
    return creature ? [creature] : [];
  });
  const matchedGuides = validCreatures.flatMap((creature) => {
    const guide = guideByDexId.get(creature.id);
    return guide ? [guide] : [];
  });
  const pvpRatedCount = matchedGuides.filter((guide) => guide.pvpTier !== "未评级").length;
  const pvpUnratedCount = matchedGuides.length - pvpRatedCount;
  const recommendedTeamCount = new Set(matchedGuides.flatMap((guide) => guide.recommendedTeams)).size;

  return {
    savedCount: ids.length,
    validCount: validCreatures.length,
    staleCount: ids.length - validCreatures.length,
    guideMatchedCount: matchedGuides.length,
    pvpRatedCount,
    pvpUnratedCount,
    recommendedTeamCount,
    compareReady: validCreatures.length >= 2,
    attributes: countCoverage(validCreatures.flatMap((creature) => creature.attributes)),
    roles: countCoverage(matchedGuides.flatMap((guide) => guide.roles)),
    nextActions: buildNextActions(validCreatures.length, pvpUnratedCount, recommendedTeamCount),
  };
}

function countCoverage(values: string[]): CoverageItem[] {
  const firstSeen = new Map<string, number>();
  const counts = new Map<string, number>();

  values.forEach((value, index) => {
    if (!firstSeen.has(value)) firstSeen.set(value, index);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || (firstSeen.get(a.name) ?? 0) - (firstSeen.get(b.name) ?? 0));
}

function buildNextActions(validCount: number, pvpUnratedCount: number, recommendedTeamCount: number) {
  const actions: string[] = [];

  if (validCount >= 2) {
    actions.push("已满足 2 只以上收藏，可直接进入对比确认面板差异。");
  } else {
    actions.push("继续收藏至少 2 只精灵后，可进入对比确认面板差异。");
  }

  if (pvpUnratedCount > 0) {
    actions.push(`有 ${pvpUnratedCount} 只收藏精灵暂无 PVP 评级，优先查看详情页来源和攻略缺口。`);
  }

  if (recommendedTeamCount > 0) {
    actions.push(`已关联 ${recommendedTeamCount} 个公开阵容，可从攻略页查看搭配来源。`);
  }

  return actions;
}
