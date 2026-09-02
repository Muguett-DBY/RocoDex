import type { CstdThemeId } from "../experience/theme-store";
import { getVoxelThemeLayout, type VoxelLandmarkSpec } from "./voxel-landmarks";

export const voxelBlockKinds = ["turf", "soil", "stone", "timber", "crystal"] as const;

export type VoxelBlockKind = (typeof voxelBlockKinds)[number];
export type VoxelCoordinate = readonly [x: number, y: number, z: number];
export type VoxelWorld = {
  seed: number;
  shards: number;
  blocks: Map<string, VoxelBlockKind>;
};

export type VoxelWorldSnapshot = {
  version: 2;
  theme: CstdThemeId;
  seed: number;
  shards: number;
  blocks: Array<[number, number, number, VoxelBlockKind]>;
};

const worldRadius = 18;
const coordinateLimit = 40;
const snapshotBlockLimit = 20_000;
const blockKinds = new Set<string>(voxelBlockKinds);
const neighbors: readonly VoxelCoordinate[] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

export function voxelKey(x: number, y: number, z: number) {
  return `${x},${y},${z}`;
}

export function parseVoxelKey(key: string): VoxelCoordinate {
  const [x, y, z] = key.split(",").map(Number);
  return [x ?? 0, y ?? 0, z ?? 0];
}

function hash2(seed: number, x: number, z: number) {
  let value = Math.imul(x + 37, 374_761_393) + Math.imul(z - 19, 668_265_263) + Math.imul(seed, 982_451_653);
  value = Math.imul(value ^ (value >>> 13), 1_274_126_177);
  return ((value ^ (value >>> 16)) >>> 0) / 4_294_967_295;
}

function terrainHeight(theme: CstdThemeId, seed: number, x: number, z: number) {
  const noise = hash2(seed, x, z) - 0.5;
  if (theme === "neon-district") {
    const boulevard = Math.abs(x % 6) <= 1 || Math.abs(z % 6) <= 1;
    return boulevard ? 4 : Math.max(4, Math.min(6, Math.round(4.6 + noise * 1.6)));
  }
  const ridge = Math.sin((x + z) * 0.22 + seed * 0.0017) + Math.cos((x - z) * 0.17);
  const crater = Math.max(0, 1.4 - Math.hypot(x, z) / 8);
  return Math.max(3, Math.min(8, Math.round(4.7 + ridge * 0.75 + noise * 1.7 - crater)));
}

function setBlock(blocks: Map<string, VoxelBlockKind>, coordinate: VoxelCoordinate, kind: VoxelBlockKind) {
  blocks.set(voxelKey(...coordinate), kind);
}

function buildColumn(blocks: Map<string, VoxelBlockKind>, x: number, z: number, baseY: number, height: number, kind: VoxelBlockKind) {
  for (let offset = 1; offset <= height; offset += 1) setBlock(blocks, [x, baseY + offset, z], kind);
}

function getSurfaceHeight(surface: Map<string, number>, x: number, z: number) {
  return surface.get(`${x},${z}`) ?? 4;
}

function getPlatformY(surface: Map<string, number>, centerX: number, centerZ: number, radius: number) {
  let highest = 0;
  for (let x = centerX - radius; x <= centerX + radius; x += 1) {
    for (let z = centerZ - radius; z <= centerZ + radius; z += 1) {
      highest = Math.max(highest, getSurfaceHeight(surface, x, z));
    }
  }
  return highest + 1;
}

function addPlate(
  blocks: Map<string, VoxelBlockKind>,
  centerX: number,
  centerZ: number,
  y: number,
  radius: number,
  kind: VoxelBlockKind,
  diamond = false,
) {
  for (let dx = -radius; dx <= radius; dx += 1) {
    for (let dz = -radius; dz <= radius; dz += 1) {
      if (diamond && Math.abs(dx) + Math.abs(dz) > radius) continue;
      setBlock(blocks, [centerX + dx, y, centerZ + dz], kind);
    }
  }
}

