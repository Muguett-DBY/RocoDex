import type { CstdSceneId } from "../experience/scene-manifest";
import type { CstdThemeId } from "../experience/theme-store";
import type { CstdLocale, LocalizedText } from "../content/content-types";

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
  { id: "cstd-core-world", src: "/cstd-universe/cstd-core-world-v4.webp", purpose: "homepage-five-act-world" },
  { id: "quiet-archive", src: "/cstd-universe/cstd-quiet-archive-v4.webp", purpose: "knowledge-reading-mode" },
  { id: "engineering-observatory", src: "/cstd-universe/cstd-observatory-core-v3.webp", purpose: "homepage-observatory" },
  { id: "system-blueprint", src: "/cstd-universe/cstd-case-blueprint-v3.webp", purpose: "flagship-case-dossiers" },
  { id: "knowledge-loom", src: "/cstd-universe/cstd-knowledge-loom-v3.webp", purpose: "homepage-knowledge" },
  { id: "method-bench", src: "/cstd-universe/cstd-method-bench-v3.webp", purpose: "homepage-method" },
] as const;

export const cstdThemeWorldAssets = {
  "underworld-forge": "/cstd-themes/underworld-forge-v1.webp",
  "astral-covenant": "/cstd-themes/astral-covenant-v1.webp",
} as const;

export const cstdThemeStageAssets = {
  "neon-district": {
    src: "/cstd-stage/cstd-neon-observatory-v2.webp",
    alt: { zh: "雨夜工程观测舱中的奶油色计算核心", en: "A custard compute core inside a rain-lit engineering observatory" },
    position: "center center",
  },
  "underworld-forge": {
    src: "/cstd-stage/cstd-underworld-forge-v1.webp",
    alt: { zh: "黑曜石冥府工坊中的熔流、金箔壁画与工程制图台", en: "Molten channels, gilded reliefs, and a drafting table inside a basalt underworld forge" },
    position: "center center",
  },
  "astral-covenant": {
    src: "/cstd-stage/cstd-astral-covenant-v1.webp",
    alt: { zh: "星界观测台上的羊皮卷、黄铜天球仪与水晶命运骰", en: "Vellum maps, a brass astrolabe, and a crystal fate die on an astral observatory table" },
    position: "center center",
  },
} as const satisfies Record<CstdThemeId, { src: string; alt: LocalizedText; position: string }>;

export const cstdThemeMaterialAssets = {
  "neon-district": "/cstd-materials/neon-alloy-v1.webp",
  "underworld-forge": "/cstd-materials/underworld-basalt-v1.webp",
  "astral-covenant": "/cstd-materials/astral-vellum-v1.webp",
} as const satisfies Record<CstdThemeId, string>;

export const cstdThemeFontAssets = {
  "neon-district": {
    zh: ["/fonts/cstd/neon-display-v1.woff2"],
    en: ["/fonts/cstd/neon-latin-v1.woff2"],
  },
  "underworld-forge": {
    zh: ["/fonts/cstd/underworld-display-v1.woff2", "/fonts/cstd/press-serif-v1.woff2"],
    en: ["/fonts/cstd/underworld-display-v1.woff2"],
  },
  "astral-covenant": {
    zh: ["/fonts/cstd/astral-display-v1.woff2", "/fonts/cstd/press-serif-v1.woff2"],
    en: ["/fonts/cstd/astral-display-v1.woff2"],
  },
} as const satisfies Record<CstdThemeId, Record<CstdLocale, readonly string[]>>;
