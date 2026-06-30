import type { CstdProject } from "./cstd-projects";
import { cstdProjectFilters } from "./cstd-project-filter";

type CstdProjectId = CstdProject["id"];

export const cstdProjectGuideIds = ["game-data", "portrait-shooting", "company-research", "ai-creation", "park-operations"] as const;
export type CstdProjectGuideId = (typeof cstdProjectGuideIds)[number];

export type CstdProjectGuide = {
  id: CstdProjectGuideId;
  goal: string;
  reason: string;
  projectId: CstdProjectId;
};

export const cstdProjectGuides: readonly CstdProjectGuide[] = [
  {
    id: "game-data",
    goal: "查精灵资料与玩法工具",
    reason: "从搜索、对比、收藏到 PVP 阵容进入 RocoDex。",
    projectId: "rocodex",
  },
  {
    id: "portrait-shooting",
    goal: "预约南京写真或情侣约拍",
    reason: "从风格、套餐和预约路径进入奶黄包摄影。",
    projectId: "photography",
  },
  {
    id: "company-research",
    goal: "做公司研究与估值",
    reason: "用 CSTD Alpha 串起主体确认、评分、估值和报告。",
    projectId: "alpha",
  },
  {
    id: "ai-creation",
    goal: "整理 AI 创作素材",
    reason: "用私人工作台连接对话、图片、视频和素材库。",
    projectId: "design",
  },
  {
    id: "park-operations",
    goal: "管理招商线索与空间",
    reason: "用产业园区 CRM 处理线索、联系人、权限和资源。",
    projectId: "crm",
  },
];

export function getCstdProjectGuide(guideId: string | null) {
  if (!guideId) return null;
  return cstdProjectGuides.find((guide) => guide.id === guideId) ?? null;
}

export function getCstdProjectGuideSummary(guides: readonly CstdProjectGuide[], projects: readonly CstdProject[]) {
  const liveProjectIds = new Set(projects.filter((project) => project.status === "Live").map((project) => project.id));
  const matchedLiveProjectIds = new Set(guides.map((guide) => guide.projectId).filter((projectId) => liveProjectIds.has(projectId)));
  const uncoveredLiveProjectTitles = projects
    .filter((project) => project.status === "Live" && !matchedLiveProjectIds.has(project.id))
    .map((project) => project.title);

  return {
    allLiveProjectsCovered: uncoveredLiveProjectTitles.length === 0,
    goalCount: guides.length,
    label: `${guides.length} 条路径`,
    liveProjectCount: liveProjectIds.size,
    matchedLiveProjectCount: matchedLiveProjectIds.size,
    summary: `${guides.length} 条目标路径覆盖 ${matchedLiveProjectIds.size} / ${liveProjectIds.size} 个上线项目`,
    uncoveredLiveProjectTitles,
  };
}

export function getCstdProjectGuideDirectoryContinuation(
  guide: CstdProjectGuide | null,
  projects: readonly CstdProject[],
) {
  if (!guide) return null;

  const project = projects.find((item) => item.id === guide.projectId);
  if (!project) return null;

  const categoryLabel = cstdProjectFilters.find((filter) => filter.id === project.category)?.label;
  if (!categoryLabel) return null;

  const projectCount = projects.filter((item) => item.category === project.category).length;

  return {
    category: project.category,
    categoryLabel,
    projectCount,
    projectTitle: project.title,
    summary: projectCount > 1 ? `在 ${projectCount} 个${categoryLabel}项目中继续比较` : `在项目目录中查看${categoryLabel}`,
  };
}
