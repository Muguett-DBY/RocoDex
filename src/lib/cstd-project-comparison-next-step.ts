import { CSTD_PROJECT_COMPARISON_LIMIT } from "./cstd-project-comparison";
import type { CstdProject } from "./cstd-projects";

type CstdProjectComparisonGuideTarget = {
  goal: string;
  reason: string;
  projectId: string;
};

type CstdProjectComparisonNextStepProject = Pick<CstdProject, "id" | "title" | "href" | "action">;

export type CstdProjectComparisonNextStep =
  | {
      kind: "focus";
      eyebrow: "Decision next";
      title: string;
      detail: string;
      primaryLabel: "查看目标直达案例";
      secondaryLabel: string;
      project: CstdProjectComparisonNextStepProject;
    }
  | {
      kind: "align";
      eyebrow: "Decision next";
      title: string;
      detail: string;
      primaryLabel: "补入目标直达项目";
      project: CstdProjectComparisonNextStepProject;
    }
  | {
      kind: "select-goal";
      eyebrow: "Decision next";
      title: string;
      detail: string;
      primaryLabel: "选择目标路径" | "重新选择目标路径";
      project: null;
    };

export function getCstdProjectComparisonNextStep(
  guide: CstdProjectComparisonGuideTarget | null,
  projects: readonly CstdProject[],
  selectedProjects: readonly CstdProject[],
): CstdProjectComparisonNextStep {
  if (!guide) {
    return {
      kind: "select-goal",
      eyebrow: "Decision next",
      title: "先选择目标路径",
      detail: "选择目标后，这里会给出直达案例和线上项目入口。",
      primaryLabel: "选择目标路径",
      project: null,
    };
  }

  const target = projects.find((project) => project.id === guide.projectId);

  if (!target) {
    return {
      kind: "select-goal",
      eyebrow: "Decision next",
      title: "目标项目暂不可用",
      detail: "当前目标未关联到可用项目，请重新选择目标路径。",
      primaryLabel: "重新选择目标路径",
      project: null,
    };
  }

  const project = {
    id: target.id,
    title: target.title,
    href: target.href,
    action: target.action,
  };

  if (!selectedProjects.some((selectedProject) => selectedProject.id === target.id)) {
    return {
      kind: "align",
      eyebrow: "Decision next",
      title: `对比缺少${target.title}`,
      detail: `补入目标直达项目，并保留一个现有项目作为横向参照。`,
      primaryLabel: "补入目标直达项目",
      project,
    };
  }

  return {
    kind: "focus",
    eyebrow: "Decision next",
    title: `优先查看${target.title}`,
    detail: guide.reason,
    primaryLabel: "查看目标直达案例",
    secondaryLabel: target.action,
    project,
  };
}

export function alignCstdProjectComparisonIds(selectedIds: readonly string[], targetProjectId: string) {
  return [targetProjectId, ...selectedIds.filter((projectId) => projectId !== targetProjectId)].slice(
    0,
    CSTD_PROJECT_COMPARISON_LIMIT,
  );
}
