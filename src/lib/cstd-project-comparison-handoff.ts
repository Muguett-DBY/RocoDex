import type { CstdProjectGuide } from "./cstd-project-guide";
import type { CstdProject } from "./cstd-projects";

export type CstdProjectComparisonHandoff = {
  eyebrow: "Decision handoff";
  label: "目标案例已就位";
  detail: string;
  actionLabel: string;
  href: string;
};

export function getCstdProjectComparisonHandoff(
  guide: CstdProjectGuide | null,
  project: CstdProject | null,
  comparedProjects: readonly CstdProject[],
): CstdProjectComparisonHandoff | null {
  if (!guide || !project || guide.projectId !== project.id) return null;
  if (!comparedProjects.some((comparedProject) => comparedProject.id === project.id)) return null;

  const referenceLabel = comparedProjects
    .filter((comparedProject) => comparedProject.id !== project.id)
    .map((comparedProject) => comparedProject.title)
    .join("、");
  const detail = referenceLabel
    ? `目标路径“${guide.goal}”指向${project.title}；保留与${referenceLabel}的横向对比。`
    : `目标路径“${guide.goal}”指向${project.title}，对比上下文已保留。`;

  return {
    eyebrow: "Decision handoff",
    label: "目标案例已就位",
    detail,
    actionLabel: project.action,
    href: project.href,
  };
}
