import type { CstdThemeId } from "../experience/theme-store";

export const voxelBlockKinds = ["turf", "soil", "stone", "timber", "crystal"] as const;

export type VoxelBlockKind = (typeof voxelBlockKinds)[number];
export type VoxelCoordinate = readonly [x: number, y: number, z: number];
export type VoxelWorld = {
  seed: number;
  shards: number;
  blocks: Map<string, VoxelBlockKind>;
};

export type VoxelWorldSnapshot = {
  version: 1;
  theme: CstdThemeId;
  seed: number;
  shards: number;
  blocks: Array<[number, number, number, VoxelBlockKind]>;
};

const worldRadius = 11;
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

function terrainHeight(seed: number, x: number, z: number) {
  const broad = Math.sin((x + seed % 17) * 0.34) + Math.cos((z - seed % 13) * 0.29);
  const ridge = Math.sin((x + z) * 0.18 + seed * 0.0017);
  const detail = hash2(seed, x, z) - 0.5;
  return Math.max(2, Math.min(8, Math.round(4.2 + broad * 0.9 + ridge * 0.75 + detail * 1.4)));
}

function setBlock(blocks: Map<string, VoxelBlockKind>, coordinate: VoxelCoordinate, kind: VoxelBlockKind) {
  blocks.set(voxelKey(...coordinate), kind);
}

function buildColumn(blocks: Map<string, VoxelBlockKind>, x: number, z: number, baseY: number, height: number, kind: VoxelBlockKind) {
  for (let offset = 1; offset <= height; offset += 1) setBlock(blocks, [x, baseY + offset, z], kind);
}

function addNeonLandmarks(blocks: Map<string, VoxelBlockKind>, surface: Map<string, number>) {
  for (const [x, z] of [[-8, -8], [8, -8], [-8, 8], [8, 8]] as const) {
    const baseY = surface.get(`${x},${z}`) ?? 4;
    buildColumn(blocks, x, z, baseY, 5, "timber");
    setBlock(blocks, [x, baseY + 3, z], "crystal");
    setBlock(blocks, [x, baseY + 6, z], "crystal");
  }
}

function addUnderworldLandmarks(blocks: Map<string, VoxelBlockKind>, surface: Map<string, number>) {
  for (const [x, z] of [[0, -7], [5, -5], [7, 0], [5, 5], [0, 7], [-5, 5], [-7, 0], [-5, -5]] as const) {
    const baseY = surface.get(`${x},${z}`) ?? 4;
    buildColumn(blocks, x, z, baseY, 3, "stone");
    setBlock(blocks, [x, baseY + 4, z], "crystal");
  }
  const altarY = (surface.get("0,0") ?? 4) + 1;
  for (let x = -2; x <= 2; x += 1) {
    for (let z = -2; z <= 2; z += 1) {
      if (Math.abs(x) === 2 || Math.abs(z) === 2) setBlock(blocks, [x, altarY, z], "timber");
    }
  }
  setBlock(blocks, [0, altarY + 1, 0], "crystal");
}

function addAstralLandmarks(blocks: Map<string, VoxelBlockKind>) {
  const center: VoxelCoordinate = [7, 12, -7];
  for (let x = -3; x <= 3; x += 1) {
    for (let z = -3; z <= 3; z += 1) {
      const distance = Math.abs(x) + Math.abs(z);
      if (distance > 4) continue;
      setBlock(blocks, [center[0] + x, center[1], center[2] + z], distance < 3 ? "turf" : "stone");
      if (distance < 2) setBlock(blocks, [center[0] + x, center[1] - 1, center[2] + z], "soil");
    }
  }
  buildColumn(blocks, center[0], center[2], center[1], 3, "timber");
  setBlock(blocks, [center[0], center[1] + 4, center[2]], "crystal");
}

export function createVoxelWorld(theme: CstdThemeId, seed: number): VoxelWorld {
  const normalizedSeed = Math.abs(Math.trunc(seed)) || 1;
  const blocks = new Map<string, VoxelBlockKind>();
  const surface = new Map<string, number>();

  for (let x = -worldRadius; x <= worldRadius; x += 1) {
    for (let z = -worldRadius; z <= worldRadius; z += 1) {
      const height = terrainHeight(normalizedSeed, x, z);
      surface.set(`${x},${z}`, height);
      for (let y = 0; y <= height; y += 1) {
        const kind: VoxelBlockKind = y === height ? "turf" : y >= height - 2 ? "soil" : "stone";
        setBlock(blocks, [x, y, z], kind);
      }

      const feature = hash2(normalizedSeed + 71, x, z);
      if (feature > 0.987 && Math.abs(x) < 9 && Math.abs(z) < 9) {
        buildColumn(blocks, x, z, height, 2 + Math.floor(hash2(normalizedSeed + 99, x, z) * 2), "timber");
        setBlock(blocks, [x, height + 3, z], "crystal");
      } else if (feature > 0.972) {
        setBlock(blocks, [x, height + 1, z], "crystal");
      }
    }
  }

  if (theme === "neon-district") addNeonLandmarks(blocks, surface);
  if (theme === "underworld-forge") addUnderworldLandmarks(blocks, surface);
  if (theme === "astral-covenant") addAstralLandmarks(blocks);

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
    version: 1,
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
    if (parsed.version !== 1 || parsed.theme !== theme || typeof parsed.seed !== "number" || !Number.isInteger(parsed.seed) || typeof parsed.shards !== "number" || !Number.isInteger(parsed.shards)) return null;
    if (!Array.isArray(parsed.blocks) || parsed.blocks.length === 0 || parsed.blocks.length > snapshotBlockLimit) return null;
    const blocks: VoxelWorldSnapshot["blocks"] = [];
    for (const entry of parsed.blocks) {
      if (!Array.isArray(entry) || entry.length !== 4) return null;
      const [x, y, z, kind] = entry;
      if (!isEditableVoxelCoordinate([x, y, z]) || typeof kind !== "string" || !blockKinds.has(kind)) return null;
      blocks.push([x, y, z, kind as VoxelBlockKind]);
    }
    return { version: 1, theme, seed: parsed.seed, shards: Math.max(0, parsed.shards), blocks };
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
