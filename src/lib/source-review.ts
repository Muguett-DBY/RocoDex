import type { Creature } from "@/types/creature";

type ReviewField = "捕捉地点" | "获得方式" | "进化方式" | "技能" | "图片";

export type SourceReviewItem = {
  creatureId: string;
  creatureName: string;
  field: ReviewField;
  priority: number;
  sourceUrl: string;
  reason: string;
  href: string;
};

export type RecentVerification = {
  creatureId: string;
  creatureName: string;
  updatedAt: string;
  verifiedFields: string[];
  href: string;
};

export function getSourceReviewItems(creatures: Creature[]): SourceReviewItem[] {
  return creatures
    .flatMap((creature) => {
      const sourceUrl = creature.sources.find((source) => source.kind === "creature-page")?.url ?? creature.sources[0]?.url ?? "";
      const items: SourceReviewItem[] = [];

      if (creature.skills.some((skill) => skill.name === "待确认" || skill.confidence === "unknown")) {
        items.push(reviewItem(creature, "技能", 100, sourceUrl, "技能会直接影响配队和培养决策，优先核验。"));
      }
      if (creature.captureLocations.includes("待确认")) {
        items.push(reviewItem(creature, "捕捉地点", 90, sourceUrl, "玩家需要知道在哪里遇到或捕捉。"));
      }
      if (creature.obtainMethods.includes("待确认")) {
        items.push(reviewItem(creature, "获得方式", 80, sourceUrl, "获得方式影响是否值得培养或等待活动。"));
      }
      if (creature.evolutionMethods.includes("待确认")) {
        items.push(reviewItem(creature, "进化方式", 70, sourceUrl, "进化路线影响养成规划。"));
      }
      if (creature.forms.some((form) => form.imageReviewStatus === "needs-review" || form.imageStatus === "placeholder")) {
        items.push(reviewItem(creature, "图片", 40, sourceUrl, "图片授权和长期使用方式仍需人工确认。"));
      }

      return items;
    })
    .sort((a, b) => b.priority - a.priority || a.creatureId.localeCompare(b.creatureId, "zh-Hans-CN", { numeric: true }));
}

export function getRecentlyVerifiedCreatures(creatures: Creature[], limit = 6): RecentVerification[] {
  return creatures
    .map((creature) => ({
      creatureId: creature.id,
      creatureName: creature.name,
      updatedAt: creature.updatedAt,
      verifiedFields: verifiedFieldsFor(creature),
      href: `/creatures/${creature.id}`,
    }))
    .filter((item) => item.verifiedFields.length > 0)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.creatureId.localeCompare(b.creatureId, "zh-Hans-CN", { numeric: true }))
    .slice(0, limit);
}

export function getUsefulMissingData(creatures: Creature[], limit = 8): SourceReviewItem[] {
  return getSourceReviewItems(creatures)
    .filter((item) => item.field !== "图片")
    .slice(0, limit);
}

function reviewItem(creature: Creature, field: ReviewField, priority: number, sourceUrl: string, reason: string): SourceReviewItem {
  return {
    creatureId: creature.id,
    creatureName: creature.name,
    field,
    priority,
    sourceUrl,
    reason,
    href: `/creatures/${creature.id}`,
  };
}

function verifiedFieldsFor(creature: Creature) {
  const fields: string[] = [];
  if (!creature.captureLocations.includes("待确认")) fields.push("捕捉地点");
  if (!creature.obtainMethods.includes("待确认")) fields.push("获得方式");
  if (!creature.evolutionMethods.includes("待确认")) fields.push("进化方式");
  if (creature.skills.some((skill) => skill.confidence === "confirmed" || skill.confidence === "partial")) fields.push("技能");
  if (creature.description && !creature.description.includes("待确认")) fields.push("简介");
  return fields;
}
