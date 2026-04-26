import type { Creature } from "@/types/creature";
import type { GuideCreatureBuild } from "@/types/guide";
import { slugify } from "@/lib/pvp-query";

export type SeoLandingPage = {
  slug: string;
  href: string;
  title: string;
  description: string;
  selectCreatures: (creatures: Creature[], guides: GuideCreatureBuild[]) => Creature[];
};

export const seoLandingPages: SeoLandingPage[] = [
  {
    slug: "best-pvp",
    href: "/discover/best-pvp",
    title: "PVP 强势精灵",
    description: "按当前攻略数据整理 PVP 评级较高的精灵，适合快速查找对战培养目标。",
    selectCreatures: (creatures, guides) => selectByGuideTier(creatures, guides, "pvpTier"),
  },
  {
    slug: "best-pve",
    href: "/discover/best-pve",
    title: "PVE 推荐精灵",
    description: "按 PVE 评级和资料可信度整理适合推图、挑战和日常培养的精灵。",
    selectCreatures: (creatures, guides) => selectByGuideTier(creatures, guides, "pveTier"),
  },
  {
    slug: "catchable",
    href: "/discover/catchable",
    title: "可捕捉精灵",
    description: "集中查看当前资料中标记为可捕捉的精灵和获取线索。",
    selectCreatures: (creatures) => creatures.filter((creature) => creature.isCatchable === true),
  },
  {
    slug: "event-limited",
    href: "/discover/event-limited",
    title: "活动限定与可能绝版",
    description: "集中查看活动限定、可能绝版或状态仍待确认的精灵。",
    selectCreatures: (creatures) => creatures.filter((creature) => creature.isEventLimited === true || creature.availabilityStatus === "event-limited" || creature.availabilityStatus === "unavailable"),
  },
  {
    slug: "beginner",
    href: "/discover/beginner",
    title: "新手推荐查看",
    description: "优先展示可捕捉、资料较完整、容易规划养成路线的精灵。",
    selectCreatures: (creatures) =>
      creatures.filter((creature) => creature.isCatchable === true && !creature.evolutionMethods.includes("待确认")).slice(0, 12),
  },
];

export function getSeoLandingPage(slug: string) {
  return seoLandingPages.find((page) => page.slug === slug);
}

export function guideBuildSlug(build: GuideCreatureBuild) {
  return `${build.id}-${slugify(build.name)}`;
}

export function getGuideBuildBySlug(builds: GuideCreatureBuild[], slug: string) {
  return builds.find((build) => guideBuildSlug(build) === slug || build.id === slug);
}

function selectByGuideTier(creatures: Creature[], guides: GuideCreatureBuild[], key: "pveTier" | "pvpTier") {
  const strongNames = new Set(guides.filter((guide) => guide[key] === "S" || guide[key] === "A").map((guide) => guide.name));
  return creatures.filter((creature) => strongNames.has(creature.name));
}
