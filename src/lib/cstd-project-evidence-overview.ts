import type { cstdProjects } from "./cstd-projects";

type CstdProject = (typeof cstdProjects)[number];

export type CstdProjectEvidenceOverview = {
  stats: readonly {
    value: string;
    label: string;
  }[];
  summary: string;
};

export function getCstdProjectEvidenceOverview(projects: readonly CstdProject[]): CstdProjectEvidenceOverview {
  const liveProjects = projects.filter((project) => project.status === "Live");
  const completeEvidenceCount = liveProjects.filter((project) =>
    [project.evidence.role, project.evidence.problem, project.evidence.outcome, project.evidence.current].every((value) => value.trim().length > 0),
  ).length;
  const coreScenarioCount = new Set(liveProjects.map((project) => project.category)).size;

  return {
    stats: [
      { value: String(liveProjects.length), label: "已上线项目" },
      { value: String(completeEvidenceCount), label: "完整案例证据" },
      { value: String(coreScenarioCount), label: "核心使用场景" },
    ],
    summary: `${liveProjects.length} 个已上线项目都有角色、问题、交付和当前状态证据`,
  };
}
