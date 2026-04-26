import type { Confidence, Creature, CreatureAttribute } from "@/types/creature";

export type SkillSearchFilters = {
  query?: string;
  attribute?: CreatureAttribute | "all";
  confidence?: Confidence | "all";
};

export type SkillSearchResult = {
  creatureId: string;
  creatureName: string;
  href: string;
  skillName: string;
  skillAttribute?: CreatureAttribute | "待确认";
  level?: string;
  confidence: Confidence;
  description: string;
};

const normalize = (value: string) => value.trim().toLocaleLowerCase("zh-Hans-CN");

export function searchCreatureSkills(creatures: Creature[], filters: SkillSearchFilters = {}): SkillSearchResult[] {
  const query = normalize(filters.query ?? "");

  return creatures
    .flatMap((creature) =>
      creature.skills.map((skill) => ({
        creatureId: creature.id,
        creatureName: creature.name,
        href: `/creatures/${creature.id}`,
        skillName: skill.name,
        skillAttribute: skill.attribute,
        level: skill.level,
        confidence: skill.confidence,
        description: skill.description ?? "待确认",
      })),
    )
    .filter((item) => {
      const searchable = normalize([item.creatureId, item.creatureName, item.skillName, item.description, item.skillAttribute ?? ""].join(" "));
      if (query && !searchable.includes(query)) return false;
      if (filters.attribute && filters.attribute !== "all" && item.skillAttribute !== filters.attribute) return false;
      if (filters.confidence && filters.confidence !== "all" && item.confidence !== filters.confidence) return false;
      return true;
    })
    .sort((a, b) => a.creatureId.localeCompare(b.creatureId, "zh-Hans-CN", { numeric: true }) || a.skillName.localeCompare(b.skillName, "zh-Hans-CN"));
}
