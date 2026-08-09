import type { CstdSceneId } from "../experience/scene-manifest";
import { cstdPerformanceContract } from "./performance-contract";

export const cstdExperienceContract = {
  schemaVersion: 1,
  release: "CSTD-17.0",
  identity: {
    zh: "奶黄包",
    en: "Custard",
    role: "PRODUCT ENGINEER / CREATIVE SYSTEMS BUILDER",
    systemCodename: "CSTD://PERSONAL ENGINEERING UNIVERSE",
  },
  acts: [
    { id: "hero", number: "01", zh: "身份入口", en: "Identity gate", promise: "MEET THE BUILDER" },
    { id: "systems", number: "02", zh: "系统核心", en: "CSTD Core", promise: "READ THE CAPABILITY MAP" },
    { id: "proof", number: "03", zh: "真实作品", en: "Shipped systems", promise: "INSPECT THE DECISIONS" },
    { id: "operator", number: "04", zh: "可执行证据", en: "Executable evidence", promise: "RUN THE PROOF" },
    { id: "path", number: "05", zh: "知识路径", en: "Knowledge paths", promise: "FOLLOW THE JUDGMENT" },
    { id: "finale", number: "06", zh: "开放信号", en: "Open channel", promise: "CONTINUE THE CONVERSATION" },
  ] satisfies readonly Readonly<{ id: CstdSceneId; number: string; zh: string; en: string; promise: string }>[],
  runtime: {
    progressiveOrder: cstdPerformanceContract.delivery.runtimeFallbackOrder,
    initialJavaScriptBytes: cstdPerformanceContract.budgets.initialJavascriptBytes,
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
