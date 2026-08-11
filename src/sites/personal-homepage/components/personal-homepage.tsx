import type { CstdHomepageObservatory } from "../content/observatory";
import type { CstdNarrativeMode } from "../content/narratives";
import { NeuralGate } from "../scenes/neural-gate/neural-gate";
import { HomepageRuntime } from "./homepage-runtime";
import { ExecutableEvidence } from "./sections/executable-evidence";
import { Finale } from "./sections/finale";
import { KnowledgeLens } from "./sections/knowledge-lens";
import { LivingStudioTwin } from "./sections/living-studio-twin";
import { SelectedWork } from "./sections/selected-work";

export function PersonalHomepage({
  initialNarrativeMode = "builder",
  observatory,
}: {
  initialNarrativeMode?: CstdNarrativeMode;
  observatory: CstdHomepageObservatory;
}) {
  return (
    <HomepageRuntime narrativeMode={initialNarrativeMode}>
      <NeuralGate narrativeMode={initialNarrativeMode} />

      <div id="systems" data-cstd-scene-shell="systems" className="relative scroll-mt-16">
        <LivingStudioTwin narrativeMode={initialNarrativeMode} observatory={observatory} />
      </div>

      <div id="proof" data-cstd-scene-shell="proof" className="relative scroll-mt-16">
        <SelectedWork narrativeMode={initialNarrativeMode} />
      </div>

      <div id="operator" data-cstd-scene-shell="operator" className="relative scroll-mt-16">
        <ExecutableEvidence />
      </div>

      <div id="path" data-cstd-scene-shell="path" className="relative scroll-mt-16">
        <KnowledgeLens observatory={observatory} />
      </div>

      <Finale narrativeMode={initialNarrativeMode} />
    </HomepageRuntime>
  );
}
