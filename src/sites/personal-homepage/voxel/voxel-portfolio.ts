import { cstdCaseStudies, getCaseStudyPath } from "../content/case-studies";
import type { CstdLocale } from "../content/content-types";
import { cstdLabs } from "../content/labs";
import { cstdProfile } from "../content/profile";
import { cstdTechnicalNotes } from "../content/technical-notes";
import { voxelCaseStudyIds, type VoxelExhibitId } from "./voxel-landmarks";

export type VoxelPortfolioExhibit = Readonly<{
  id: VoxelExhibitId;
  kind: "work" | "notes" | "lab";
  title: string;
  kicker: string;
  summary: string;
  href: string;
  technologies: readonly string[];
  metrics: readonly Readonly<{ value: string; label: string }>[];
}>;

export type VoxelPortfolioData = Readonly<{
  exhibits: readonly VoxelPortfolioExhibit[];
  capabilities: readonly Readonly<{ label: string; value: string }>[];
}>;

export function getVoxelPortfolio(locale: CstdLocale): VoxelPortfolioData {
  const work = voxelCaseStudyIds.map((id): VoxelPortfolioExhibit => {
    const entry = cstdCaseStudies.find((candidate) => candidate.slug === id);
    if (!entry) throw new Error(`Missing voxel portfolio case study: ${id}`);
    return {
      id,
      kind: "work",
      title: entry.title[locale],
      kicker: entry.kicker[locale],
      summary: entry.summary[locale],
      href: getCaseStudyPath(entry, locale),
      technologies: entry.technologies.slice(0, 4),
      metrics: entry.metrics.slice(0, 2).map((metric) => ({ value: metric.value, label: metric.label[locale] })),
    };
  });

  const supporting: readonly VoxelPortfolioExhibit[] = locale === "zh" ? [
    {
      id: "notes-archive",
      kind: "notes",
      title: "技术札记档案库",
      kicker: "FIELD NOTES / 方法与复盘",
      summary: "把架构边界、数据工作、AI 研究与浏览器叙事写成可以反复查阅的方法档案。",
      href: "/notes",
      technologies: ["Architecture", "Data", "AI", "WebGL"],
      metrics: [{ value: String(cstdTechnicalNotes.length).padStart(2, "0"), label: "篇已发布札记" }],
    },
    {
      id: "lab-foundry",
      kind: "lab",
      title: "可执行实验锻造厂",
      kicker: "LIVE LABS / 可以动手验证",
      summary: "这里不只陈列结论。路由、并发、估值与渲染预算都能在浏览器里重新运行。",
      href: "/lab",
      technologies: ["React", "Workers", "Canvas", "Evidence"],
      metrics: [{ value: String(cstdLabs.length).padStart(2, "0"), label: "座交互实验" }],
    },
  ] : [
    {
      id: "notes-archive",
      kind: "notes",
      title: "Technical notes archive",
      kicker: "FIELD NOTES / METHODS AND POSTMORTEMS",
      summary: "A working archive of architecture boundaries, data practice, AI research, and browser-native storytelling.",
      href: "/en/notes",
      technologies: ["Architecture", "Data", "AI", "WebGL"],
      metrics: [{ value: String(cstdTechnicalNotes.length).padStart(2, "0"), label: "published notes" }],
    },
    {
      id: "lab-foundry",
      kind: "lab",
      title: "Executable lab foundry",
      kicker: "LIVE LABS / RUN THE EVIDENCE",
      summary: "The conclusions are not static: routing, concurrency, valuation, and render budgets can be run again in the browser.",
      href: "/en/lab",
      technologies: ["React", "Workers", "Canvas", "Evidence"],
      metrics: [{ value: String(cstdLabs.length).padStart(2, "0"), label: "interactive labs" }],
    },
  ];

  return {
    exhibits: [...work, ...supporting],
    capabilities: cstdProfile.capabilities.map((capability) => ({
      label: capability.label[locale],
      value: capability.value,
    })),
  };
}
