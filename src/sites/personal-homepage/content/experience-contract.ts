import { cstdSceneManifest } from "../experience/scene-manifest";
import { cstdPerformanceContract } from "./performance-contract";

export const cstdExperienceContract = {
  schemaVersion: 2,
  release: "CSTD-17.0",
  identity: {
    zh: "奶黄包",
    en: "Custard",
    role: "PRODUCT ENGINEER / CREATIVE SYSTEMS BUILDER",
    systemCodename: "CSTD://PERSONAL ENGINEERING UNIVERSE",
  },
  acts: cstdSceneManifest.map((scene) => ({
    id: scene.id,
    number: String(scene.index + 1).padStart(2, "0"),
    zh: scene.title.zh,
    en: scene.title.en,
    promise: scene.promise,
  })),
  viewingDepths: [
    { id: "signal", seconds: 10, destination: "#proof" },
    { id: "tour", seconds: 60, destination: "#systems" },
    { id: "archive", seconds: 300, destination: "/work" },
  ],
  motionLayers: ["ambient", "narrative", "interactive"] as const,
  themeGrammars: {
    "neon-district": "scan-trace-execute",
    "ink-protocol": "unfurl-follow-seal",
    "press-room": "select-source-correct",
    "pixel-quest": "choose-route-clear",
    "underworld-forge": "descend-forge-return",
  } as const,
  runtime: {
    progressiveOrder: cstdPerformanceContract.delivery.runtimeFallbackOrder,
    initialJavaScriptBytes: cstdPerformanceContract.budgets.initialJavascriptBytes,
    startupJavaScriptBytes: cstdPerformanceContract.budgets.startupJavascriptBytes,
    sceneAssetBytes: cstdPerformanceContract.budgets.sceneAssetBytes,
    desktopLcpMilliseconds: cstdPerformanceContract.budgets.desktopLcpMilliseconds,
    mobileLcpMilliseconds: cstdPerformanceContract.budgets.mobileLcpMilliseconds,
    inpMilliseconds: cstdPerformanceContract.budgets.inpMilliseconds,
    cls: cstdPerformanceContract.budgets.cls,
    highTierFramesPerSecond: cstdPerformanceContract.budgets.highTierFramesPerSecond,
  },
  principles: [
    "identity-before-interface",
    "interaction-reveals-proof",
    "normal-document-scroll",
    "progressive-visual-runtime",
    "anonymous-bounded-telemetry",
  ] as const,
} as const;

export type CstdExperienceContract = typeof cstdExperienceContract;
