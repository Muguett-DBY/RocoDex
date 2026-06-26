import { cstdProjects } from "./cstd-projects";

export type CstdProjectCopyResult = "copied" | "unsupported" | "failed";
type CstdProjectNavigationItem = {
  id: string;
  title: string;
};

type CstdProjectBriefSource = {
  title: string;
  href: string;
  evidence: {
    current: string;
    outcome: string;
    problem: string;
    role: string;
  };
};

type CstdProjectEvidenceSource = Pick<CstdProjectBriefSource, "evidence">;

export function parseCstdProjectFocus(search: string) {
  const projectId = new URLSearchParams(search).get("project");
  if (!projectId) return null;
  return cstdProjects.some((project) => project.id === projectId) ? projectId : null;
}

export function buildCstdProjectFocusHref(projectId: string, pathname: string) {
  const params = new URLSearchParams({ project: projectId });
  return `${pathname}?${params.toString()}#project-focus`;
}

export function buildCstdProjectDirectoryHref(pathname: string) {
  return `${pathname}#projects`;
}

export function getCstdProjectFocusNavigation<TProject extends CstdProjectNavigationItem>(
  projects: readonly TProject[],
  currentProjectId: string,
): { previous: TProject | null; next: TProject | null } {
  const currentIndex = projects.findIndex((project) => project.id === currentProjectId);
  if (currentIndex === -1) return { previous: null, next: null };

  return {
    previous: projects[currentIndex - 1] ?? null,
    next: projects[currentIndex + 1] ?? null,
  };
}

export function buildCstdProjectBrief(project: CstdProjectBriefSource) {
  return [
    project.title,
    `当前：${project.evidence.current}`,
    `负责：${project.evidence.role}`,
    `解决问题：${project.evidence.problem}`,
    `已交付：${project.evidence.outcome}`,
    `链接：${project.href}`,
  ].join("\n");
}

export function getCstdProjectEvidenceChecklist(project: CstdProjectEvidenceSource) {
  return [
    { label: "角色", value: project.evidence.role, complete: project.evidence.role.trim().length > 0 },
    { label: "问题", value: project.evidence.problem, complete: project.evidence.problem.trim().length > 0 },
    { label: "交付", value: project.evidence.outcome, complete: project.evidence.outcome.trim().length > 0 },
    { label: "现状", value: project.evidence.current, complete: project.evidence.current.trim().length > 0 },
  ] as const;
}

export function getCstdProjectEvidenceChecklistSummary(checklist: readonly { complete: boolean }[]) {
  const completeCount = checklist.filter((item) => item.complete).length;
  return `${completeCount} / ${checklist.length} 项证据完整`;
}

export async function copyCstdProjectLink(
  writeText: ((text: string) => Promise<void>) | undefined,
  url: string,
): Promise<CstdProjectCopyResult> {
  if (!writeText) return "unsupported";
  try {
    await writeText(url);
    return "copied";
  } catch {
    return "failed";
  }
}
