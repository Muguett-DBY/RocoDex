import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const landingSource = readFileSync(new URL("./personal-homepage.tsx", import.meta.url), "utf8");
const sceneSource = readFileSync(new URL("./immersive-scene.tsx", import.meta.url), "utf8");
const commandSource = readFileSync(new URL("./command-drawer.tsx", import.meta.url), "utf8");
const globalsSource = readFileSync(new URL("../../../app/globals.css", import.meta.url), "utf8");
const sectionSources = {
  signal: readFileSync(new URL("./sections/signal-strip.tsx", import.meta.url), "utf8"),
  systems: readFileSync(new URL("./sections/systems-chapter.tsx", import.meta.url), "utf8"),
  proof: readFileSync(new URL("./sections/selected-work.tsx", import.meta.url), "utf8"),
  path: readFileSync(new URL("./sections/research-path.tsx", import.meta.url), "utf8"),
};
const chapterSource = Object.values(sectionSources).join("\n");

describe("CSTD personal systems studio", () => {
  test("puts the personal identity and representative proof ahead of tooling", () => {
    expect(landingSource).toContain('id="cstd-hero-title"');
    expect(landingSource).toContain("把代码写进现实");
    expect(landingSource).toContain("奶黄包的个人技术工作室");
    expect(landingSource).toContain('href="#proof"');
    expect(landingSource).not.toContain("ProjectShowcase");
    expect(landingSource).not.toContain("project-comparison");
    expect(landingSource).not.toContain("project-directory");
  });

  test("keeps the WebGL identity progressive and desktop-only", () => {
    expect(landingSource).toContain("cstd-night-ops-v1.webp");
    expect(sceneSource).toContain("cstd-night-ops-v1.webp");
    expect(landingSource).toContain("desktopSceneQuery");
    expect(landingSource).toContain("enhancementsReady && desktopScene");
    expect(sceneSource).toContain("@react-three/fiber");
    expect(sceneSource).toContain("<Canvas");
    expect(sceneSource).toContain("<shaderMaterial");
    expect(sceneSource).toContain("<ParticleCurrent");
    expect(sceneSource).toContain("<ArchiveSpine");
    expect(sceneSource).toContain("deviceMemory");
    expect(sceneSource).toContain('dpr={quality === "full" ? [1, 1.25] : 1}');
  });

  test("does not download archive textures until the systems chapter is active", () => {
    expect(landingSource).toContain('showArchive: activeChapter === "systems"');
    expect(sceneSource).toContain("props.showArchive ? (");
    expect(sceneSource).toContain("<ProgressiveArchiveLayer");
    expect(sceneSource).toContain("<SceneReady onReady={props.onReady}");
  });

  test("uses one native scroll loop instead of a motion runtime on first paint", () => {
    expect(landingSource).toContain('window.addEventListener("scroll", requestSync, { passive: true })');
    expect(landingSource).toContain("requestAnimationFrame(syncScroll)");
    expect(landingSource).toContain("progressBarRef.current.style.transform");
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
    expect(commandSource).toContain("onOverdrive();");
  });

  test("keeps high-intensity cyber effects behind a deliberate overdrive state", () => {
    expect(landingSource).toContain("data-cstd-overdrive-toggle");
    expect(landingSource).toContain('data-cstd-overdrive={overdrive ? "true" : "false"}');
    expect(landingSource).toContain("setOverdrive((current) => !current)");
    expect(landingSource).toContain("data-cstd-crosshair");
    expect(globalsSource).toContain('[data-cstd-overdrive="true"] .cstd-glitch-title::before');
    expect(globalsSource).toContain('[data-cstd-motion="calm"] .cstd-hud-scan');
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
    expect(chapterSource).toContain('data-cstd-chapter="path"');
    expect(chapterSource).toContain("data-cstd-system={system.id}");
    expect(chapterSource).toContain("data-cstd-proof={proof.projectId}");
    expect(chapterSource).toContain("data-cstd-project-plane={proof.projectId}");
    expect(chapterSource).toContain("data-cstd-learning-step={entry.year}");
    expect(sectionSources.path).toContain("setImageLoaded(true)");
    expect(sectionSources.path).toContain("cstd-memory-loader-scan");
    expect(sectionSources.systems).not.toContain("min-h-[185svh]");
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
});
