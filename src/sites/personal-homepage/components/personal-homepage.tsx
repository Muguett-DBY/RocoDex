import type { CstdHomepageObservatory } from "../content/observatory";
import type { CstdNarrativeMode } from "../content/narratives";
import type { CstdLocale } from "../content/content-types";
import { cstdCaseStudies, getCaseStudyPath } from "../content/case-studies";
import { cstdProfile } from "../content/profile";
import { cstdTechnicalNotes, getTechnicalNotePath } from "../content/technical-notes";
import {
  CstdEditorialHomepage,
  type EditorialNote,
  type EditorialWork,
} from "./editorial/cstd-editorial-homepage";
import { NeuralGate } from "../scenes/neural-gate/neural-gate";
import { HomepageRuntime } from "./homepage-runtime";
import { ExecutableEvidence } from "./sections/executable-evidence";
import { Finale } from "./sections/finale";
import { KnowledgeLens } from "./sections/knowledge-lens";
import { LivingStudioTwin } from "./sections/living-studio-twin";
import { SelectedWork } from "./sections/selected-work";
import { ThemeSignatureExperience } from "./theme-signature-experience";

const EDITORIAL_WORK_SLUGS = ["melbourne-pedestrian-microclimate", "rocodex-platform", "alpha-research-system"] as const;

/* 内容在服务端准备好再传给客户端滚动组件，内容注册表不进客户端包。 */
function editorialData(locale: CstdLocale) {
  const works: EditorialWork[] = EDITORIAL_WORK_SLUGS.map((slug, index) => {
    const entry = cstdCaseStudies.find((candidate) => candidate.slug === slug);
    if (!entry) return null;
    return {
      slug: entry.slug,
      kicker: entry.kicker[locale],
      title: entry.title[locale],
      year: entry.year,
      summary: entry.summary[locale],
      technologies: entry.technologies,
      path: getCaseStudyPath(entry, locale),
      featured: index === 0,
    };
  }).filter((entry): entry is EditorialWork => Boolean(entry));
  const notes: EditorialNote[] = [...cstdTechnicalNotes]
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt))
    .slice(0, 3)
    .map((note) => ({
      slug: note.slug,
      title: note.title[locale],
      summary: note.summary[locale],
      dateLabel: note.publishedAt.slice(0, 7).replace("-", " / "),
      publishedAt: note.publishedAt,
      path: getTechnicalNotePath(note, locale),
    }));
  return {
    profile: { name: cstdProfile.name[locale], summary: cstdProfile.summary[locale] },
    works,
    notes,
    /* 普查计数走内容注册表，组件不硬编码：当前 7 个已发布案例 */
    census: { cases: cstdCaseStudies.length },
  };
}

export function PersonalHomepage({
  initialNarrativeMode = "builder",
  observatory,
  locale = "zh",
}: {
  initialNarrativeMode?: CstdNarrativeMode;
  observatory: CstdHomepageObservatory;
  locale?: CstdLocale;
}) {
  return (
    <>
      {/*
        默认主页：正式滚动版式（scroll-craft chaptered editorial 构建）。
        它与游戏主题旅程并行常驻 DOM，由 html[data-cstd-theme] 的显示规则互斥
        切换，主题切换零重挂载。游戏主题（neon-district / underworld-forge /
        astral-covenant）的旅程保持原样，不经此处改动。
      */}
      <CstdEditorialHomepage locale={locale} {...editorialData(locale)} />

      <div data-cstd-home-shell className="contents">
        <HomepageRuntime narrativeMode={initialNarrativeMode} locale={locale}>
          <div data-cstd-home-game className="contents">
            <NeuralGate narrativeMode={initialNarrativeMode} locale={locale} />
            <ThemeSignatureExperience locale={locale} />

            <div id="systems" tabIndex={-1} data-cstd-scene-shell="systems" className="relative scroll-mt-16 focus:outline-none">
              <LivingStudioTwin narrativeMode={initialNarrativeMode} observatory={observatory} locale={locale} />
            </div>

            <div id="proof" tabIndex={-1} data-cstd-scene-shell="proof" className="relative scroll-mt-16 focus:outline-none">
              <SelectedWork narrativeMode={initialNarrativeMode} locale={locale} />
              <ExecutableEvidence locale={locale} />
            </div>

            <div id="path" tabIndex={-1} data-cstd-scene-shell="path" className="relative scroll-mt-16 focus:outline-none">
              <KnowledgeLens observatory={observatory} locale={locale} />
            </div>

            <Finale narrativeMode={initialNarrativeMode} locale={locale} />
          </div>
        </HomepageRuntime>
      </div>
    </>
  );
}
