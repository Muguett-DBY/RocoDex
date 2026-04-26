import type { CreatureAttribute } from "@/types/creature";

type AttributeChart = Partial<Record<CreatureAttribute, Partial<Record<CreatureAttribute, number>>>>;

const attributes: CreatureAttribute[] = ["普通", "草", "火", "水", "光", "地", "冰", "龙", "电", "毒", "虫", "武", "翼", "萌", "幽", "恶", "机械", "幻"];

const chart: AttributeChart = {
  火: { 草: 2, 冰: 2, 虫: 2, 机械: 2, 水: 0.5, 火: 0.5, 龙: 0.5 },
  水: { 火: 2, 地: 2, 水: 0.5, 草: 0.5, 龙: 0.5 },
  草: { 水: 2, 地: 2, 火: 0.5, 草: 0.5, 毒: 0.5, 虫: 0.5, 翼: 0.5, 龙: 0.5, 机械: 0.5 },
  电: { 水: 2, 翼: 2, 草: 0.5, 电: 0.5, 地: 0 },
  地: { 火: 2, 电: 2, 毒: 2, 机械: 2, 草: 0.5, 虫: 0.5, 翼: 0 },
  冰: { 草: 2, 地: 2, 翼: 2, 龙: 2, 火: 0.5, 水: 0.5, 冰: 0.5, 机械: 0.5 },
  武: { 普通: 2, 冰: 2, 恶: 2, 机械: 2, 毒: 0.5, 翼: 0.5, 萌: 0.5, 幽: 0 },
  毒: { 草: 2, 萌: 2, 毒: 0.5, 地: 0.5, 幽: 0.5, 机械: 0 },
  翼: { 草: 2, 虫: 2, 武: 2, 电: 0.5, 机械: 0.5 },
  虫: { 草: 2, 萌: 2, 恶: 2, 火: 0.5, 武: 0.5, 毒: 0.5, 翼: 0.5, 幽: 0.5, 机械: 0.5 },
  幽: { 幽: 2, 萌: 2, 恶: 0.5, 普通: 0 },
  龙: { 龙: 2, 机械: 0.5 },
  恶: { 幽: 2, 萌: 2, 武: 0.5, 恶: 0.5 },
  机械: { 冰: 2, 光: 2, 火: 0.5, 水: 0.5, 电: 0.5, 机械: 0.5 },
  光: { 恶: 2, 幽: 2, 光: 0.5 },
  萌: { 武: 2, 毒: 0.5, 机械: 0.5 },
};

export function getEffectiveness(attacker: CreatureAttribute, defender: CreatureAttribute) {
  return chart[attacker]?.[defender] ?? 1;
}

export function getAttributeMatchupProfile(defenderAttributes: CreatureAttribute[]) {
  return {
    strongInto: attributes.filter((target) => defenderAttributes.some((attribute) => getEffectiveness(attribute, target) > 1)),
    resistedBy: attributes.filter((target) => defenderAttributes.some((attribute) => getEffectiveness(attribute, target) < 1)),
    weakTo: attributes.filter((attacker) => combinedEffectiveness(attacker, defenderAttributes) > 1),
    resists: attributes.filter((attacker) => combinedEffectiveness(attacker, defenderAttributes) < 1),
  };
}

function combinedEffectiveness(attacker: CreatureAttribute, defenders: CreatureAttribute[]) {
  return defenders.reduce((total, defender) => total * getEffectiveness(attacker, defender), 1);
}

export const matchupAttributes = attributes;
