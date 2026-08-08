import { cstdCaseStudies, getCaseStudyPath } from "../content/case-studies";
import type { CstdLocale } from "../content/content-types";
import { cstdProfile } from "../content/profile";
import { cstdSystems } from "../content/systems";
import { cstdTimeline } from "../content/timeline";

export function serializeCstdResume(locale: CstdLocale) {
  return {
    schemaVersion: 1,
    locale,
    canonicalUrl: `https://custard.top${locale === "en" ? "/en/resume.json" : "/resume.json"}`,
    updatedAt: cstdProfile.now.updatedAt,
    person: {
      name: cstdProfile.name[locale],
      title: cstdProfile.title[locale],
      location: cstdProfile.location[locale],
      summary: cstdProfile.intro[locale],
    },
    capabilities: cstdSystems.map((system) => ({
      id: system.id,
      title: locale === "zh" ? system.title : system.district,
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
      date: entry.date,
      kind: entry.kind,
      title: entry.title[locale],
      evidence: entry.evidence[locale],
    })),
  };
}
