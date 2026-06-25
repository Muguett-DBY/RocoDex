import type { Creature } from "@/types/creature";
import type { GuideCreatureBuild, GuideTier } from "@/types/guide";
import { availabilityStatusLabel, confidenceLabel, triStateLabel } from "@/lib/display-labels";

export type CreatureComparisonRow = {
  id: string;
  name: string;
  href: string;
  attributes: string[];
  availability: string;
  catchable: string;
  pveTier: GuideTier;
  pvpTier: GuideTier;
  roles: string[];
  verifiedSkillCount: number;
  confidence: string;
  updatedAt: string;
};

export function compareCreatures(creatures: Creature[], guideBuilds: GuideCreatureBuild[], ids: string[]) {
  const uniqueIds = Array.from(new Set(ids)).slice(0, 4);
  const guideByName = new Map(guideBuilds.map((build) => [build.name, build]));

  return {
    creatures: uniqueIds
      .map((id) => creatures.find((creature) => creature.id === id))
      .filter((creature): creature is Creature => Boolean(creature))
      .map((creature) => {
        const guide = guideByName.get(creature.name);
        return {
          id: creature.id,
          name: creature.name,
          href: `/creatures/${creature.id}`,
          attributes: creature.attributes,
          availability: availabilityStatusLabel[creature.availabilityStatus],
          catchable: triStateLabel(creature.isCatchable),
          pveTier: guide?.pveTier ?? "未评级",
          pvpTier: guide?.pvpTier ?? "未评级",
          roles: guide?.roles ?? ["待复核"],
          verifiedSkillCount: creature.skills.filter((skill) => skill.confidence === "confirmed" || skill.confidence === "partial").length,
          confidence: confidenceLabel[creature.confidence],
          updatedAt: creature.updatedAt,
        } satisfies CreatureComparisonRow;
      }),
  };
}

export function parseComparisonIds(value: string | undefined, creatures: Creature[]) {
  if (!value) return [];

  const validIds = new Set(creatures.map((creature) => creature.id));
  const uniqueIds = Array.from(new Set(value.split(",").map((id) => id.trim()))).filter((id) => validIds.has(id)).slice(0, 4);

  return uniqueIds.length >= 2 ? uniqueIds : [];
}
