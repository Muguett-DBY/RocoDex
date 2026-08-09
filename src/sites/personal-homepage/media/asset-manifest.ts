import type { CstdSceneId } from "../experience/scene-manifest";

export type CstdVisualAsset = {
  id: string;
  sceneId: CstdSceneId;
  src: string;
  alt: string;
  position: string;
  priority?: boolean;
};

export const cstdVisualAssets = [
  {
    id: "neural-gate",
    sceneId: "hero",
    src: "/cstd-universe/cstd-neural-foundry-v2.webp",
    alt: "由工程图、树脂电路与光纤汇入的神经工业入口",
    position: "58% center",
    priority: true,
  },
  {
    id: "skill-reactor",
    sceneId: "systems",
    src: "/cstd-universe/cstd-skill-reactor-v1.webp",
    alt: "由五个工程区域汇入中央计算核心的技能反应堆",
    position: "center center",
  },
  {
    id: "broadcast-nexus",
    sceneId: "proof",
    src: "/cstd-universe/cstd-evidence-foundry-v2.webp",
    alt: "四座可执行证据舱围绕验证核心运行的证据铸造厂",
    position: "58% center",
  },
  {
    id: "operator-workstation",
    sceneId: "operator",
    src: "/cstd-universe/cstd-night-workstation-v1.webp",
    alt: "Night Runner 面向城市网络的夜间工程工作台",
    position: "center center",
  },
  {
    id: "data-vault",
    sceneId: "path",
    src: "/cstd-universe/cstd-knowledge-loom-v2.webp",
    alt: "将技术档案、数据纤维与证据图谱织合的知识织机",
    position: "42% center",
  },
  {
    id: "departure-city",
    sceneId: "finale",
    src: "/cstd-universe/cstd-departure-city-v1.webp",
    alt: "五个技术区域持续连通的雨夜城市离场全景",
    position: "center center",
  },
] as const satisfies readonly CstdVisualAsset[];

export const cstdVisualAssetByScene = Object.fromEntries(
  cstdVisualAssets.map((asset) => [asset.sceneId, asset]),
) as Record<CstdSceneId, CstdVisualAsset>;

export type CstdBroadcastId = "rocodex" | "alpha" | "crm";

export const cstdBroadcasts = {
  rocodex: {
    webm: "/cstd-broadcasts/rocodex-broadcast-v1.webm",
    mp4: "/cstd-broadcasts/rocodex-broadcast-v1.mp4",
  },
  alpha: {
    webm: "/cstd-broadcasts/alpha-broadcast-v1.webm",
    mp4: "/cstd-broadcasts/alpha-broadcast-v1.mp4",
  },
  crm: {
    webm: "/cstd-broadcasts/crm-broadcast-v1.webm",
    mp4: "/cstd-broadcasts/crm-broadcast-v1.mp4",
  },
} as const satisfies Record<CstdBroadcastId, { webm: string; mp4: string }>;
