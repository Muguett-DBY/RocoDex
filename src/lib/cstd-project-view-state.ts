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
export type CstdProjectViewHash = "projects" | "project-guide" | "project-focus" | "project-comparison";
export type CstdProjectRestoredReceipt = {
  label: string;
  detail: string;
};
export type CstdProjectDirectoryRestoredAction = {
  label: string;
  detail: string;
  kind: "focus" | "reset";
};
export type CstdProjectFocusRestoredAction = {
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

export function buildCstdProjectGuideShareHref(pathname: string, guideId: string | null) {
  const guide = getCstdProjectGuide(guideId);
  if (!guide) return null;

  return buildCstdProjectViewHref(
    pathname,
    {
      filter: "all",
      query: "",
      guideId: guide.id,
      projectId: null,
      compareProjectIds: [],
    },
    "projects",
  );
}

export function isCstdProjectGuideShareRestored(state: CstdProjectViewState) {
  return (
    state.filter === "all" &&
    state.query.trim().length === 0 &&
    state.guideId !== null &&
    state.projectId === null &&
    state.compareProjectIds.length === 0
  );
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

export function getCstdProjectDirectoryRestoredAction({
  firstProjectTitle,
  visibleProjectCount,
}: {
  firstProjectTitle: string | null;
  visibleProjectCount: number;
}): CstdProjectDirectoryRestoredAction {
  const title = firstProjectTitle?.trim();
  if (!title || visibleProjectCount <= 0) {
    return {
      label: "重置筛选",
      detail: "当前恢复视图没有匹配项目，可重置后继续浏览全部案例。",
      kind: "reset",
    };
  }

  if (visibleProjectCount === 1) {
    return {
      label: "查看匹配案例",
      detail: `${title} 是当前恢复视图的匹配项目，可直接打开案例证据。`,
      kind: "focus",
    };
  }

  return {
    label: "查看首个匹配案例",
    detail: `当前恢复视图有 ${visibleProjectCount} 个项目，先打开${title}查看证据。`,
    kind: "focus",
  };
}

export function getCstdProjectFocusRestoredAction(projectTitle: string): CstdProjectFocusRestoredAction | null {
  const title = projectTitle.trim();
  if (!title) return null;

  return {
    label: "复制案例摘要",
    detail: `可直接带走${title}的角色、问题与交付摘要。`,
  };
}
