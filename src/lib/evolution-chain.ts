import type { Creature } from "@/types/creature";

export type EvolutionStep = {
  id: string;
  name: string;
  stage: string;
  href: string;
};

export function buildEvolutionChain(creatures: Creature[], creatureId: string): EvolutionStep[] {
  const creature = creatures.find((item) => item.id === creatureId);
  if (!creature) return [];

  const relatedNames = new Set<string>([creature.name]);
  const text = [creature.name, ...creature.evolutionMethods].join(" ");

  creatures.forEach((candidate) => {
    if (candidate.id === creature.id || text.includes(candidate.name)) relatedNames.add(candidate.name);
  });

  // Include direct neighbors that mention any known name, so selecting a middle
  // evolution still returns the complete local chain when the seed data has it.
  let changed = true;
  while (changed) {
    changed = false;
    creatures.forEach((candidate) => {
      const candidateText = [candidate.name, ...candidate.evolutionMethods].join(" ");
      if (Array.from(relatedNames).some((name) => candidateText.includes(name)) && !relatedNames.has(candidate.name)) {
        relatedNames.add(candidate.name);
        changed = true;
      }
    });
  }

  return creatures
    .filter((candidate) => relatedNames.has(candidate.name))
    .sort((a, b) => a.id.localeCompare(b.id, "zh-Hans-CN", { numeric: true }))
    .map((item) => ({
      id: item.id,
      name: item.name,
      stage: item.forms[0]?.stage ?? "待确认",
      href: `/creatures/${item.id}`,
    }));
}
