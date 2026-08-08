import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const landingSource = readFileSync(new URL("./personal-homepage.tsx", import.meta.url), "utf8");
const sceneSource = readFileSync(new URL("./immersive-scene.tsx", import.meta.url), "utf8");
const commandSource = readFileSync(new URL("./command-drawer.tsx", import.meta.url), "utf8");
const directorSource = readFileSync(new URL("./scene-director.tsx", import.meta.url), "utf8");
const broadcastSource = readFileSync(new URL("./project-broadcast.tsx", import.meta.url), "utf8");
const ambienceSource = readFileSync(new URL("./ambient-sound.ts", import.meta.url), "utf8");
const worldSource = readFileSync(new URL("./world-backdrop.tsx", import.meta.url), "utf8");
const gateSource = readFileSync(new URL("../scenes/neural-gate/neural-gate.tsx", import.meta.url), "utf8");
const sceneClockSource = readFileSync(new URL("../experience/scene-clock.ts", import.meta.url), "utf8");
const sceneManifestSource = readFileSync(new URL("../experience/scene-manifest.ts", import.meta.url), "utf8");
const qualitySource = readFileSync(new URL("../experience/quality-controller.ts", import.meta.url), "utf8");
const assetManifestSource = readFileSync(new URL("../media/asset-manifest.ts", import.meta.url), "utf8");
const globalsSource = readFileSync(new URL("../../../app/globals.css", import.meta.url), "utf8");
const sectionSources = {
  signal: readFileSync(new URL("./sections/signal-strip.tsx", import.meta.url), "utf8"),
  systems: readFileSync(new URL("./sections/systems-chapter.tsx", import.meta.url), "utf8"),
  proof: readFileSync(new URL("./sections/selected-work.tsx", import.meta.url), "utf8"),
  operator: readFileSync(new URL("./sections/operator-profile.tsx", import.meta.url), "utf8"),
  path: readFileSync(new URL("./sections/research-path.tsx", import.meta.url), "utf8"),
  finale: readFileSync(new URL("./sections/finale.tsx", import.meta.url), "utf8"),
};
const chapterSource = Object.values(sectionSources).join("\n");

