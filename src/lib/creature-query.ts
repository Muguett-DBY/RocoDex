import type { Creature, CreatureAttribute, CreatureFilters, DataGap } from "@/types/creature";

const normalize = (value: string) => value.trim().toLocaleLowerCase("zh-Hans-CN");

const tristateMatches = (value: Creature["isCatchable"], filter?: CreatureFilters["isCatchable"]) => {
  if (!filter || filter === "all") return true;
  if (filter === "unknown") return value === "unknown";
  return value === (filter === "true");
};

export function filterCreatures(creatures: Creature[], filters: CreatureFilters = {}) {
  const query = normalize(filters.query ?? "");

  const filtered = creatures.filter((creature) => {
    const searchable = normalize(
      [
        creature.id,
        creature.name,
        creature.attributes.join(" "),
        creature.forms.map((form) => form.name).join(" "),
        creature.captureLocations.join(" "),
        creature.obtainMethods.join(" "),
        creature.evolutionMethods.join(" "),
        creature.description,
      ].join(" "),
    );

    if (query && !searchable.includes(query)) return false;
    if (filters.attribute && filters.attribute !== "all" && !creature.attributes.includes(filters.attribute)) {
      return false;
    }
    if (!tristateMatches(creature.isCatchable, filters.isCatchable)) return false;
    if (!tristateMatches(creature.isEventLimited, filters.isEventLimited)) return false;
    if (
      filters.availabilityStatus &&
      filters.availabilityStatus !== "all" &&
      creature.availabilityStatus !== filters.availabilityStatus
    ) {
      return false;
    }
    if (
      filters.obtainMethod &&
      filters.obtainMethod !== "all" &&
      !creature.obtainMethods.some((method) => method === filters.obtainMethod)
    ) {
      return false;
    }

    return true;
  });

  return filtered.sort((a, b) => {
    switch (filters.sort ?? "id-asc") {
      case "id-desc":
        return b.id.localeCompare(a.id, "zh-Hans-CN", { numeric: true });
      case "name-asc":
        return a.name.localeCompare(b.name, "zh-Hans-CN");
      case "name-desc":
        return b.name.localeCompare(a.name, "zh-Hans-CN");
      case "id-asc":
      default:
        return a.id.localeCompare(b.id, "zh-Hans-CN", { numeric: true });
    }
  });
}

export function getCreatureById(creatures: Creature[], id: string) {
  return creatures.find((creature) => creature.id === id);
}

export function getUniqueAttributes(creatures: Creature[]) {
  const attributes = new Set<CreatureAttribute>();
  creatures.forEach((creature) => creature.attributes.forEach((attribute) => attributes.add(attribute)));
  return Array.from(attributes).sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

export function getUniqueObtainMethods(creatures: Creature[]) {
  const methods = new Set<string>();
  creatures.forEach((creature) => creature.obtainMethods.forEach((method) => methods.add(method)));
  return Array.from(methods).sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

export function getCreatureStats(creatures: Creature[]) {
  const gaps = getDataGaps(creatures);
  const byField = gaps.reduce<Record<string, number>>((acc, gap) => {
    acc[gap.field] = (acc[gap.field] ?? 0) + 1;
    return acc;
  }, {});

  return {
    total: creatures.length,
    byConfidence: {
      confirmed: creatures.filter((creature) => creature.confidence === "confirmed").length,
      partial: creatures.filter((creature) => creature.confidence === "partial").length,
      unknown: creatures.filter((creature) => creature.confidence === "unknown").length,
    },
    imagePlaceholders: creatures.flatMap((creature) => creature.forms).filter((form) => form.imageStatus === "placeholder").length,
    gapTotals: {
      image: gaps.filter((gap) => gap.category === "image").length,
      facts: gaps.filter((gap) => gap.category === "facts").length,
      byField,
    },
  };
}

export function getDataGaps(creatures: Creature[]): DataGap[] {
  const gaps: DataGap[] = [];

  creatures.forEach((creature) => {
    if (creature.forms.some((form) => form.imageStatus === "placeholder" || form.imageReviewStatus === "needs-review")) {
      gaps.push({
        creatureId: creature.id,
        creatureName: creature.name,
        category: "image",
        field: "图片",
        reason: "立绘来源已记录；本地缓存图片的授权和长期使用方式仍需人工确认。",
      });
    }
    if (creature.captureLocations.includes("待确认")) {
      gaps.push({
        creatureId: creature.id,
        creatureName: creature.name,
        category: "facts",
        field: "捕捉地点",
        reason: "尚未逐条核验单个精灵页面或游戏内资料。",
      });
    }
    if (creature.obtainMethods.includes("待确认")) {
      gaps.push({
        creatureId: creature.id,
        creatureName: creature.name,
        category: "facts",
        field: "获得方式",
        reason: "尚未逐条核验单个精灵页面或游戏内资料。",
      });
    }
    if (creature.evolutionMethods.includes("待确认")) {
      gaps.push({
        creatureId: creature.id,
        creatureName: creature.name,
        category: "facts",
        field: "进化方式",
        reason: "当前只确认形态阶段，未确认具体等级、材料或任务条件。",
      });
    }
    if (creature.skills.some((skill) => skill.name === "待确认" || skill.confidence === "unknown")) {
      gaps.push({
        creatureId: creature.id,
        creatureName: creature.name,
        category: "facts",
        field: "技能",
        reason: "技能列表未完成可靠来源核验。",
      });
    }
  });

  return gaps;
}
