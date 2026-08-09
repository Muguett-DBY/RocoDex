import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
const landingSource = read("./personal-homepage.tsx");
const controlsSource = read("./homepage-controls.tsx");
const sceneSource = read("./immersive-scene.tsx");
const liteSceneSource = read("./lite-immersive-scene.tsx");
const postprocessingSource = read("./immersive-postprocessing.tsx");
const directorSource = read("./scene-director.tsx");
const ambienceSource = read("./ambient-sound.ts");
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

describe("CSTD 8.0 neural industrialism portfolio", () => {
  test("keeps identity first and exposes shareable audience paths", () => {
    expect(gateSource).toContain('id="cstd-hero-title"');
    expect(gateSource).toContain("narrative.thesis.zh");
    expect(gateSource).toContain("getCstdNarrativeSharePath");
    expect(narrativeSource).toContain('return "/for/research"');
    expect(landingSource).toContain("initialNarrativeMode");
    expect(landingSource).not.toContain("project-comparison");
    expect(landingSource).not.toContain("ProjectShowcase");
  });

  test("uses a six-scene three-act dossier without old utility chapters", () => {
    expect(landingSource).toContain("LazyLivingStudioTwin");
    expect(landingSource).toContain("LazySelectedWork");
    expect(landingSource).toContain("LazyExecutableEvidence");
    expect(landingSource).toContain("LazyKnowledgeLens");
    expect(landingSource).toContain("narrativeMode={narrativeMode}");
    expect(landingSource).not.toContain("command-drawer");
    expect(landingSource).not.toContain("LazyOperatorProfile");
    expect(landingSource).not.toContain("LazyResearchPath");
  });

  test("derives the living studio from build-time proof", () => {
    expect(studioSource).toContain("cstdStudioSnapshot.districts");
    expect(studioSource).toContain("data-cstd-studio-twin");
    expect(studioSource).toContain("data-cstd-release-replay");
    expect(studioSource).toContain('href="/status.json"');
    expect(studioSource).toContain("setInterval");
  });

  test("keeps representative work concise and sends depth to case pages", () => {
    expect(proofSource).toContain("cstdProofMesh");
    expect(proofSource).toContain("getCaseStudyPath");
    expect(proofSource).toContain("首页只给出结论");
    expect(proofSource).not.toContain("ProjectBroadcast");
    expect(proofSource).not.toContain("lg:min-h-[140svh]");
  });

  test("runs four deterministic technical replays in a dedicated worker", () => {
    expect(replaySource).toContain("cstdCaseReplays");
    expect(replayRuntimeSource).toContain('new Worker("/cstd-case-worker.js")');
    expect(replayRuntimeSource).toContain('data-cstd-worker="dedicated"');
    expect(workerSource).toContain('"alpha-race"');
    expect(workerSource).toContain('"dcf-cache"');
    expect(workerSource).toContain('"host-boundaries"');
    expect(workerSource).toContain('"crm-lock"');
    expect(workerSource).toContain("STALE WRITE REJECTED");
  });

  test("places source-constrained answers inside a knowledge path", () => {
    expect(knowledgeSource).toContain("answerGuideQuestion");
    expect(knowledgeSource).toContain("findCstdKnowledgePath");
    expect(knowledgeSource).toContain("data-cstd-graph-path");
    expect(knowledgeSource).toContain('href="/graph.json"');
    expect(knowledgeSource).not.toContain("<input");
  });

  test("keeps WebGL progressive, asynchronous, and desktop-only", () => {
    expect(runtimeHooksSource).toContain("desktopSceneQuery");
    expect(runtimeHooksSource).toContain('import("./runtime-capabilities")');
    expect(runtimeSource).toContain("WEBGL_debug_renderer_info");
    expect(runtimeSource).toContain("runtimeNavigator.gpu");
    expect(sceneRuntimeSource).toContain("<LiteScene");
    expect(sceneRuntimeSource).toContain("<FullScene");
    expect(sceneRuntimeSource).toContain("<WebGpuField");
    expect(webgpuSource).toContain("navigator.gpu");
    expect(webgpuSource).toContain("@fragment fn fragmentMain");
    expect(sceneSource).toContain("@react-three/fiber");
    expect(sceneSource).toContain("<Canvas");
    expect(sceneSource).toContain("<ParticleCurrent");
    expect(sceneSource).toContain("<NeuralCity");
    expect(sceneSource).toContain("const LazyImmersivePostprocessing = lazy(");
    expect(sceneSource).not.toContain('from "@react-three/postprocessing"');
    expect(postprocessingSource).toContain('from "@react-three/postprocessing"');
    expect(liteSceneSource).toContain("data-cstd-lite-immersive");
    expect(qualitySource).toContain("CstdFrameBudgetController");
  });

  test("uses one native scroll clock and pauses heavy work offscreen", () => {
    expect(landingSource).toContain("useCstdSceneClock");
    expect(sceneClockSource).toContain('window.addEventListener("scroll", requestSync, { passive: true })');
    expect(sceneClockSource).toContain("requestAnimationFrame(sync)");
    expect(landingSource).toContain("useCstdDocumentVisibility");
    expect(runtimeHooksSource).toContain('document.addEventListener("visibilitychange", sync)');
    expect(sceneSource).toContain('frameloop={props.active && quality === "full" ? "always" : "demand"}');
    expect(landingSource).not.toContain('from "framer-motion"');
  });

  test("keeps overdrive and ambience deliberate", () => {
    expect(controlsSource).toContain("data-cstd-overdrive-toggle");
    expect(controlsSource).toContain("data-cstd-ambience-toggle");
    expect(landingSource).toContain("ambientSound.start()");
    expect(ambienceSource).not.toContain("autoplay");
    expect(globalsSource).toContain('[data-cstd-overdrive="true"] .cstd-glitch-title::before');
    expect(landingSource).not.toContain("prefers-reduced-motion: reduce");
  });

  test("directs every chapter through the cinematic controller", () => {
    expect(landingSource).toContain("LazySceneDirector");
    expect(directorSource).toContain("data-cstd-scene-director");
    expect(sceneManifestSource).toContain('label: "Executable evidence"');
    expect(sceneManifestSource).toContain('label: "Knowledge intelligence"');
    expect(worldSource).toContain("getCstdSceneWindow");
  });

  test("ends in a narrative-aware collaboration exit", () => {
    expect(finaleSource).toContain("collaborationCopy");
    expect(finaleSource).toContain("getCstdNarrativeSharePath");
    expect(finaleSource).toContain('href={`mailto:cstd@custard.top');
    expect(finaleSource).toContain("FINAL TRANSMISSION");
  });
});
