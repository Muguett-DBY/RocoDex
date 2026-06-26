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
