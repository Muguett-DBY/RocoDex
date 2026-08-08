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
    src: "/cstd-universe/cstd-neural-gate-v1.webp",
    alt: "雨夜神经城市入口与延伸至天际线的中央通道",
    position: "center center",
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
    src: "/cstd-universe/cstd-broadcast-nexus-v1.webp",
    alt: "连接真实项目影像的黑金属广播中枢",
    position: "center center",
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
    src: "/cstd-universe/cstd-data-vault-v1.webp",
    alt: "保存研究笔记与数据结构的实体档案室",
    position: "center center",
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
