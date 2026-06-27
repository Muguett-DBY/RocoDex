import type { CstdProject } from "./cstd-projects";

export const CSTD_PROJECT_COMPARISON_LIMIT = 2;

export type CstdProjectComparison = {
  projects: CstdProject[];
  ready: boolean;
  rows: Array<{
    label: string;
    values: string[];
  }>;
  summary: string;
};

export function getCstdProjectComparisonControl(selectedIds: readonly string[], projectId: string) {
  const selected = selectedIds.includes(projectId);
  const disabled = !selected && selectedIds.length >= CSTD_PROJECT_COMPARISON_LIMIT;

  return {
    selected,
    disabled,
    label: selected ? "移出对比" : disabled ? "对比已满" : "加入对比",
  };
}

export function toggleCstdProjectComparison(selectedIds: readonly string[], projectId: string) {
  if (selectedIds.includes(projectId)) {
    return selectedIds.filter((selectedId) => selectedId !== projectId);
  }

  if (selectedIds.length >= CSTD_PROJECT_COMPARISON_LIMIT) {
    return [...selectedIds];
  }

  return [...selectedIds, projectId];
}

export function getCstdProjectComparison(projects: readonly CstdProject[], selectedIds: readonly string[]): CstdProjectComparison {
  const liveProjects = selectedIds
    .map((projectId) => projects.find((project) => project.id === projectId && project.status === "Live"))
    .filter((project): project is CstdProject => project !== undefined)
    .slice(0, CSTD_PROJECT_COMPARISON_LIMIT);

  return {
    projects: liveProjects,
    ready: liveProjects.length === CSTD_PROJECT_COMPARISON_LIMIT,
    summary: `已选择 ${liveProjects.length} / ${CSTD_PROJECT_COMPARISON_LIMIT} 个项目`,
    rows: [
      { label: "项目类型", values: liveProjects.map((project) => project.kicker) },
      { label: "当前状态", values: liveProjects.map((project) => project.evidence.current) },
      { label: "负责", values: liveProjects.map((project) => project.evidence.role) },
      { label: "已交付", values: liveProjects.map((project) => project.evidence.outcome) },
      { label: "技术标签", values: liveProjects.map((project) => project.tags.join(" · ")) },
    ],
  };
}
