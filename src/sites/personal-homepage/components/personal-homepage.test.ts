import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
const landingSource = read("./personal-homepage.tsx");
const controlsSource = read("./homepage-controls.tsx");
const headerSource = read("./homepage-header.tsx");
const linkSource = read("./site/cstd-link.tsx");
const chapterLinkSource = read("./site/cstd-chapter-link.tsx");
const sceneSource = read("./immersive-scene.tsx");
const liteSceneSource = read("./lite-immersive-scene.tsx");
const postprocessingSource = read("./immersive-postprocessing.tsx");
const worldSource = read("./world-backdrop.tsx");
const gateSource = read("../scenes/neural-gate/neural-gate.tsx");
const sceneClockSource = read("../experience/scene-clock.ts");
const sceneManifestSource = read("../experience/scene-manifest.ts");
const qualitySource = read("../experience/quality-controller.ts");
const runtimeSource = read("../experience/runtime-capabilities.ts");
const runtimeHooksSource = read("../experience/runtime-hooks.ts");
const sceneRuntimeSource = read("./scene-runtime.tsx");
const webgpuSource = read("./webgpu-signal-field.tsx");
const narrativeSource = read("../content/narratives.ts");
const studioSource = read("./sections/living-studio-twin.tsx");
const proofSource = read("./sections/selected-work.tsx");
const replaySource = read("./sections/executable-evidence.tsx");
const replayRuntimeSource = read("./site/executable-case-replay.tsx");
const workerSource = read("../../../../public/cstd-case-worker.js");
const knowledgeSource = read("./sections/knowledge-lens.tsx");
const finaleSource = read("./sections/finale.tsx");
const globalsSource = read("../../../app/globals.css");

