import type { CstdCaseStudy, CstdCaseFilmBeat, CstdCaseFilmPhase } from "./content-models";
import type { CstdLocale } from "./content-types";
import { getCaseStudyPath } from "./case-studies";
import { cstdProofMesh } from "./proof-mesh";

export type HomepageEvidencePhaseId = "problem" | "decision" | "system" | "verification";

export type HomepageEvidenceChain = Readonly<{
  id: string;
  title: string;
  kicker: string;
  summary: string;
  caseHref: string;
  liveHref?: string;
  coverageScore: number;
  artifactCount: number;
  verifiedAt: string;
  phases: readonly Readonly<{
    id: HomepageEvidencePhaseId;
    label: string;
    title: string;
    detail: string;
    signal: string;
  }>[];
}>;

const phaseLabels: Record<HomepageEvidencePhaseId, Record<CstdLocale, string>> = {
  problem: { zh: "问题", en: "Problem" },
  decision: { zh: "取舍", en: "Decision" },
  system: { zh: "系统", en: "System" },
  verification: { zh: "验证", en: "Verification" },
};

function findBeat(caseStudy: CstdCaseStudy, phases: readonly CstdCaseFilmPhase[]): CstdCaseFilmBeat | undefined {
  return phases.flatMap((phase) => caseStudy.film.beats.filter((beat) => beat.phase === phase)).at(0);
}

export function createHomepageEvidenceChains(caseStudies: readonly CstdCaseStudy[], locale: CstdLocale): readonly HomepageEvidenceChain[] {
  return caseStudies.map((caseStudy) => {
    const proof = cstdProofMesh.find((entry) => entry.caseSlug === caseStudy.slug);
    const phaseBeats = {
      problem: findBeat(caseStudy, ["problem", "constraint"]),
      decision: findBeat(caseStudy, ["decision", "constraint"]),
      system: findBeat(caseStudy, ["architecture", "decision"]),
      verification: findBeat(caseStudy, ["evidence", "outcome"]),
    } satisfies Record<HomepageEvidencePhaseId, CstdCaseFilmBeat | undefined>;

    return {
      id: caseStudy.projectId,
      title: caseStudy.title[locale],
      kicker: caseStudy.kicker[locale],
      summary: caseStudy.summary[locale],
      caseHref: getCaseStudyPath(caseStudy, locale),
      liveHref: caseStudy.liveHref,
      coverageScore: proof?.coverageScore ?? 0,
      artifactCount: proof?.artifactCount ?? 0,
      verifiedAt: proof?.verifiedAt ?? caseStudy.updatedAt,
      phases: (Object.keys(phaseBeats) as HomepageEvidencePhaseId[]).map((phaseId) => {
        const beat = phaseBeats[phaseId];
        return {
          id: phaseId,
          label: phaseLabels[phaseId][locale],
          title: beat?.title[locale] ?? caseStudy.title[locale],
          detail: beat?.detail[locale] ?? caseStudy.summary[locale],
          signal: beat?.signal[locale] ?? caseStudy.status[locale],
        };
      }),
    };
  });
}
