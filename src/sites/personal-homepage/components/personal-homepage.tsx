import type { CstdHomepageObservatory } from "../content/observatory";
import type { CstdNarrativeMode } from "../content/narratives";
import type { CstdLocale } from "../content/content-types";
import { AtelierHomepage } from "../scenes/atelier/atelier-homepage";
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
    <HomepageRuntime narrativeMode={initialNarrativeMode} locale={locale}>
      <AtelierHomepage locale={locale} />
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
  );
}
