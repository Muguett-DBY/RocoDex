import type { CstdSceneId } from "../experience/scene-manifest";
import type { CstdThemeId } from "../experience/theme-store";
import type { CstdLocale } from "../content/content-types";

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
    src: "/cstd-universe/cstd-custard-core-v5.webp",
    alt: "奶油白陶瓷计算核心悬浮于深色工程观测舱中",
    position: "68% center",
    priority: true,
  },
  {
    id: "skill-reactor",
    sceneId: "systems",
    src: "/cstd-universe/cstd-core-world-v4.webp",
    alt: "六个工程区域由数据通道连接至中央 CSTD 核心",
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
    src: "/cstd-universe/cstd-quiet-archive-v4.webp",
    alt: "技术笔记、蚀刻玻璃与数据纤维构成的安静知识档案",
    position: "44% center",
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

export const cstdEditorialAssets = [
  { id: "custard-identity-core", src: "/cstd-universe/cstd-custard-core-v5.webp", purpose: "homepage-identity" },
  { id: "cstd-core-world", src: "/cstd-universe/cstd-core-world-v4.webp", purpose: "homepage-six-act-world" },
  { id: "quiet-archive", src: "/cstd-universe/cstd-quiet-archive-v4.webp", purpose: "knowledge-reading-mode" },
  { id: "engineering-observatory", src: "/cstd-universe/cstd-observatory-core-v3.webp", purpose: "homepage-observatory" },
  { id: "system-blueprint", src: "/cstd-universe/cstd-case-blueprint-v3.webp", purpose: "flagship-case-dossiers" },
  { id: "knowledge-loom", src: "/cstd-universe/cstd-knowledge-loom-v3.webp", purpose: "homepage-knowledge" },
  { id: "method-bench", src: "/cstd-universe/cstd-method-bench-v3.webp", purpose: "homepage-method" },
] as const;

export const cstdThemeWorldAssets = {
  "ink-protocol": "/cstd-themes/ink-scroll-v1.webp",
  "press-room": "/cstd-themes/press-room-v1.webp",
  "pixel-quest": "/cstd-themes/pixel-quest-v1.webp",
} as const;

export const cstdThemeMaterialAssets = {
  "neon-district": "/cstd-materials/neon-alloy-v1.webp",
  "ink-protocol": "/cstd-materials/ink-xuan-v1.webp",
  "press-room": "/cstd-materials/press-newsprint-v1.webp",
  "pixel-quest": "/cstd-materials/pixel-circuit-v1.webp",
} as const satisfies Record<CstdThemeId, string>;

export const cstdThemeFontAssets = {
  "neon-district": {
    zh: ["/fonts/cstd/neon-display-v1.woff2"],
    en: ["/fonts/cstd/neon-latin-v1.woff2"],
  },
  "ink-protocol": {
    zh: ["/fonts/cstd/ink-display-v1.woff2", "/fonts/cstd/ink-text-v1.woff2"],
    en: ["/fonts/cstd/ink-latin-v1.woff2", "/fonts/cstd/ink-latin-italic-v1.woff2"],
  },
  "press-room": {
    zh: ["/fonts/cstd/press-latin-v1.woff2", "/fonts/cstd/press-serif-v1.woff2"],
    en: ["/fonts/cstd/press-latin-v1.woff2"],
  },
  "pixel-quest": {
    zh: ["/fonts/cstd/pixel-text-12-v1.woff2", "/fonts/cstd/pixel-label-10-v1.woff2"],
    en: ["/fonts/cstd/pixel-text-12-v1.woff2", "/fonts/cstd/pixel-label-10-v1.woff2"],
  },
} as const satisfies Record<CstdThemeId, Record<CstdLocale, readonly string[]>>;

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
