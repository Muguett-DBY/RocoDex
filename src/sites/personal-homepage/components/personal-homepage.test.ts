import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
const landingSource = read("./personal-homepage.tsx");
const homepageRuntimeSource = read("./homepage-runtime.tsx");
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
const studioExplorerSource = read("./sections/studio-system-explorer.tsx");
const proofSource = read("./sections/selected-work.tsx");
const replaySource = read("./sections/executable-evidence.tsx");
const replayRuntimeSource = read("./site/executable-case-replay.tsx");
const workerSource = read("../../../../public/cstd-case-worker.js");
const knowledgeSource = read("./sections/knowledge-lens.tsx");
const finaleSource = read("./sections/finale.tsx");
const globalsSource = read("../../../app/globals.css");
const themeStoreSource = read("../experience/theme-store.ts");
const themeSwitcherSource = read("./theme-switcher.tsx");
const themeWorldSource = read("./theme-world-layer.tsx");
const themeCopySource = read("./theme-copy.tsx");
const themeHeroArtifactSource = read("./theme-hero-artifact.tsx");
const languageSwitcherSource = read("./site/cstd-language-switcher.tsx");
const documentLocaleSource = read("./site/cstd-document-locale.tsx");
const siteChromeSource = read("./site/cstd-site-chrome.tsx");
const englishHomepageSource = read("../../../app/(personal)/cstd/en/page.tsx");
const themeCssSource = read("../../../app/cstd-themes.css");
const themeCompositionSource = read("../../../app/cstd-theme-compositions.css");
const appLayoutSource = read("../../../app/layout.tsx");
const assetManifestSource = read("../media/asset-manifest.ts");

