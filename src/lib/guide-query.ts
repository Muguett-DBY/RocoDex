import type { CreatureAttribute } from "@/types/creature";
import type { GuideConfidence, GuideCreatureBuild, GuideFilters, GuideMode, GuideStats, GuideTier } from "@/types/guide";

export const guideTierOrder: GuideTier[] = ["S", "A", "B", "C", "D", "未评级"];

const confidenceOrder: GuideConfidence[] = ["confirmed", "partial", "analysis", "unknown"];

const normalize = (value: string) => value.trim().toLocaleLowerCase("zh-Hans-CN");

const tierForMode = (build: GuideCreatureBuild, mode: GuideMode) => (mode === "pvp" ? build.pvpTier : build.pveTier);

export function filterGuideBuilds(builds: GuideCreatureBuild[], filters: GuideFilters) {
  const query = normalize(filters.query ?? "");

  return builds.filter((build) => {
    const searchable = normalize(
      [
        build.dexId,
        build.name,
        build.formName ?? "",
        build.attributes.join(" "),
        build.roles.join(" "),
        build.scenes.join(" "),
        build.moves.values.join(" "),
        build.buildNotes.join(" "),
        build.reviewNotes.join(" "),
      ].join(" "),
    );

    if (query && !searchable.includes(query)) return false;
    if (filters.attribute && filters.attribute !== "all" && !build.attributes.includes(filters.attribute)) return false;
    if (filters.role && filters.role !== "all" && !build.roles.includes(filters.role)) return false;
    if (filters.tier && filters.tier !== "all" && tierForMode(build, filters.mode) !== filters.tier) return false;
    if (filters.confidence && filters.confidence !== "all" && build.confidence !== filters.confidence) return false;

    return true;
  });
}

export function groupGuideBuildsByTier(builds: GuideCreatureBuild[], mode: GuideMode) {
  const groups = guideTierOrder.reduce(
    (acc, tier) => {
      acc[tier] = [];
      return acc;
    },
    {} as Record<GuideTier, GuideCreatureBuild[]>,
  );

  builds.forEach((build) => {
    groups[tierForMode(build, mode)].push(build);
  });

  return groups;
}

export function getGuideStats(builds: GuideCreatureBuild[]): GuideStats {
  return {
    total: builds.length,
    byConfidence: confidenceOrder.reduce(
      (acc, confidence) => {
        acc[confidence] = builds.filter((build) => build.confidence === confidence).length;
        return acc;
      },
      {} as Record<GuideConfidence, number>,
    ),
    byMode: {
      pve: {
        rated: builds.filter((build) => build.pveTier !== "未评级").length,
        unrated: builds.filter((build) => build.pveTier === "未评级").length,
      },
      pvp: {
        rated: builds.filter((build) => build.pvpTier !== "未评级").length,
        unrated: builds.filter((build) => build.pvpTier === "未评级").length,
      },
    },
  };
}

export function getUniqueGuideAttributes(builds: GuideCreatureBuild[]) {
  const attributes = new Set<CreatureAttribute>();
  builds.forEach((build) => build.attributes.forEach((attribute) => attributes.add(attribute)));
  return Array.from(attributes).sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

export function getUniqueGuideRoles(builds: GuideCreatureBuild[]) {
  const roles = new Set<string>();
  builds.forEach((build) => build.roles.forEach((role) => roles.add(role)));
  return Array.from(roles).sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}
