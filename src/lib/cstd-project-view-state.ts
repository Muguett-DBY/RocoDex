import { cstdProjectFilters, type CstdProjectFilter } from "./cstd-project-filter";
import { getCstdProjectGuide, type CstdProjectGuideId } from "./cstd-project-guide";
import { normalizeCstdProjectComparisonIds } from "./cstd-project-comparison";
import { cstdProjects } from "./cstd-projects";

export type CstdProjectViewState = {
  filter: CstdProjectFilter;
  query: string;
  guideId: CstdProjectGuideId | null;
  projectId: string | null;
  compareProjectIds: string[];
};
export type CstdProjectViewHash = "projects" | "project-focus" | "project-comparison";
export type CstdProjectRestoredReceipt = {
  label: string;
  detail: string;
};

export function parseCstdProjectViewState(search: string): CstdProjectViewState {
  const params = new URLSearchParams(search);
  const category = params.get("category");
  const guide = getCstdProjectGuide(params.get("goal"));
  const projectId = params.get("project");
  const compareProjectIds = (params.get("compare") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  return {
    filter: cstdProjectFilters.some((option) => option.id === category) ? (category as CstdProjectFilter) : "all",
    query: (params.get("q") ?? "").trim(),
    guideId: guide?.id ?? null,
    projectId: cstdProjects.some((project) => project.id === projectId) ? projectId : null,
    compareProjectIds: normalizeCstdProjectComparisonIds(compareProjectIds),
  };
}

export function hasActiveCstdProjectViewState(search: string): boolean {
  const state = parseCstdProjectViewState(search);
  return (
    state.filter !== "all" ||
    state.query.length > 0 ||
    state.guideId !== null ||
    state.projectId !== null ||
    state.compareProjectIds.length > 0
  );
}

export function buildCstdProjectViewHref(
  pathname: string,
  state: CstdProjectViewState,
  hash: CstdProjectViewHash = "projects",
) {
  const params = new URLSearchParams();
  const query = state.query.trim();

  if (state.filter !== "all") params.set("category", state.filter);
  if (query) params.set("q", query);
  if (state.guideId) params.set("goal", state.guideId);
  if (state.projectId && cstdProjects.some((project) => project.id === state.projectId)) {
    params.set("project", state.projectId);
  }
  const compareProjectIds = normalizeCstdProjectComparisonIds(state.compareProjectIds);
  if (compareProjectIds.length > 0) params.set("compare", compareProjectIds.join(","));

  const search = params.toString();
  return `${pathname}${search ? `?${search}` : ""}#${hash}`;
}

export function getCstdProjectDirectoryRestoredReceipt({
  filter,
  query,
  visibleProjectCount,
}: {
  filter: CstdProjectFilter;
  query: string;
  visibleProjectCount: number;
}): CstdProjectRestoredReceipt | null {
  const trimmedQuery = query.trim();
  const restoredParts: string[] = [];
  const filterLabel = cstdProjectFilters.find((option) => option.id === filter)?.label ?? "全部";

  if (filter !== "all") restoredParts.push(`${filterLabel}分类`);
  if (trimmedQuery) restoredParts.push(`${trimmedQuery} 搜索`);
  if (restoredParts.length === 0) return null;

  return {
    label: "筛选视图已恢复",
    detail: `${restoredParts.join(" + ")}已从链接恢复，当前显示 ${visibleProjectCount} 个项目。`,
  };
}

export function getCstdProjectFocusRestoredReceipt(projectTitle: string): CstdProjectRestoredReceipt | null {
  const title = projectTitle.trim();
  if (!title) return null;

  return {
    label: "分享案例已恢复",
    detail: `${title}的案例焦点已从链接恢复，可直接查看角色、问题与交付证据。`,
  };
}