function addPath(
  blocks: Map<string, VoxelBlockKind>,
  surface: Map<string, number>,
  from: readonly [number, number],
  to: readonly [number, number],
  accentEvery: number,
) {
  const steps = Math.max(Math.abs(to[0] - from[0]), Math.abs(to[1] - from[1]));
  for (let step = 0; step <= steps; step += 1) {
    const x = Math.round(from[0] + ((to[0] - from[0]) * step) / steps);
    const z = Math.round(from[1] + ((to[1] - from[1]) * step) / steps);
    const y = getSurfaceHeight(surface, x, z) + 1;
    setBlock(blocks, [x, y, z], step % accentEvery === 0 ? "crystal" : "stone");
  }
}

function addNeonTower(
  blocks: Map<string, VoxelBlockKind>,
  surface: Map<string, number>,
  landmark: VoxelLandmarkSpec,
  index: number,
) {
  const baseY = getPlatformY(surface, landmark.x, landmark.z, 2);
  addPlate(blocks, landmark.x, landmark.z, baseY, 2, "stone");
  const height = 6 + (index % 3) * 2 + (landmark.tier === "archive" ? 2 : 0);

  for (let y = 1; y <= height; y += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dz = -1; dz <= 1; dz += 1) {
        if (Math.abs(dx) !== 1 && Math.abs(dz) !== 1) continue;
        const signalBand = y % 3 === 0 && (dx === 0 || dz === 0);
        setBlock(blocks, [landmark.x + dx, baseY + y, landmark.z + dz], signalBand ? "crystal" : "timber");
      }
    }
  }

  setBlock(blocks, [landmark.x, baseY + height, landmark.z], "stone");
  buildColumn(blocks, landmark.x, landmark.z, baseY + height, 2, "timber");
  setBlock(blocks, [landmark.x, baseY + height + 3, landmark.z], "crystal");
  for (const dx of [-2, 2]) {
    buildColumn(blocks, landmark.x + dx, landmark.z, baseY, 2 + (index % 2), "crystal");
  }
}

function addUnderworldTemple(
  blocks: Map<string, VoxelBlockKind>,
  surface: Map<string, number>,
  landmark: VoxelLandmarkSpec,
  index: number,
) {
  const baseY = getPlatformY(surface, landmark.x, landmark.z, 3);
  addPlate(blocks, landmark.x, landmark.z, baseY, 3, "stone");
  addPlate(blocks, landmark.x, landmark.z, baseY + 1, 2, "timber", true);
  const columnHeight = 4 + (index % 2);

  for (const [dx, dz] of [[-2, -2], [2, -2], [-2, 2], [2, 2]] as const) {
    buildColumn(blocks, landmark.x + dx, landmark.z + dz, baseY, columnHeight, "stone");
    setBlock(blocks, [landmark.x + dx, baseY + columnHeight + 1, landmark.z + dz], "crystal");
  }

  for (let offset = -2; offset <= 2; offset += 1) {
    setBlock(blocks, [landmark.x + offset, baseY + columnHeight, landmark.z - 2], "timber");
    setBlock(blocks, [landmark.x + offset, baseY + columnHeight, landmark.z + 2], "timber");
  }
  buildColumn(blocks, landmark.x, landmark.z, baseY + 1, 2 + (landmark.tier === "archive" ? 1 : 0), "crystal");
}

function addFloatingIsland(
  blocks: Map<string, VoxelBlockKind>,
  surface: Map<string, number>,
  centerX: number,
  centerZ: number,
  topY: number,
  radius: number,
) {
  for (let depth = 0; depth <= 3; depth += 1) {
    const layerRadius = Math.max(1, radius - depth);
    addPlate(blocks, centerX, centerZ, topY - depth, layerRadius, depth === 0 ? "turf" : depth === 1 ? "soil" : "stone", true);
  }
  for (let dx = -radius; dx <= radius; dx += 1) {
    for (let dz = -radius; dz <= radius; dz += 1) {
      if (Math.abs(dx) + Math.abs(dz) <= radius) surface.set(`${centerX + dx},${centerZ + dz}`, topY);
    }
  }
}

