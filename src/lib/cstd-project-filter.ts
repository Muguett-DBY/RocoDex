export type CstdProjectCategory = "data" | "creative" | "research" | "operations" | "incubating";
export type CstdProjectFilter = "all" | CstdProjectCategory;

export type CstdProjectFilterOption = {
  id: CstdProjectFilter;
  label: string;
};

type CstdFilterableProject = {
  category: CstdProjectCategory;
};

export const cstdProjectFilters: readonly CstdProjectFilterOption[] = [
  { id: "all", label: "全部" },
  { id: "data", label: "数据工具" },
  { id: "creative", label: "创作影像" },
  { id: "research", label: "研究分析" },
  { id: "operations", label: "运营系统" },
  { id: "incubating", label: "孵化中" },
] as const;

export function filterCstdProjects<TProject extends CstdFilterableProject>(
  projects: readonly TProject[],
  filter: CstdProjectFilter,
): readonly TProject[] {
  if (filter === "all") return projects;
  return projects.filter((project) => project.category === filter);
}

export function getCstdProjectFilterSummary<TProject extends CstdFilterableProject>(
  projects: readonly TProject[],
  filter: CstdProjectFilter,
): string {
  const visibleCount = filterCstdProjects(projects, filter).length;
  return `当前显示 ${visibleCount} / ${projects.length} 个项目`;
}
