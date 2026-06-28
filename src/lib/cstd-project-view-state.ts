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

export function buildCstdProjectViewHref(
  pathname: string,
  state: CstdProjectViewState,
  hash: "projects" | "project-focus" = "projects",
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