function addAstralBridge(
  blocks: Map<string, VoxelBlockKind>,
  from: readonly [number, number, number],
  to: readonly [number, number, number],
) {
  const steps = Math.max(Math.abs(to[0] - from[0]), Math.abs(to[2] - from[2]));
  for (let step = 3; step <= steps - 3; step += 1) {
    const ratio = step / steps;
    const x = Math.round(from[0] + (to[0] - from[0]) * ratio);
    const y = Math.round(from[1] + (to[1] - from[1]) * ratio);
    const z = Math.round(from[2] + (to[2] - from[2]) * ratio);
    setBlock(blocks, [x, y, z], step % 4 === 0 ? "crystal" : "timber");
  }
}

function addAstralShrine(blocks: Map<string, VoxelBlockKind>, landmark: VoxelLandmarkSpec, topY: number, index: number) {
  const columnHeight = 4 + (index % 3);
  for (const dx of [-2, 2]) {
    buildColumn(blocks, landmark.x + dx, landmark.z, topY, columnHeight, "stone");
    setBlock(blocks, [landmark.x + dx, topY + columnHeight + 1, landmark.z], "crystal");
  }
  for (let dx = -2; dx <= 2; dx += 1) {
    setBlock(blocks, [landmark.x + dx, topY + columnHeight, landmark.z], dx === 0 ? "crystal" : "timber");
  }
  buildColumn(blocks, landmark.x, landmark.z, topY, 2 + (landmark.tier === "archive" ? 1 : 0), "crystal");
}

function createGroundedWorld(theme: "neon-district" | "underworld-forge", seed: number) {
  const blocks = new Map<string, VoxelBlockKind>();
  const surface = new Map<string, number>();
  const landmarks = getVoxelThemeLayout(theme).landmarks;

  for (let x = -worldRadius; x <= worldRadius; x += 1) {
    for (let z = -worldRadius; z <= worldRadius; z += 1) {
      const height = terrainHeight(theme, seed, x, z);
      surface.set(`${x},${z}`, height);
      const boulevard = theme === "neon-district" && (Math.abs(x % 6) <= 1 || Math.abs(z % 6) <= 1);
      for (let y = 0; y <= height; y += 1) {
        const kind: VoxelBlockKind = y === height ? (boulevard ? "stone" : "turf") : y >= height - 2 ? "soil" : "stone";
        setBlock(blocks, [x, y, z], kind);
      }

      const nearLandmark = landmarks.some((landmark) => Math.hypot(x - landmark.x, z - landmark.z) < 4.5);
      const feature = hash2(seed + 71, x, z);
      if (!nearLandmark && feature > 0.991 && Math.abs(x) < 17 && Math.abs(z) < 17) {
        const featureHeight = theme === "neon-district" ? 3 : 2;
        buildColumn(blocks, x, z, height, featureHeight, theme === "neon-district" ? "timber" : "stone");
        setBlock(blocks, [x, height + featureHeight + 1, z], "crystal");
      }
    }
  }

  if (theme === "neon-district") {
    landmarks.forEach((entry, index) => {
      addPath(blocks, surface, [0, 0], [entry.x, entry.z], 5);
      addNeonTower(blocks, surface, entry, index);
    });
    const hubY = getPlatformY(surface, 0, 0, 2);
    addPlate(blocks, 0, 0, hubY, 2, "stone");
    buildColumn(blocks, 0, 0, hubY, 4, "crystal");
  } else {
    landmarks.forEach((entry, index) => {
      const next = landmarks[(index + 1) % landmarks.length];
      addPath(blocks, surface, [entry.x, entry.z], [next.x, next.z], 4);
      addUnderworldTemple(blocks, surface, entry, index);
    });
    const altarY = getPlatformY(surface, 0, 0, 3);
    addPlate(blocks, 0, 0, altarY, 3, "stone", true);
    addPlate(blocks, 0, 0, altarY + 1, 1, "timber", true);
    setBlock(blocks, [0, altarY + 2, 0], "crystal");
  }

  return blocks;
}

