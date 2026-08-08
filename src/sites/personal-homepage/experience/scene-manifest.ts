export const cstdSceneIds = [
  "hero",
  "systems",
  "proof",
  "operator",
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
  navLabel: string;
  signal: string;
  accent: string;
  visualId: string;
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
    label: "Neural gate",
    navLabel: "入口",
    signal: "ENTER THE CITY",
    accent: "#f4d431",
    visualId: "neural-gate",
    camera: {
      from: { position: [-0.18, 0.16, 7.6], target: [0, 0, -0.2], cityOffset: [1.6, -2.7, -1.7] },
      to: { position: [0.18, 0.34, 5.85], target: [0.1, 0.02, -0.7], cityOffset: [0.72, -1.96, -0.72] },
    },
  },
  {
    id: "systems",
    elementId: "systems",
    index: 1,
    label: "Skill reactor",
    navLabel: "能力",
    signal: "FIVE DISTRICTS ONLINE",
    accent: "#24e0ff",
    visualId: "skill-reactor",
    camera: {
      from: { position: [0.18, 0.34, 5.85], target: [0.1, 0.02, -0.7], cityOffset: [0.72, -1.96, -0.72] },
      to: { position: [-0.72, 0.72, 6.45], target: [-0.18, 0.1, -1.2], cityOffset: [-0.12, -1.72, -1.45] },
    },
  },
  {
    id: "proof",
    elementId: "proof",
    index: 2,
    label: "Broadcast nexus",
    navLabel: "作品",
    signal: "REAL SYSTEMS TRANSMITTING",
    accent: "#f4d431",
    visualId: "broadcast-nexus",
    camera: {
      from: { position: [-0.72, 0.72, 6.45], target: [-0.18, 0.1, -1.2], cityOffset: [-0.12, -1.72, -1.45] },
      to: { position: [0.74, -0.06, 6.05], target: [0.36, -0.12, -1.1], cityOffset: [0.52, -2.05, -0.9] },
    },
  },
  {
    id: "operator",
    elementId: "operator",
    index: 3,
    label: "Operator memory",
    navLabel: "身份",
    signal: "CSTD-01 IDENTIFIED",
    accent: "#ff3b30",
    visualId: "night-runner",
    camera: {
      from: { position: [0.74, -0.06, 6.05], target: [0.36, -0.12, -1.1], cityOffset: [0.52, -2.05, -0.9] },
      to: { position: [-0.22, 0.18, 7.0], target: [-0.36, 0.08, -1.35], cityOffset: [1.22, -2.34, -1.8] },
    },
  },
  {
    id: "path",
    elementId: "path",
    index: 4,
    label: "Research archive",
    navLabel: "路径",
    signal: "MEMORY SHARDS INDEXED",
    accent: "#3dff8f",
    visualId: "data-vault",
    camera: {
      from: { position: [-0.22, 0.18, 7.0], target: [-0.36, 0.08, -1.35], cityOffset: [1.22, -2.34, -1.8] },
      to: { position: [0.12, 0.92, 6.7], target: [0, 0.24, -1.7], cityOffset: [0.08, -1.66, -2.15] },
    },
  },
  {
    id: "finale",
    elementId: "cstd-footer",
    index: 5,
    label: "Departure",
    navLabel: "终章",
    signal: "SIGNAL REMAINS OPEN",
    accent: "#f4d431",
    visualId: "departure-city",
    camera: {
      from: { position: [0.12, 0.92, 6.7], target: [0, 0.24, -1.7], cityOffset: [0.08, -1.66, -2.15] },
      to: { position: [0.02, 2.35, 8.25], target: [0, -0.15, -2.1], cityOffset: [0, -2.55, -2.75] },
    },
  },
] as const satisfies readonly CstdSceneDefinition[];

export const cstdSceneById = Object.fromEntries(
  cstdSceneManifest.map((scene) => [scene.id, scene]),
) as Record<CstdSceneId, CstdSceneDefinition>;

export function getCstdSceneWindow(activeSceneId: CstdSceneId) {
  const activeIndex = cstdSceneById[activeSceneId].index;
  return cstdSceneManifest.filter((scene) => Math.abs(scene.index - activeIndex) <= 1);
}
