import type { CstdProjectGuide } from "./cstd-project-guide";
import type { CstdProject } from "./cstd-projects";

export type CstdProjectComparisonFitKind = "direct" | "reference" | "unscoped";

export type CstdProjectComparisonFitItem = {
  projectId: string;
  title: string;
  kind: CstdProjectComparisonFitKind;
  label: string;
  detail: string;
};

export type CstdProjectComparisonFit = {
  summary: string;
  items: CstdProjectComparisonFitItem[];
};

export function getCstdProjectComparisonFit(
  guide: CstdProjectGuide | null,
  projects: readonly CstdProject[],
): CstdProjectComparisonFit {
  if (!guide) {
    return {
      summary: "尚未选择目标路径，当前仅按项目证据横向对照",
      items: projects.map((project) => ({
        projectId: project.id,
        title: project.title,
        kind: "unscoped" as const,
        label: "待选目标",
        detail: "先选择目标路径，再判断该项目是否直接匹配。",
      })),
    };
  }

  const directProject = projects.find((project) => project.id === guide.projectId);

  return {
    summary: directProject
      ? `${guide.goal}：${directProject.title}是当前目标直达项目`
      : `${guide.goal}：当前对比未包含目标直达项目`,
    items: projects.map((project) =>
      project.id === guide.projectId
        ? {
            projectId: project.id,
            title: project.title,
            kind: "direct" as const,
            label: "目标直达",
            detail: guide.reason,
          }
        : {
            projectId: project.id,
            title: project.title,
            kind: "reference" as const,
            label: "横向参照",
            detail: `当前目标不直接指向该项目；保留用于对照${project.evidence.role}的交付证据。`,
          },
    ),
  };
}
