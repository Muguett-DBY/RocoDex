import type { CstdHomepageObservatory } from "../content/observatory";
import type { CstdNarrativeMode } from "../content/narratives";
import type { CstdLocale } from "../content/content-types";
import { CstdFlightHomepage } from "./flight/cstd-flight-homepage";
import { NeuralGate } from "../scenes/neural-gate/neural-gate";
import { HomepageRuntime } from "./homepage-runtime";
import { ExecutableEvidence } from "./sections/executable-evidence";
import { Finale } from "./sections/finale";
import { KnowledgeLens } from "./sections/knowledge-lens";
import { LivingStudioTwin } from "./sections/living-studio-twin";
import { SelectedWork } from "./sections/selected-work";
import { ThemeSignatureExperience } from "./theme-signature-experience";

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
        默认主页：worldflight 旅程（scroll-craft 构建，替换原 atelier 版式）。
        它与游戏主题旅程并行常驻 DOM，由 html[data-cstd-theme] 的显示规则互斥
        切换，主题切换零重挂载。游戏主题（neon-district / underworld-forge /
        astral-covenant）的旅程保持原样，不经此处改动。
      */}
      <CstdFlightHomepage locale={locale} />

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
