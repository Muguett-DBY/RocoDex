import { getCstdProjectEvidenceOverview } from "./cstd-project-evidence-overview";
import type { cstdProjects } from "./cstd-projects";

type CstdProject = (typeof cstdProjects)[number];

export function buildCstdProjectPortfolioBrief(projects: readonly CstdProject[]) {
  const liveProjects = projects.filter((project) => project.status === "Live");
  const overview = getCstdProjectEvidenceOverview(projects);
  const projectLines = liveProjects.map((project) =>
    [
      `${project.title}：${project.evidence.current}`,
      `  负责：${project.evidence.role}`,
      `  交付：${project.evidence.outcome}`,
      `  链接：${project.href}`,
    ].join("\n"),
  );

  return [
    "custard.top 项目组合",
    `已上线项目：${liveProjects.length}`,
    `完整案例证据：${overview.stats[1]?.value ?? "0"}`,
    overview.summary,
    "",
    ...projectLines,
  ].join("\n");
}
