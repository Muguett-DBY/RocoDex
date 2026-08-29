import type { LocalizedText } from "../content/content-types";

export const cstdSceneIds = [
  "hero",
  "systems",
  "proof",
  "path",
  "finale",
] as const;

export type CstdSceneId = (typeof cstdSceneIds)[number];

export type CstdCameraFrame = {
  position: readonly [number, number, number];
  target: readonly [number, number, number];
  cityOffset: readonly [number, number, number];
};

export type CstdSceneDefinition = {
  id: CstdSceneId;
  elementId: string;
  index: number;
  label: string;
  title: LocalizedText;
  navLabel: LocalizedText;
  signal: string;
  promise: string;
  accent: string;
  visualId: string;
  shareHref: `#${string}`;
  pauseGpu: boolean;
  transition: {
    axis: "x" | "y" | "z";
    aperture: "iris" | "shutter" | "split";
    durationMs: number;
  };
  camera: {
    from: CstdCameraFrame;
    to: CstdCameraFrame;
  };
};

export const cstdSceneManifest = [
  {
    id: "hero",
    elementId: "top",
    index: 0,
    label: "Custard / identity",
    title: { zh: "身份信号", en: "Identity signal" },
    navLabel: { zh: "信号", en: "Signal" },
    signal: "CUSTARD ONLINE",
    promise: "MEET THE BUILDER",
    accent: "#f4d431",
    visualId: "neural-gate",
    shareHref: "#top",
    pauseGpu: false,
    transition: { axis: "z", aperture: "iris", durationMs: 920 },
    camera: {
      from: { position: [-0.18, 0.16, 7.6], target: [0, 0, -0.2], cityOffset: [1.6, -2.7, -1.7] },
      to: { position: [0.18, 0.34, 5.85], target: [0.1, 0.02, -0.7], cityOffset: [0.72, -1.96, -0.72] },
    },
  },
  {
    id: "systems",
    elementId: "systems",
    index: 1,
    label: "CSTD Core",
    title: { zh: "系统核心", en: "Systems core" },
    navLabel: { zh: "系统", en: "Systems" },
    signal: "FIVE CAPABILITY DISTRICTS",
    promise: "READ THE CAPABILITY MAP",
    accent: "#24e0ff",
    visualId: "skill-reactor",
    shareHref: "#systems",
    pauseGpu: false,
    transition: { axis: "x", aperture: "split", durationMs: 760 },
    camera: {
      from: { position: [0.18, 0.34, 5.85], target: [0.1, 0.02, -0.7], cityOffset: [0.72, -1.96, -0.72] },
      to: { position: [-0.72, 0.72, 6.45], target: [-0.18, 0.1, -1.2], cityOffset: [-0.12, -1.72, -1.45] },
    },
  },
  {
    id: "proof",
    elementId: "proof",
    index: 2,
    label: "Shipped systems + executable evidence",
    title: { zh: "作品与证据", en: "Work and evidence" },
    navLabel: { zh: "证据", en: "Evidence" },
    signal: "EVIDENCE CHAIN + REPLAY ONLINE",
    promise: "INSPECT AND RUN THE PROOF",
    accent: "#f4d431",
    visualId: "broadcast-nexus",
    shareHref: "#proof",
    pauseGpu: true,
    transition: { axis: "x", aperture: "shutter", durationMs: 820 },
    camera: {
      from: { position: [-0.72, 0.72, 6.45], target: [-0.18, 0.1, -1.2], cityOffset: [-0.12, -1.72, -1.45] },
      to: { position: [-0.22, 0.18, 7.0], target: [-0.36, 0.08, -1.35], cityOffset: [1.22, -2.34, -1.8] },
    },
  },
  {
    id: "path",
    elementId: "path",
    index: 3,
    label: "Knowledge paths",
    title: { zh: "技术札记", en: "Technical notes" },
    navLabel: { zh: "知识", en: "Knowledge" },
    signal: "EVIDENCE PATH RESOLVED",
    promise: "FOLLOW THE JUDGMENT",
    accent: "#3dff8f",
    visualId: "data-vault",
    shareHref: "#path",
    pauseGpu: true,
    transition: { axis: "y", aperture: "split", durationMs: 880 },
    camera: {
      from: { position: [-0.22, 0.18, 7.0], target: [-0.36, 0.08, -1.35], cityOffset: [1.22, -2.34, -1.8] },
      to: { position: [0.12, 0.92, 6.7], target: [0, 0.24, -1.7], cityOffset: [0.08, -1.66, -2.15] },
    },
  },
  {
    id: "finale",
    elementId: "cstd-footer",
    index: 4,
    label: "Open channel",
    title: { zh: "开放联络", en: "Open channel" },
    navLabel: { zh: "联络", en: "Dispatch" },
    signal: "SIGNAL REMAINS OPEN",
    promise: "CONTINUE THE CONVERSATION",
    accent: "#f4d431",
    visualId: "departure-city",
    shareHref: "#cstd-footer",
    pauseGpu: true,
    transition: { axis: "z", aperture: "shutter", durationMs: 1040 },
    camera: {
      from: { position: [0.12, 0.92, 6.7], target: [0, 0.24, -1.7], cityOffset: [0.08, -1.66, -2.15] },
      to: { position: [0.02, 2.35, 8.25], target: [0, -0.15, -2.1], cityOffset: [0, -2.55, -2.75] },
    },
  },
] as const satisfies readonly CstdSceneDefinition[];

export const cstdSceneById = Object.fromEntries(
  cstdSceneManifest.map((scene) => [scene.id, scene]),
) as unknown as Record<CstdSceneId, CstdSceneDefinition>;

export function getCstdSceneWindow(activeSceneId: CstdSceneId) {
  const activeIndex = cstdSceneById[activeSceneId].index;
  return cstdSceneManifest.filter((scene) => Math.abs(scene.index - activeIndex) <= 1);
}

export function getCstdSceneFromHash(hash: string) {
  const elementId = hash.replace(/^#/, "");
  const directScene = cstdSceneManifest.find((scene) => scene.elementId === elementId);
  if (directScene) return directScene;
  if (elementId === "operator") return cstdSceneById.proof;
  return undefined;
}
