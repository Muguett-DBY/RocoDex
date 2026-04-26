import type { AvailabilityStatus, CreatureAttribute, CreatureFilters } from "@/types/creature";
import type { GuideConfidence, GuideFilters, GuideMode, GuideTier } from "@/types/guide";
import type { PvpArchetype, PvpStrength, SourceFreshness, SourceTier } from "@/types/pvp-team";

export type PvpFilters = {
  freshness: SourceFreshness | "all";
  sourceTier: SourceTier | "all";
  strength: PvpStrength | "all";
  archetype: PvpArchetype | "all";
};

export const defaultCreatureFilters: Required<CreatureFilters> = {
  query: "",
  attribute: "all",
  isCatchable: "all",
  isEventLimited: "all",
  availabilityStatus: "all",
  obtainMethod: "all",
  sort: "id-asc",
};

export const defaultGuideFilters: GuideFilters = {
  mode: "pvp",
  query: "",
  attribute: "all",
  role: "all",
  tier: "all",
  confidence: "all",
};

export const defaultPvpFilters: PvpFilters = {
  freshness: "current",
  sourceTier: "all",
  strength: "all",
  archetype: "all",
};

const creatureAttributes: CreatureAttribute[] = [
  "普通",
  "草",
  "火",
  "水",
  "光",
  "地",
  "冰",
  "龙",
  "电",
  "毒",
  "虫",
  "武",
  "翼",
  "萌",
  "幽",
  "恶",
  "机械",
  "幻",
];

const availabilityStatuses: AvailabilityStatus[] = ["available", "event-limited", "unavailable", "unknown"];
const triStateFilters: NonNullable<CreatureFilters["isCatchable"]>[] = ["all", "true", "false", "unknown"];
const creatureSorts: NonNullable<CreatureFilters["sort"]>[] = ["id-asc", "id-desc", "name-asc", "name-desc"];
const guideModes: GuideMode[] = ["pve", "pvp"];
const guideTiers: GuideTier[] = ["S", "A", "B", "C", "D", "未评级"];
const guideConfidences: GuideConfidence[] = ["confirmed", "partial", "analysis", "unknown"];
const sourceFreshnesses: SourceFreshness[] = ["current", "archived"];
const sourceTiers: SourceTier[] = ["official", "guide", "community", "needs-review"];
const pvpStrengths: PvpStrength[] = ["T0", "T1", "T2"];
const pvpArchetypes: PvpArchetype[] = ["全能", "冰控", "幽灵", "火攻", "毒伤", "星陨", "平衡", "虫队", "爆发", "冲段", "减能", "速攻"];

export function paramsFromSearchParams(searchParams: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value[0]) params.set(key, value[0]);
    } else if (value) {
      params.set(key, value);
    }
  });

  return params;
}

export function parseCreatureFilterParams(params: URLSearchParams): Required<CreatureFilters> {
  return {
    query: textParam(params, "q"),
    attribute: enumParam(params, "attribute", creatureAttributes, defaultCreatureFilters.attribute),
    isCatchable: enumParam(params, "catchable", triStateFilters, defaultCreatureFilters.isCatchable),
    isEventLimited: enumParam(params, "event", triStateFilters, defaultCreatureFilters.isEventLimited),
    availabilityStatus: enumParam(params, "availability", availabilityStatuses, defaultCreatureFilters.availabilityStatus),
    obtainMethod: textParam(params, "obtain") || defaultCreatureFilters.obtainMethod,
    sort: enumParam(params, "sort", creatureSorts, defaultCreatureFilters.sort),
  };
}

export function buildCreatureFilterParams(filters: CreatureFilters) {
  const params = new URLSearchParams();
  setText(params, "q", filters.query);
  setEnum(params, "attribute", filters.attribute, defaultCreatureFilters.attribute);
  setEnum(params, "catchable", filters.isCatchable, defaultCreatureFilters.isCatchable);
  setEnum(params, "event", filters.isEventLimited, defaultCreatureFilters.isEventLimited);
  setEnum(params, "availability", filters.availabilityStatus, defaultCreatureFilters.availabilityStatus);
  setEnum(params, "obtain", filters.obtainMethod, defaultCreatureFilters.obtainMethod);
  setEnum(params, "sort", filters.sort, defaultCreatureFilters.sort);
  return params;
}

export function parseGuideFilterParams(params: URLSearchParams): GuideFilters {
  return {
    mode: enumParam(params, "mode", guideModes, defaultGuideFilters.mode),
    query: textParam(params, "q"),
    attribute: enumParam(params, "attribute", creatureAttributes, "all"),
    role: textParam(params, "role") || "all",
    tier: enumParam(params, "tier", guideTiers, "all"),
    confidence: enumParam(params, "confidence", guideConfidences, "all"),
  };
}

export function buildGuideFilterParams(filters: GuideFilters) {
  const params = new URLSearchParams();
  setEnum(params, "mode", filters.mode, defaultGuideFilters.mode);
  setText(params, "q", filters.query);
  setEnum(params, "attribute", filters.attribute, defaultGuideFilters.attribute);
  setEnum(params, "role", filters.role, defaultGuideFilters.role);
  setEnum(params, "tier", filters.tier, defaultGuideFilters.tier);
  setEnum(params, "confidence", filters.confidence, defaultGuideFilters.confidence);
  return params;
}

export function parsePvpFilterParams(params: URLSearchParams): PvpFilters {
  return {
    freshness: enumParam(params, "freshness", sourceFreshnesses, defaultPvpFilters.freshness),
    sourceTier: enumParam(params, "sourceTier", sourceTiers, defaultPvpFilters.sourceTier),
    strength: enumParam(params, "strength", pvpStrengths, defaultPvpFilters.strength),
    archetype: enumParam(params, "archetype", pvpArchetypes, defaultPvpFilters.archetype),
  };
}

export function buildPvpFilterParams(filters: PvpFilters) {
  const params = new URLSearchParams();
  setEnum(params, "freshness", filters.freshness, defaultPvpFilters.freshness);
  setEnum(params, "sourceTier", filters.sourceTier, defaultPvpFilters.sourceTier);
  setEnum(params, "strength", filters.strength, defaultPvpFilters.strength);
  setEnum(params, "archetype", filters.archetype, defaultPvpFilters.archetype);
  return params;
}

function textParam(params: URLSearchParams, key: string) {
  return (params.get(key) ?? "").trim();
}

function enumParam<T extends string, F extends T | "all">(params: URLSearchParams, key: string, allowed: readonly T[], fallback: F): T | F {
  const value = params.get(key);
  if (value === "all" && fallback === "all") return "all" as F;
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function setText(params: URLSearchParams, key: string, value?: string) {
  const normalized = value?.trim();
  if (normalized) params.set(key, normalized);
}

function setEnum(params: URLSearchParams, key: string, value: string | undefined, defaultValue: string | undefined) {
  if (value && value !== defaultValue) params.set(key, value);
}
