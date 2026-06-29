import { cstdProjects } from "./cstd-projects";

export type CstdProjectCopyResult = "copied" | "unsupported" | "failed";
export type CstdProjectBriefCopyPresentation = {
  actionLabel: string;
  message: string;
  tone: "success" | "warning";
  requiresManualCopy: boolean;
};

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
type CstdProjectLinkDirectorySource = {
  id: string;
  title: string;
  status: "Live" | "Next";
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

export function getCstdProjectBriefCopyPresentation(
  result: CstdProjectCopyResult | null,
): CstdProjectBriefCopyPresentation | null {
  if (!result) return null;

  if (result === "copied") {
    return {
      actionLabel: "摘要已复制",
      message: "案例摘要已复制，可继续打开线上项目。",
      tone: "success",
      requiresManualCopy: false,
    };
  }

  return {
    actionLabel: "重新复制摘要",
    message: result === "unsupported" ? "浏览器不支持自动复制，请在下方手动复制摘要。" : "摘要复制失败，请在下方手动复制后继续。",
    tone: "warning",
    requiresManualCopy: true,
  };
}

export function buildCstdProjectLinkDirectory(
  projects: readonly CstdProjectLinkDirectorySource[],
  origin: string,
  pathname: string,
) {
  const liveProjects = projects.filter((project) => project.status === "Live");
  const lines = liveProjects.map((project) => `${project.title}：${origin}${buildCstdProjectFocusHref(project.id, pathname)}`);
  return ["custard.top 项目深链目录", ...lines].join("\n");
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
