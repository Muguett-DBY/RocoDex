import { cstdCaseStudies, getCaseStudyPath } from "../content/case-studies";
import type { CstdLocale } from "../content/content-types";
import { cstdProfile } from "../content/profile";
import { cstdSystems } from "../content/systems";
import { CSTD_TIMELINE_REVIEWED_AT, cstdTimeline } from "../content/timeline";
import { cstdTimelineDetails } from "../content/timeline-details";

export function serializeCstdResume(locale: CstdLocale) {
  return {
    schemaVersion: 2,
    locale,
    canonicalUrl: `https://custard.top${locale === "en" ? "/en/resume.json" : "/resume.json"}`,
    updatedAt: cstdProfile.now.updatedAt,
    person: {
      name: cstdProfile.name[locale],
      title: cstdProfile.title[locale],
      summary: cstdProfile.intro[locale],
    },
    education: cstdProfile.education.map((entry) => ({
      stage: entry.stage[locale],
      field: entry.field[locale],
      detail: entry.detail[locale],
    })),
    skills: [
      {
        group: { zh: "数据分析与建模", en: "Data analysis and modelling" },
        items: locale === "zh"
          ? ["R（data.table、ggplot2、可复现报告）", "Python（pandas、探索性分析）", "统计建模与回归", "SQL（关系建模、约束、查询）", "Tableau 与报表"]
          : ["R (data.table, ggplot2, reproducible reports)", "Python (pandas, exploratory analysis)", "Statistical modelling and regression", "SQL (relational modelling, constraints, queries)", "Tableau and reporting"],
      },
      {
        group: { zh: "数据系统与交付", en: "Data systems and delivery" },
        items: locale === "zh"
          ? ["Next.js / React / TypeScript", "Cloudflare Workers · D1 · R2 · Supabase", "FastAPI · Pydantic · 数据接口", "确定性计算与运行清单", "测试、CI/CD 与线上观测"]
          : ["Next.js / React / TypeScript", "Cloudflare Workers · D1 · R2 · Supabase", "FastAPI · Pydantic · data APIs", "Deterministic computation and run manifests", "Testing, CI/CD, and production observability"],
      },
    ],
    languages: locale === "zh"
      ? [{ name: "中文", level: "母语" }, { name: "英语", level: "专业工作水平" }]
      : [{ name: "Mandarin", level: "Native" }, { name: "English", level: "Full professional proficiency" }],
    capabilities: cstdSystems.map((system) => ({
      id: system.id,
      title: system.title[locale],
      stack: system.stack,
      evidence: system.evidenceLinks.map((entry) => locale === "en" ? `/en${entry.href}` : entry.href),
    })),
    work: cstdCaseStudies.map((entry) => ({
      slug: entry.slug,
      title: entry.title[locale],
      summary: entry.summary[locale],
      year: entry.year,
      url: `https://custard.top${getCaseStudyPath(entry, locale)}`,
      technologies: entry.technologies,
      verifiedAt: entry.updatedAt,
    })),
    timeline: cstdTimeline.map((entry) => ({
      id: entry.id,
      date: entry.date,
      datePrecision: entry.datePrecision,
      reviewedAt: CSTD_TIMELINE_REVIEWED_AT,
      kind: entry.kind,
      recordType: entry.recordType,
      title: entry.title[locale],
      summary: entry.summary[locale],
      technologies: entry.technologies,
      learning: cstdTimelineDetails[entry.id].learning[locale],
      practice: cstdTimelineDetails[entry.id].practice[locale],
      outputs: cstdTimelineDetails[entry.id].outputs.map((output) => output[locale]),
      evidence: entry.evidence[locale],
    })),
  };
}