describe("CSTD personal homepage", () => {
  test("keeps Custard identity and a direct portfolio promise above the fold", () => {
    expect(gateSource).toContain('id="cstd-hero-title"');
    expect(gateSource).toContain("data-text={cstdProfile.name[locale]}");
    expect(gateSource).toContain('href="#proof"');
    expect(gateSource).toContain('data-cstd-hero-summary');
    expect(gateSource).toContain("narrative.thesis[locale]");
    expect(narrativeSource).toContain('"/for/research"');
    expect(landingSource).toContain("initialNarrativeMode");
    expect(landingSource).not.toContain("project-comparison");
  });

  test("gives both locales the complete cinematic homepage and preserves deep routes when switching", () => {
    expect(englishHomepageSource).toContain('<PersonalHomepage locale="en"');
    expect(englishHomepageSource).not.toContain("CstdEnglishHubPage");
    expect(landingSource).toContain("locale?: CstdLocale");
    expect(landingSource).toContain("locale={locale}");
    expect(homepageRuntimeSource).toContain("<CstdDocumentLocale locale={locale}");
    expect(homepageRuntimeSource).toContain("data-cstd-locale={locale}");
    expect(headerSource).toContain("<CstdLanguageSwitcher locale={locale}");
    expect(siteChromeSource).toContain("<CstdLanguageSwitcher locale={locale}");
    expect(languageSwitcherSource).toContain("window.location.search");
    expect(languageSwitcherSource).toContain("window.location.hash");
    expect(languageSwitcherSource).toContain("getLocalizedCstdHref");
    expect(documentLocaleSource).toContain("document.documentElement.lang = config.htmlLang");
    expect(documentLocaleSource).toContain("data-cstd-document-locale={locale}");
    expect(studioExplorerSource).toContain("activeSystem.title[locale]");
    expect(proofSource).toContain("entry.title[locale]");
    expect(replaySource).toContain("locale={locale}");
    expect(knowledgeSource).toContain("answerGuideQuestion(lens.question[locale], locale)");
    expect(finaleSource).toContain("narrative.label[locale]");
  });

  test("uses six focused scenes without app-like homepage controls", () => {
    expect(landingSource).not.toContain('"use client"');
    expect(landingSource).toContain("<HomepageRuntime");
    expect(landingSource).toContain("<NeuralGate");
    expect(landingSource).toContain("<LivingStudioTwin");
    expect(landingSource).toContain("<SelectedWork");
    expect(landingSource).toContain("<ExecutableEvidence");
    expect(landingSource).toContain("<KnowledgeLens");
    expect(landingSource).toContain("<Finale");
    expect(homepageRuntimeSource).toContain('import { HomepageHeader } from "./homepage-header"');
    expect(homepageRuntimeSource).not.toContain("LazyHomepageHeader");
    expect(landingSource).not.toContain("LazyEngineeringMethod");
    expect(landingSource).not.toContain("LazySceneDirector");
    expect(landingSource).not.toContain("HomepageHud");
    expect(landingSource).not.toContain("command-drawer");
  });

  test("presents five capability directions without release-dashboard churn", () => {
    expect(studioSource).toContain("cstdStudioSnapshot.districts");
    expect(studioSource).toContain("data-cstd-studio-twin");
    expect(studioSource).toContain("<StudioSystemExplorer");
    expect(studioExplorerSource).toContain("data-cstd-studio-district-option");
    expect(studioExplorerSource).toContain('role="tablist"');
    expect(studioExplorerSource).toContain('getLocalizedCstdHref("/observatory.json", locale)');
    expect(studioSource).not.toContain("data-cstd-release-replay");
    expect(studioSource).not.toContain("setInterval");
    expect(studioSource).not.toContain("observatory.verification");
    expect(studioExplorerSource).not.toContain("cstdStudioSnapshot");
    expect(studioExplorerSource).not.toContain("cstdCaseStudies");
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
    expect(replayRuntimeSource).toContain("new IntersectionObserver");
    expect(replayRuntimeSource).toContain('data-cstd-worker="dedicated"');
    expect(workerSource).toContain('"alpha-race"');
    expect(workerSource).toContain("STALE WRITE REJECTED");
  });

  test("renders source-constrained technical answers as directly readable cards", () => {
    expect(knowledgeSource).toContain("answerGuideQuestion");
    expect(knowledgeSource).toContain("findCstdKnowledgePath");
    expect(knowledgeSource).toContain("data-cstd-knowledge-card");
    expect(knowledgeSource).toContain('getLocalizedCstdHref("/graph.json", locale)');
    expect(knowledgeSource).not.toContain("data-cstd-graph-path");
    expect(knowledgeSource).not.toContain("useState");
    expect(knowledgeSource).not.toContain("setInterval");
  });

  test("requires explicit opt-in before loading the desktop GPU runtime", () => {
    expect(homepageRuntimeSource).toContain('reason: "balanced-default"');
    expect(homepageRuntimeSource).toContain("useCstdRuntimeProfile(enhancementsReady && overdrive && immersiveTheme, desktopScene)");
    expect(homepageRuntimeSource).toContain('data-cstd-render-policy={overdrive && immersiveTheme ? "enhanced" : "balanced"}');
    expect(homepageRuntimeSource).toContain("enabled={enhancementsReady && desktopScene && overdrive && immersiveTheme}");
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
    expect(homepageRuntimeSource).toContain("useCstdSceneClock");
    expect(sceneClockSource).toContain('window.addEventListener("scroll", requestSync, { passive: true })');
    expect(sceneClockSource).toContain("requestAnimationFrame(sync)");
    expect(sceneClockSource).toContain("sceneMetrics");
    expect(sceneClockSource).toContain("let maxScroll = 1");
    expect(sceneClockSource).not.toContain("const maxScroll = Math.max(1, document.documentElement.scrollHeight");
    expect(sceneClockSource).toContain("if (nextSceneId === activeSceneRef.current) return");
    expect(sceneClockSource).not.toContain("getBoundingClientRect().top <= activationLine");
    expect(homepageRuntimeSource).toContain("pointerFrameRef");
    expect(homepageRuntimeSource).toContain("window.requestAnimationFrame(flushPointerPosition)");
    expect(homepageRuntimeSource).toContain("useCstdDocumentVisibility");
    expect(runtimeHooksSource).toContain('document.addEventListener("visibilitychange", sync)');
    expect(runtimeHooksSource).not.toContain("new MutationObserver");
    expect(sceneSource).toContain('frameloop={props.active && quality === "full" ? "always" : "demand"}');
    expect(homepageRuntimeSource).not.toContain('from "framer-motion"');
  });

  test("keeps only deliberate visual and motion controls", () => {
    expect(controlsSource).toContain("data-cstd-overdrive-toggle");
    expect(controlsSource).toContain("data-cstd-motion-toggle");
    expect(controlsSource).not.toContain("data-cstd-ambience-toggle");
    expect(homepageRuntimeSource).not.toContain("ambientSound");
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

  test("offers four persistent visual worlds with distinct structural engines", () => {
    expect(themeStoreSource).toContain('export type CstdThemeId = "neon-district" | "ink-protocol" | "press-room" | "pixel-quest"');
    expect(themeStoreSource).toContain('export type CstdThemeKind = "cyberpunk" | "ink-scroll" | "broadsheet" | "pixel-game"');
    expect(themeStoreSource).toContain('cstdThemeStorageKey = "cstd-world-theme"');
    expect(themeStoreSource).toContain('if (value === "solar-lab") return "press-room"');
    expect(themeStoreSource).toContain("setCstdTheme");
    expect(themeSwitcherSource).toContain("data-cstd-theme-switcher");
    expect(themeSwitcherSource).toContain("data-cstd-theme-option={candidate.id}");
    expect(themeSwitcherSource).toContain("createPortal(menu, document.body)");
    expect(homepageRuntimeSource).toContain("data-cstd-theme={theme}");
    expect(homepageRuntimeSource).toContain("data-cstd-theme-kind={getCstdThemeMeta(theme).kind}");
    expect(themeWorldSource).toContain('import { cstdThemeWorldAssets } from "../media/asset-manifest"');
    expect(themeWorldSource).toContain("src={cstdThemeWorldAssets[theme]}");
    expect(themeWorldSource).toContain("ThemeSceneNavigator");
    expect(themeWorldSource).toContain("data-cstd-theme-scene-node={sceneId}");
    expect(assetManifestSource).toContain("/cstd-themes/ink-scroll-v1.webp");
    expect(assetManifestSource).toContain("/cstd-themes/press-room-v1.webp");
    expect(assetManifestSource).toContain("/cstd-themes/pixel-quest-v1.webp");
    expect(themeStoreSource).toContain("INK PROTOCOL");
    expect(themeStoreSource).toContain("CSTD PRESS ROOM");
    expect(themeStoreSource).toContain("PIXEL QUEST");
    expect(themeCssSource).toContain('[data-cstd-theme="ink-protocol"]');
    expect(themeCssSource).toContain('[data-cstd-theme="press-room"]');
    expect(themeCssSource).toContain('[data-cstd-theme="pixel-quest"]');
    expect(themeCssSource).toContain("grid-template-columns: repeat(3, minmax(0, 1fr))");
    expect(themeCssSource).toContain("image-rendering: pixelated");
  });

  test("isolates each world's language, hero artifact, navigation grammar, and chapter composition", () => {
    expect(appLayoutSource).toContain('import "./cstd-theme-compositions.css"');
    expect(themeCopySource).toContain('data-cstd-theme-copy="neon"');
    expect(themeCopySource).toContain('data-cstd-theme-copy="ink"');
    expect(themeCopySource).toContain('data-cstd-theme-copy="press"');
    expect(themeCopySource).toContain('data-cstd-theme-copy="pixel"');
    expect(gateSource).toContain("万象入墨");
    expect(gateSource).toContain("今日头条");
    expect(gateSource).toContain("主线任务");
    expect(themeHeroArtifactSource).toContain('data-cstd-hero-artifact="neon"');
    expect(themeHeroArtifactSource).toContain('data-cstd-hero-artifact="ink"');
    expect(themeHeroArtifactSource).toContain('data-cstd-hero-artifact="press"');
    expect(themeHeroArtifactSource).toContain('data-cstd-hero-artifact="pixel"');
    expect(themeCompositionSource).toContain('[data-cstd-theme-scene-rail="neon-district"]');
    expect(themeCompositionSource).toContain('[data-cstd-theme-scene-rail="ink-protocol"]');
    expect(themeCompositionSource).toContain('[data-cstd-theme-scene-rail="press-room"]');
    expect(themeCompositionSource).toContain('[data-cstd-theme-scene-rail="pixel-quest"]');
    expect(themeCompositionSource).toContain(".cstd-ink-colophon");
    expect(themeCompositionSource).toContain(".cstd-press-front-index");
    expect(themeCompositionSource).toContain(".cstd-pixel-player-card");
    expect(themeCompositionSource).toContain(".cstd-neon-console");
    expect(themeCompositionSource).toContain('[data-cstd-theme="ink-protocol"] [data-cstd-proof-grid]');
    expect(themeCompositionSource).toContain('[data-cstd-theme="press-room"] [data-cstd-proof-grid]');
    expect(themeCompositionSource).toContain('[data-cstd-theme="pixel-quest"] [data-cstd-system-tabs]');
  });
});
