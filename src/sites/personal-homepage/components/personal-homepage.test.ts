import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const landingSource = readFileSync(new URL("./personal-homepage.tsx", import.meta.url), "utf8");
const sceneSource = readFileSync(new URL("./immersive-scene.tsx", import.meta.url), "utf8");
// 章节级 code-splitting 后，章节组件位于独立文件；合并读取以保持架构断言强度
const chapterSource = [
  "signal-strip",
  "systems-chapter",
  "selected-work",
  "research-path",
]
  .map((name) => readFileSync(new URL(`./sections/${name}.tsx`, import.meta.url), "utf8"))
  .join("\n");

describe("CSTD immersive systems world", () => {
  test("builds a real WebGL scene from generated cinematic materials", () => {
    expect(landingSource).toContain("cstd-kinetic-studio-v2.webp");
    expect(sceneSource).toContain("cstd-data-loom-v2.webp");
    expect(sceneSource).toContain("@react-three/fiber");
    expect(sceneSource).toContain("<Canvas");
    expect(sceneSource).toContain("<shaderMaterial");
    expect(sceneSource).toContain("<ParticleCurrent");
    expect(sceneSource).toContain("<ArchiveSpine");
    expect(sceneSource).toContain("<EffectComposer");
    expect(sceneSource).toContain("<Bloom");
    expect(sceneSource).toContain("<ChromaticAberration");
  });

  test("connects pointer, press, and scroll progress to the cinematic world", () => {
    expect(landingSource).toContain("data-cstd-kinetic-world");
    expect(sceneSource).toContain("data-cstd-webgl");
    expect(landingSource).toContain("data-cstd-pointer-field");
    expect(landingSource).toContain("onPointerMove={handlePointerMove}");
    expect(landingSource).toContain("impulseRef.current = 1");
    expect(landingSource).toContain("useMotionValueEvent(scrollYProgress");
    expect(sceneSource).toContain("pointerRef.current");
    expect(sceneSource).toContain("progressRef.current");
    expect(sceneSource).toContain("impulseRef.current");
  });

  test("composes systems, proof, and research as continuous cinematic chapters", () => {
    expect(chapterSource).toContain('data-cstd-chapter="systems"');
    expect(chapterSource).toContain('data-cstd-chapter="proof"');
    expect(chapterSource).toContain('data-cstd-chapter="path"');
    expect(chapterSource).toContain("data-cstd-system={system.id}");
    expect(chapterSource).toContain("data-cstd-proof={proof.projectId}");
    expect(chapterSource).toContain("data-cstd-project-plane={proof.projectId}");
    expect(chapterSource).toContain("data-cstd-learning-step={entry.year}");
    expect(chapterSource).toContain("data-cstd-research-state={activeYear}");
  });

  test("keeps live product links behind the shared external-link policy", () => {
    expect(chapterSource).toContain("const targetProps = getCstdLinkTargetProps(project.href);");
    expect(chapterSource).toContain("{...targetProps}");
    expect(sceneSource).toContain('data-cstd-render-quality={quality}');
    expect(sceneSource).toContain("data-cstd-render-ready={renderReady}");
    expect(sceneSource).toContain('data-cstd-render-fallback={contextLost ? "true" : "false"}');
    expect(sceneSource).toContain('addEventListener("webglcontextlost"');
    expect(sceneSource).toContain("softwareRendererPattern");
  });

  test("defaults to full motion and keeps an explicit calm visual fallback", () => {
    expect(landingSource).toContain("useSyncExternalStore(");
    expect(landingSource).toContain('return "full";');
    expect(landingSource).not.toContain("prefers-reduced-motion: reduce");
    expect(landingSource).toContain("data-cstd-motion-toggle");
    expect(chapterSource).toContain('data-cstd-path-mode="vertical"');
    expect(landingSource).not.toContain("min-h-[420svh]");
    expect(landingSource).not.toContain("w-[400vw]");
    expect(landingSource).not.toContain("will-change-transform");
    expect(landingSource).toContain("reducedMotion={reducedMotion}");
    expect(landingSource).toContain('src="/cstd-world/cstd-kinetic-studio-v2.webp"');
    expect(sceneSource).toContain('data-cstd-render-active={props.active ? "true" : "false"}');
    expect(sceneSource).toContain('frameloop={props.active && quality === "full" ? "always" : "demand"}');
    expect(sceneSource).toContain('dpr={quality === "full" ? [1, 1.25] : 1}');
    expect(sceneSource).toContain('{props.quality === "full" ? (');
    expect(landingSource).toContain(
      'active: documentVisible && (activeChapter === "hero" || activeChapter === "systems")',
    );
    expect(chapterSource).toContain('loading="lazy"');
  });

  test("defers animation and WebGL enhancements behind the static first paint", () => {
    expect(landingSource).toContain('from "framer-motion/m"');
    expect(landingSource).toContain("<LazyMotion");
    expect(landingSource).toContain('import("./motion-features")');
    expect(landingSource).toContain("requestIdleCallback");
    expect(landingSource).toContain("data-cstd-enhancements-ready");
    expect(landingSource).not.toContain("<motion.");
    expect(sceneSource).toContain("<ProgressiveArchiveLayer");
  });

  test("does not restore portfolio utility workflows", () => {
    expect(landingSource).not.toContain("ProjectShowcase");
    expect(landingSource).not.toContain("ShowcaseIndex");
    expect(landingSource).not.toContain("project-directory");
    expect(landingSource).not.toContain("project-comparison");
    expect(landingSource).not.toContain("project-guide");
    expect(landingSource).not.toContain('role="dialog"');
  });
});
