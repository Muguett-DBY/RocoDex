export type CstdProjectCategory = "data" | "creative" | "research" | "operations" | "incubating";
export type CstdProjectFilter = "all" | CstdProjectCategory;

export type CstdProjectFilterOption = {
  id: CstdProjectFilter;
  label: string;
};

type CstdFilterableProject = {
  category: CstdProjectCategory;
  description?: string;
  evidence?: {
    current: string;
    outcome: string;
    problem: string;
    role: string;
  };
  kicker?: string;
  metrics?: readonly (readonly [string, string])[];
  tags?: readonly string[];
  title?: string;
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
  query = "",
): readonly TProject[] {
  const normalizedQuery = normalizeProjectQuery(query);

  return projects.filter((project) => {
    if (filter !== "all" && project.category !== filter) return false;
    if (!normalizedQuery) return true;
    return getCstdProjectSearchText(project).includes(normalizedQuery);
  });
}

export function getCstdProjectFilterSummary<TProject extends CstdFilterableProject>(
  projects: readonly TProject[],
  filter: CstdProjectFilter,
  query = "",
): string {
  const visibleCount = filterCstdProjects(projects, filter, query).length;
  if (visibleCount === 0 && normalizeProjectQuery(query)) return "没有匹配项目，可清空搜索或切换分类";
  return `当前显示 ${visibleCount} / ${projects.length} 个项目`;
}

function getCstdProjectSearchText(project: CstdFilterableProject) {
  return normalizeProjectQuery(
    [
      project.title,
      project.kicker,
      project.description,
      ...(project.tags ?? []),
      ...(project.metrics ?? []).flatMap(([value, label]) => [value, label]),
      project.evidence?.role,
      project.evidence?.problem,
      project.evidence?.outcome,
      project.evidence?.current,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function normalizeProjectQuery(value: string) {
  return value.toLocaleLowerCase("zh-Hans-CN").replace(/\s+/g, "");
}