describe("CSTD personal systems studio", () => {
  test("puts the personal identity and representative proof ahead of tooling", () => {
    expect(gateSource).toContain('id="cstd-hero-title"');
    expect(gateSource).toContain('aria-label="CSTD"');
    expect(gateSource).toContain("穿过一座由真实系统点亮的城市");
    expect(gateSource).toContain("奶黄包的个人技术工作室");
    expect(gateSource).toContain('href="#systems"');
    expect(landingSource).toContain("<MemoizedNeuralGate");
    expect(landingSource).not.toContain("ProjectShowcase");
    expect(landingSource).not.toContain("project-comparison");
    expect(landingSource).not.toContain("project-directory");
  });

  test("keeps the WebGL identity progressive and desktop-only", () => {
    expect(assetManifestSource).toContain("cstd-neural-gate-v1.webp");
    expect(landingSource).toContain("desktopSceneQuery");
    expect(landingSource).toContain("enhancementsReady && desktopScene");
    expect(sceneSource).toContain("@react-three/fiber");
    expect(sceneSource).toContain("<Canvas");
    expect(sceneSource).toContain("<shaderMaterial");
    expect(sceneSource).toContain("<ParticleCurrent");
    expect(sceneSource).toContain("<NeuralCity");
    expect(sceneSource).toContain("<NeuralBeacon");
    expect(sceneSource).toContain("<TransitLanes");
    expect(sceneSource).toContain("<CityWindowField");
    expect(sceneSource).toContain("data-cstd-neural-city");
    expect(sceneSource).toContain("<ArchiveSpine");
    expect(qualitySource).toContain("CstdFrameBudgetController");
    expect(qualitySource).toContain("MAX_TEXTURE_SIZE");
    expect(sceneSource).toContain("<QualityProbe");
    expect(sceneSource).toContain('dpr={quality === "full" ? [1, 1.25] : 1}');
  });

  test("does not download archive textures until the systems chapter is active", () => {
    expect(landingSource).toContain('activeSceneId === "systems" || activeSceneId === "path"');
    expect(sceneSource).toContain("props.showArchive ? (");
    expect(sceneSource).toContain("<ProgressiveArchiveLayer");
    expect(sceneSource).toContain("<SceneReady onReady={props.onReady}");
  });

  test("uses one native scroll loop instead of a motion runtime on first paint", () => {
    expect(landingSource).toContain("useCstdSceneClock");
    expect(sceneClockSource).toContain('window.addEventListener("scroll", requestSync, { passive: true })');
    expect(sceneClockSource).toContain("requestAnimationFrame(sync)");
    expect(sceneClockSource).toContain("progressBarRef.current.style.transform");
    expect(sceneClockSource).toContain('root.dataset.cstdSceneCurrent = nextSceneId');
    expect(landingSource).not.toContain('from "framer-motion"');
    expect(landingSource).not.toContain("<LazyMotion");
    expect(landingSource).not.toContain("useMotionValue");
  });

  test("loads the command console only after deliberate input", () => {
    expect(landingSource).toContain('import("./command-drawer")');
    expect(landingSource).toContain("consoleOpen ? (");
    expect(landingSource).not.toContain('from "./terminal-command"');
    expect(commandSource).toContain("<TerminalCommand");
    expect(commandSource).toContain('aria-label="关闭控制台"');
    expect(commandSource).toContain('event.key === "Escape"');
    expect(commandSource).toContain('case "breach"');
    expect(commandSource).toContain('case "scan"');
    expect(commandSource).toContain('case "jack"');
    expect(commandSource).toContain("proof-${project.id}");
    expect(commandSource).toContain("onOverdrive();");
    expect(landingSource).toContain("const closeConsole = useCallback");
    expect(landingSource).toContain("onClose={closeConsole}");
    expect(landingSource).toContain("onOverdrive={enableOverdrive}");
  });

  test("keeps high-intensity cyber effects behind a deliberate overdrive state", () => {
    expect(landingSource).toContain("data-cstd-overdrive-toggle");
    expect(landingSource).toContain('data-cstd-overdrive={overdrive ? "true" : "false"}');
    expect(landingSource).toContain("setOverdrive((current) => !current)");
    expect(landingSource).toContain("data-cstd-crosshair");
    expect(globalsSource).toContain('[data-cstd-overdrive="true"] .cstd-glitch-title::before');
    expect(globalsSource).toContain('[data-cstd-motion="calm"] .cstd-hud-scan');
    expect(globalsSource).toContain('transform: translate3d(-2%, 6%, 0)');
    expect(globalsSource).toContain('[data-cstd-scene-current="path"] .cstd-memory-loader-scan');
    expect(globalsSource).toContain('[data-cstd-kinetic-world]:has([data-cstd-render-quality="lite"]) .cstd-world-rain');
  });

  test("removes continuous decorative loops from the DOM chapters", () => {
    expect(sectionSources.signal).not.toContain("repeat: Infinity");
    expect(sectionSources.signal).not.toContain("data-cstd-signal-track");
    expect(sectionSources.systems).not.toContain("Meteors");
    expect(sectionSources.systems).not.toContain("Gauge");
    expect(sectionSources.proof).not.toContain("LazyOrb");
    expect(sectionSources.proof).not.toContain("cstd-spin");
    expect(sectionSources.path).not.toContain("CountUp");
    expect(sectionSources.path).not.toContain("TracingProgress");
  });

  test("composes systems, proof, and research as concise interactive chapters", () => {
    expect(chapterSource).toContain('data-cstd-chapter="systems"');
    expect(chapterSource).toContain('data-cstd-chapter="proof"');
    expect(chapterSource).toContain('data-cstd-chapter="operator"');
    expect(chapterSource).toContain('data-cstd-chapter="path"');
    expect(chapterSource).toContain("data-cstd-system={system.id}");
    expect(chapterSource).toContain("data-cstd-proof={proof.projectId}");
    expect(chapterSource).toContain("data-cstd-project-plane={proof.projectId}");
    expect(chapterSource).toContain("data-cstd-live-feed={proof.projectId}");
    expect(sectionSources.operator).toContain("cstd-night-runner-v1.webp");
    expect(sectionSources.operator).toContain("unoptimized");
    expect(sectionSources.operator).toContain('data-cstd-generated-visual="night-runner-v1"');
    expect(chapterSource).toContain("data-cstd-learning-step={entry.year}");
    expect(sectionSources.path).toContain("setImageLoaded(true)");
    expect(sectionSources.path).toContain("cstd-memory-loader-scan");
    expect(sectionSources.systems).toContain("data-cstd-skill-reactor");
    expect(sectionSources.systems).toContain("cstdTechnicalNotes");
    expect(sectionSources.systems).toContain("data-cstd-reactor-map");
    expect(sectionSources.path).not.toContain("min-h-svh");
  });

  test("queues typed terminal output without replacing the previous line", () => {
    const terminalSource = readFileSync(new URL("./terminal-command.tsx", import.meta.url), "utf8");
    expect(terminalSource).toContain('setLines((current) => [...current, { ...line, text: "" }])');
    expect(terminalSource).toContain("next[next.length - 1]");
    expect(commandSource).toContain("BREACH PROTOCOL ACCEPTED");
  });

  test("keeps live links behind the shared external-link policy", () => {
    expect(sectionSources.proof).toContain("const targetProps = getCstdLinkTargetProps(project.href);");
    expect(sectionSources.proof).toContain("{...targetProps}");
    expect(sceneSource).toContain('data-cstd-render-fallback={contextLost ? "true" : "false"}');
    expect(sceneSource).toContain("preserveDrawingBuffer: true");
    expect(sceneSource).toContain('addEventListener("webglcontextlost"');
  });

  test("keeps explicit calm mode without inheriting operating-system motion settings", () => {
    expect(landingSource).toContain("useSyncExternalStore(");
    expect(landingSource).toContain('return "full";');
    expect(landingSource).toContain("data-cstd-motion-toggle");
    expect(landingSource).not.toContain("prefers-reduced-motion: reduce");
    expect(landingSource).toContain("reducedMotion={reducedMotion}");
    expect(sceneSource).toContain('frameloop={props.active && quality === "full" ? "always" : "demand"}');
  });

  test("ships the black-label boot, dive HUD, generated persona, and live project telemetry", () => {
    expect(landingSource).toContain("cstd-boot-sequence");
    expect(landingSource).toContain("data-cstd-neural-dive");
    expect(landingSource).toContain("diveDepthRef");
    expect(sectionSources.proof).toContain("ENGINEERING DECISION");
    expect(sectionSources.proof).toContain("WEBM + H264");
    expect(globalsSource).toContain(".cstd-live-feed-image");
    expect(globalsSource).toContain("@keyframes cstd-persona-scan");
  });

  test("directs every chapter through one scroll-native cinematic controller", () => {
    expect(landingSource).toContain("<MemoizedSceneDirector activeSceneId={activeSceneId}");
    expect(sceneClockSource).toContain('style.setProperty("--cstd-scroll-velocity"');
    expect(sceneClockSource).toContain('style.setProperty("--cstd-chapter-shift"');
    expect(landingSource).toContain("new IntersectionObserver(");
    expect(directorSource).toContain("data-cstd-scene-director");
    expect(directorSource).toContain("cstd-director-aperture");
    expect(sceneManifestSource).toContain('id: "finale"');
    expect(worldSource).toContain("getCstdSceneWindow");
    expect(globalsSource).toContain(".cstd-speed-lines");
  });

  test("plays lightweight project broadcasts only while their chapters are visible", () => {
    expect(sectionSources.proof).toContain("<ProjectBroadcast");
    expect(assetManifestSource).toContain("rocodex-broadcast-v1.webm");
    expect(assetManifestSource).toContain("alpha-broadcast-v1.webm");
    expect(assetManifestSource).toContain("crm-broadcast-v1.webm");
    expect(assetManifestSource).toContain("rocodex-broadcast-v1.mp4");
    expect(broadcastSource).toContain('preload="metadata"');
    expect(broadcastSource).toContain("video.play()");
    expect(broadcastSource).toContain("video.pause()");
    expect(broadcastSource).toContain("rootMargin: \"75% 0px\"");
    expect(broadcastSource).toContain('type="video/webm"');
    expect(broadcastSource).toContain('type="video/mp4"');
  });

  test("uses a coherent original visual universe across entry, archive, and finale", () => {
    expect(assetManifestSource).toContain("/cstd-universe/cstd-neural-gate-v1.webp");
    expect(assetManifestSource).toContain("/cstd-universe/cstd-skill-reactor-v1.webp");
    expect(assetManifestSource).toContain("/cstd-universe/cstd-broadcast-nexus-v1.webp");
    expect(sectionSources.path).toContain("/cstd-universe/cstd-data-vault-v1.webp");
    expect(assetManifestSource).toContain("/cstd-universe/cstd-night-workstation-v1.webp");
    expect(assetManifestSource).toContain("/cstd-universe/cstd-departure-city-v1.webp");
    expect(sectionSources.finale).toContain('data-cstd-generated-visual="departure-city-v1"');
  });

  test("keeps the reactive audio atmosphere explicitly user activated", () => {
    expect(landingSource).toContain("data-cstd-ambience-toggle");
    expect(landingSource).toContain("ambientSound.start()");
    expect(landingSource).toContain('data-cstd-ambience={ambienceOn ? "on" : "off"}');
    expect(ambienceSource).toContain("class AmbientSoundEngine");
    expect(ambienceSource).toContain("city: GainNode");
    expect(ambienceSource).toContain("data: GainNode");
    expect(ambienceSource).toContain("rain: GainNode");
    expect(ambienceSource).toContain("cue: GainNode");
    expect(ambienceSource).not.toContain("autoplay");
  });

  test("closes with a full cinematic final transmission instead of a utility footer", () => {
    expect(landingSource).toContain("<LazyFinale />");
    expect(sectionSources.finale).toContain("data-cstd-finale");
    expect(sectionSources.finale).toContain("FINAL TRANSMISSION");
    expect(sectionSources.finale).toContain("STILL");
    expect(sectionSources.finale).toContain('href="mailto:cstd@custard.top"');
  });
});
