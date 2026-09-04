import { CSTD_RELEASE } from "./release";

export const cstdBrandSystem = {
  release: CSTD_RELEASE,
  name: "Neural Industrialism",
  thesis: {
    zh: "把代码、研究与交付证据建造成一座温和而精密的工程城市。",
    en: "Build code, research, and delivery evidence into a warm, precise engineering city.",
  },
  palette: {
    graphite: "#050709",
    paper: "#f2efe7",
    custard: "#f4d431",
    signal: "#24e0ff",
    diagnostic: "#ff3b30",
    verified: "#3dff8f",
  },
  materials: ["black glass", "brushed metal", "amber resin", "technical paper", "optical fiber"],
  motionPrinciples: [
    "Motion explains system state",
    "One continuous world, multiple evidence chambers",
    "GPU work yields to readability and frame budget",
    "Every dramatic surface keeps a static first frame",
  ],
  originalAssets: [
    "/cstd-universe/cstd-custard-core-v4.webp",
    "/cstd-universe/cstd-core-world-v4.webp",
    "/cstd-universe/cstd-quiet-archive-v4.webp",
    "/cstd-universe/cstd-neural-foundry-v2.webp",
    "/cstd-universe/cstd-evidence-foundry-v2.webp",
    "/cstd-universe/cstd-knowledge-loom-v2.webp",
    "/cstd-universe/cstd-observatory-core-v3.webp",
    "/cstd-universe/cstd-case-blueprint-v3.webp",
    "/cstd-universe/cstd-knowledge-loom-v3.webp",
    "/cstd-universe/cstd-method-bench-v3.webp",
  ],
} as const;