function createAstralWorld() {
  const blocks = new Map<string, VoxelBlockKind>();
  const surface = new Map<string, number>();
  const landmarks = getVoxelThemeLayout("astral-covenant").landmarks;
  const centerY = 9;
  addFloatingIsland(blocks, surface, 0, 0, centerY, 6);
  addPlate(blocks, 0, 0, centerY + 1, 2, "stone", true);
  buildColumn(blocks, 0, 0, centerY + 1, 3, "crystal");

  landmarks.forEach((entry, index) => {
    const topY = 9 + (index % 3) * 2;
    addFloatingIsland(blocks, surface, entry.x, entry.z, topY, entry.tier === "primary" ? 4 : 3);
    addAstralBridge(blocks, [0, centerY + 1, 0], [entry.x, topY + 1, entry.z]);
    addAstralShrine(blocks, entry, topY, index);
  });
  return blocks;
}

export function createVoxelWorld(theme: CstdThemeId, seed: number): VoxelWorld {
  const normalizedSeed = Math.abs(Math.trunc(seed)) || 1;
  const blocks = theme === "astral-covenant"
    ? createAstralWorld()
    : createGroundedWorld(theme, normalizedSeed);
  return { seed: normalizedSeed, shards: 0, blocks };
}

export function getExposedVoxels(world: VoxelWorld) {
  const exposed: Array<{ coordinate: VoxelCoordinate; kind: VoxelBlockKind }> = [];
  for (const [key, kind] of world.blocks) {
    const coordinate = parseVoxelKey(key);
    const visible = neighbors.some(([dx, dy, dz]) => !world.blocks.has(voxelKey(coordinate[0] + dx, coordinate[1] + dy, coordinate[2] + dz)));
    if (visible) exposed.push({ coordinate, kind });
  }
  return exposed;
}

export function isEditableVoxelCoordinate([x, y, z]: VoxelCoordinate) {
  return Number.isInteger(x)
    && Number.isInteger(y)
    && Number.isInteger(z)
    && Math.abs(x) <= coordinateLimit
    && y >= 0
    && y <= coordinateLimit
    && Math.abs(z) <= coordinateLimit;
}

export function createVoxelSnapshot(world: VoxelWorld, theme: CstdThemeId): VoxelWorldSnapshot {
  return {
    version: 2,
    theme,
    seed: world.seed,
    shards: world.shards,
    blocks: [...world.blocks].map(([key, kind]) => [...parseVoxelKey(key), kind]),
  };
}

export function parseVoxelSnapshot(value: string | null, theme: CstdThemeId): VoxelWorldSnapshot | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<VoxelWorldSnapshot>;
    if (parsed.version !== 2 || parsed.theme !== theme || typeof parsed.seed !== "number" || !Number.isInteger(parsed.seed) || typeof parsed.shards !== "number" || !Number.isInteger(parsed.shards)) return null;
    if (!Array.isArray(parsed.blocks) || parsed.blocks.length === 0 || parsed.blocks.length > snapshotBlockLimit) return null;
    const blocks: VoxelWorldSnapshot["blocks"] = [];
    for (const entry of parsed.blocks) {
      if (!Array.isArray(entry) || entry.length !== 4) return null;
      const [x, y, z, kind] = entry;
      if (!isEditableVoxelCoordinate([x, y, z]) || typeof kind !== "string" || !blockKinds.has(kind)) return null;
      blocks.push([x, y, z, kind as VoxelBlockKind]);
    }
    return { version: 2, theme, seed: parsed.seed, shards: Math.max(0, parsed.shards), blocks };
  } catch {
    return null;
  }
}

export function restoreVoxelWorld(snapshot: VoxelWorldSnapshot): VoxelWorld {
  return {
    seed: snapshot.seed,
    shards: snapshot.shards,
    blocks: new Map(snapshot.blocks.map(([x, y, z, kind]) => [voxelKey(x, y, z), kind])),
  };
}
