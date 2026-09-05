import { cstdSceneManifest } from "../experience/scene-manifest";
import { cstdPerformanceContract } from "./performance-contract";
import { CSTD_RELEASE } from "./release";

export const cstdExperienceContract = {
  schemaVersion: 2,
  release: CSTD_RELEASE,
  identity: {
    zh: "奶黄包",
    en: "Custard",
    role: "DATA SCIENCE POSTGRADUATE / ANALYSIS THAT SHIPS",
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
    "neon-district": "breach-scan-extract",
    "underworld-forge": "choose-boon-descend-return",
    "astral-covenant": "gather-roll-inscribe",
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
