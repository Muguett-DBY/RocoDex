import { cstdProjects, type CstdProject } from "./cstd-projects";

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

export type CstdProjectComparisonBriefInput = {
  comparison: CstdProjectComparison;
  goalLabel: string;
  projectLabel: string;
  url: string | null;
};

export function normalizeCstdProjectComparisonIds(projectIds: readonly string[]) {
  const normalized: string[] = [];

  for (const projectId of projectIds) {
    if (normalized.includes(projectId)) continue;
    const project = cstdProjects.find((item) => item.id === projectId && item.status === "Live");
    if (!project) continue;

    normalized.push(project.id);
    if (normalized.length >= CSTD_PROJECT_COMPARISON_LIMIT) break;
  }

  return normalized;
}

export function getCstdProjectComparisonControl(selectedIds: readonly string[], projectId: string) {
  const normalizedIds = normalizeCstdProjectComparisonIds(selectedIds);
  const selected = normalizedIds.includes(projectId);
  const disabled = !selected && normalizedIds.length >= CSTD_PROJECT_COMPARISON_LIMIT;

  return {
    selected,
    disabled,
    label: selected ? "移出对比" : disabled ? "对比已满" : "加入对比",
  };
}

export function toggleCstdProjectComparison(selectedIds: readonly string[], projectId: string) {
  const normalizedIds = normalizeCstdProjectComparisonIds(selectedIds);

  if (normalizedIds.includes(projectId)) {
    return normalizedIds.filter((selectedId) => selectedId !== projectId);
  }

  if (normalizedIds.length >= CSTD_PROJECT_COMPARISON_LIMIT) {
    return normalizedIds;
  }

  return normalizeCstdProjectComparisonIds([...normalizedIds, projectId]);
}

export function getCstdProjectComparison(projects: readonly CstdProject[], selectedIds: readonly string[]): CstdProjectComparison {
  const liveProjects = normalizeCstdProjectComparisonIds(selectedIds)
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

export function buildCstdProjectComparisonBrief({
  comparison,
  goalLabel,
  projectLabel,
  url,
}: CstdProjectComparisonBriefInput) {
  const matrixLines = comparison.rows.flatMap((row) => [
    "",
    row.label,
    ...row.values.map((value, index) => {
      const project = comparison.projects[index];
      return `- ${project?.title ?? "待选择项目"}：${value}`;
    }),
  ]);

  return [
    "custard.top 项目对比摘要",
    goalLabel,
    projectLabel,
    `状态：${comparison.summary}`,
    ...(url ? [`链接：${url}`] : []),
    ...(!comparison.ready ? ["", "下一步：再选择 1 个已上线项目即可形成完整对比。"] : []),
    ...matrixLines,
  ].join("\n");
}