describe("CSTD personal homepage", () => {
  test("keeps Custard identity and a direct portfolio promise above the fold", () => {
    expect(gateSource).toContain('id="cstd-hero-title"');
    expect(gateSource).toContain('data-text="奶黄包"');
    expect(gateSource).toContain('href="#proof"');
    expect(gateSource).toContain('data-cstd-hero-summary');
    expect(gateSource).toContain("narrative.thesis.zh");
    expect(narrativeSource).toContain('return "/for/research"');
    expect(landingSource).toContain("initialNarrativeMode");
    expect(landingSource).not.toContain("project-comparison");
  });

  test("uses six focused scenes without app-like homepage controls", () => {
    expect(landingSource).toContain("LazyNeuralGate");
    expect(landingSource).toContain('import { HomepageHeader } from "./homepage-header"');
    expect(landingSource).not.toContain("LazyHomepageHeader");
    expect(landingSource).toContain("LazyLivingStudioTwin");
    expect(landingSource).toContain("LazySelectedWork");
    expect(landingSource).toContain("LazyExecutableEvidence");
    expect(landingSource).toContain("LazyKnowledgeLens");
    expect(landingSource).toContain("LazyFinale");
    expect(landingSource).not.toContain("LazyEngineeringMethod");
    expect(landingSource).not.toContain("LazySceneDirector");
    expect(landingSource).not.toContain("HomepageHud");
    expect(landingSource).not.toContain("command-drawer");
  });

  test("presents five capability directions without release-dashboard churn", () => {
    expect(studioSource).toContain("cstdStudioSnapshot.districts");
    expect(studioSource).toContain("data-cstd-studio-twin");
    expect(studioSource).toContain("data-cstd-studio-district-option");
    expect(studioSource).toContain('role="tablist"');
    expect(studioSource).toContain('href="/observatory.json"');
    expect(studioSource).not.toContain("data-cstd-release-replay");
    expect(studioSource).not.toContain("setInterval");
    expect(studioSource).not.toContain("observatory.verification");
  });

  test("keeps representative work concise and sends depth to case pages", () => {
    expect(proofSource).toContain("cstdProofMesh");
    expect(proofSource).toContain("getCaseStudyPath");
    expect(proofSource).toContain("首页只给出结论");
    expect(proofSource).not.toContain("ProjectBroadcast");
    expect(proofSource).not.toContain("backdrop-blur");
  });

  test("offers one representative deterministic replay instead of a tool selector", () => {
    expect(replaySource).toContain("const replay = cstdCaseReplays[0]");
    expect(replaySource).toContain("data-cstd-home-replay");
    expect(replaySource).not.toContain("data-cstd-replay-option");
    expect(replaySource).not.toContain("useState");
    expect(replayRuntimeSource).toContain('new Worker("/cstd-case-worker.js")');
    expect(replayRuntimeSource).toContain('data-cstd-worker="dedicated"');
    expect(workerSource).toContain('"alpha-race"');
    expect(workerSource).toContain("STALE WRITE REJECTED");
  });

  test("renders source-constrained technical answers as directly readable cards", () => {
    expect(knowledgeSource).toContain("answerGuideQuestion");
    expect(knowledgeSource).toContain("findCstdKnowledgePath");
    expect(knowledgeSource).toContain("data-cstd-knowledge-card");
    expect(knowledgeSource).toContain('href="/graph.json"');
    expect(knowledgeSource).not.toContain("data-cstd-graph-path");
    expect(knowledgeSource).not.toContain("useState");
    expect(knowledgeSource).not.toContain("setInterval");
  });

  test("requires explicit opt-in before loading the desktop GPU runtime", () => {
    expect(landingSource).toContain('reason: "balanced-default"');
    expect(landingSource).toContain("useCstdRuntimeProfile(enhancementsReady && overdrive, desktopScene)");
    expect(landingSource).toContain('data-cstd-render-policy={overdrive ? "enhanced" : "balanced"}');
    expect(landingSource).toContain("enabled={enhancementsReady && desktopScene && overdrive}");
    expect(runtimeHooksSource).toContain("desktopSceneQuery");
    expect(runtimeHooksSource).toContain('import("./runtime-capabilities")');
    expect(runtimeSource).toContain("WEBGL_debug_renderer_info");
    expect(runtimeSource).toContain("runtimeNavigator.gpu");
    expect(sceneRuntimeSource).toContain("<LiteScene");
    expect(sceneRuntimeSource).toContain("<FullScene");
    expect(sceneRuntimeSource).toContain("<WebGpuField");
    expect(webgpuSource).toContain("navigator.gpu");
    expect(sceneSource).toContain("@react-three/fiber");
    expect(sceneSource).toContain("<Canvas");
    expect(sceneSource).toContain("const LazyImmersivePostprocessing = lazy(");
    expect(sceneSource).not.toContain('from "@react-three/postprocessing"');
    expect(postprocessingSource).toContain('from "@react-three/postprocessing"');
    expect(liteSceneSource).toContain("data-cstd-lite-immersive");
    expect(qualitySource).toContain("CstdFrameBudgetController");
  });

  test("uses one throttled native scroll and pointer clock", () => {
    expect(landingSource).toContain("useCstdSceneClock");
    expect(sceneClockSource).toContain('window.addEventListener("scroll", requestSync, { passive: true })');
    expect(sceneClockSource).toContain("requestAnimationFrame(sync)");
    expect(landingSource).toContain("pointerFrameRef");
    expect(landingSource).toContain("window.requestAnimationFrame(flushPointerPosition)");
    expect(landingSource).toContain("useCstdDocumentVisibility");
    expect(runtimeHooksSource).toContain('document.addEventListener("visibilitychange", sync)');
    expect(sceneSource).toContain('frameloop={props.active && quality === "full" ? "always" : "demand"}');
    expect(landingSource).not.toContain('from "framer-motion"');
  });

  test("keeps only deliberate visual and motion controls", () => {
    expect(controlsSource).toContain("data-cstd-overdrive-toggle");
    expect(controlsSource).toContain("data-cstd-motion-toggle");
    expect(controlsSource).not.toContain("data-cstd-ambience-toggle");
    expect(landingSource).not.toContain("ambientSound");
    expect(globalsSource).toContain('[data-cstd-render-policy="balanced"] .cstd-world-rain');
    expect(globalsSource).toContain('[data-cstd-render-policy="enhanced"] .cstd-world-rain');
  });

  test("keeps primary navigation immediate and prewarmed", () => {
    expect(linkSource).toContain("router.prefetch");
    expect(linkSource).toContain("eagerPrefetch");
    expect(linkSource).not.toContain("startViewTransition");
    expect(headerSource).toContain("CstdChapterLink");
    expect(headerSource).toContain("eagerPrefetch");
    expect(chapterLinkSource).toContain("const alignTarget = () =>");
    expect(chapterLinkSource).toContain('window.scrollTo({ top: Math.max(0, Math.round(targetTop)), behavior: "instant" })');
    expect(chapterLinkSource).toContain("data-cstd-anchor-jump");
    expect(landingSource).toContain('id="systems"');
    expect(landingSource).toContain('id="proof"');
    expect(landingSource).toContain('id="operator"');
    expect(globalsSource).not.toContain("content-visibility: auto");
  });

  test("keeps scene changes cinematic without hijacking document scroll", () => {
    expect(sceneManifestSource).toContain('label: "Executable evidence"');
    expect(sceneManifestSource).toContain('label: "Knowledge paths"');
    expect(worldSource).toContain("getCstdSceneWindow");
    expect(finaleSource).toContain("collaborationCopy");
    expect(finaleSource).toContain('href={`mailto:cstd@custard.top');
    expect(finaleSource).not.toContain("lg:sticky");
    expect(finaleSource).not.toContain("lg:h-[155svh]");
  });
});
