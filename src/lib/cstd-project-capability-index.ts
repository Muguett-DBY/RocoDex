import type { cstdProjects } from "./cstd-projects";

type CstdProject = (typeof cstdProjects)[number];

const capabilityLanes = [
  {
    id: "product-engineering",
    label: "产品工程",
    description: "从信息架构、数据模型到可上线前端，把想法做成可用产品。",
    projectIds: ["rocodex", "crm"],
  },
  {
    id: "ai-creation-research",
    label: "AI 创作与研究",
    description: "把生成式工作流、研究框架和素材管理串成可复用系统。",
    projectIds: ["design", "alpha"],
  },
  {
    id: "operations-systems",
    label: "运营系统",
    description: "围绕权限、流程、数据和验证，把业务动作沉淀成稳定工具。",
    projectIds: ["crm"],
  },
] as const;

export type CstdProjectCapabilityLane = {
  id: string;
  label: string;
  description: string;
  projectIds: string[];
  projects: CstdProject[];
};

export function getCstdProjectCapabilityIndex(projects: readonly CstdProject[]) {
  const liveProjects = projects.filter((project) => project.status === "Live");
  const lanes: CstdProjectCapabilityLane[] = capabilityLanes.map((lane) => {
    const laneProjects = lane.projectIds
      .map((projectId) => liveProjects.find((project) => project.id === projectId))
      .filter((project): project is CstdProject => Boolean(project));

    return {
      id: lane.id,
      label: lane.label,
      description: lane.description,
      projectIds: laneProjects.map((project) => project.id),
      projects: laneProjects,
    };
  });

  return {
    summary: `${lanes.length} 条能力线覆盖产品工程、AI 创作研究和运营系统`,
    lanes,
  };
}
