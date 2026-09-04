import type { CstdThemeId } from "../experience/theme-store";
import { getVoxelThemeLayout, type VoxelExhibitId, type VoxelLandmarkSpec } from "./voxel-landmarks";

export const voxelBlockKinds = ["turf", "soil", "stone", "timber", "crystal", "neon", "magma", "gold"] as const;

export type VoxelBlockKind = (typeof voxelBlockKinds)[number];
export type VoxelCoordinate = readonly [x: number, y: number, z: number];
export type VoxelWorld = {
  seed: number;
  shards: number;
  blocks: Map<string, VoxelBlockKind>;
  base: ReadonlyMap<string, VoxelBlockKind>;
};

export type VoxelWorldSnapshot = {
  version: 3;
  theme: CstdThemeId;
  seed: number;
  shards: number;
  removed: Array<[number, number, number]>;
  added: Array<[number, number, number, VoxelBlockKind]>;
};

const worldRadius = 26;
const coordinateLimit = 64;
const editLimit = 6_000;
const blockKinds = new Set<string>(voxelBlockKinds);

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

function setBlock(blocks: Map<string, VoxelBlockKind>, coordinate: VoxelCoordinate, kind: VoxelBlockKind) {
  blocks.set(voxelKey(...coordinate), kind);
}

function buildColumn(blocks: Map<string, VoxelBlockKind>, x: number, z: number, baseY: number, height: number, kind: VoxelBlockKind) {
  for (let offset = 1; offset <= height; offset += 1) setBlock(blocks, [x, baseY + offset, z], kind);
}

function fillBox(
  blocks: Map<string, VoxelBlockKind>,
  from: readonly [number, number, number],
  to: readonly [number, number, number],
  kind: VoxelBlockKind,
  hollow = false,
) {
  for (let x = from[0]; x <= to[0]; x += 1) {
    for (let y = from[1]; y <= to[1]; y += 1) {
      for (let z = from[2]; z <= to[2]; z += 1) {
        if (hollow && x > from[0] && x < to[0] && y > from[1] && y < to[1] && z > from[2] && z < to[2]) continue;
        setBlock(blocks, [x, y, z], kind);
      }
    }
  }
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

/* ------------------------------------------------------------------ */
/* Night City 2077 — a neon grid metropolis locked in permanent night  */
/* ------------------------------------------------------------------ */

function isNightCityStreet(x: number, z: number) {
  const ring = Math.round(Math.hypot(x, z));
  return Math.abs(x) <= 1 || Math.abs(z) <= 1 || Math.abs(ring - 20) <= 1;
}

function addNightCityTower(
  blocks: Map<string, VoxelBlockKind>,
  landmark: VoxelLandmarkSpec,
  index: number,
) {
  const style = index % 3;
  const baseY = 6;
  const plate = 3;
  addPlate(blocks, landmark.x, landmark.z, baseY, plate, "stone");
  for (let dx = -plate; dx <= plate; dx += 1) {
    for (let dz = -plate; dz <= plate; dz += 1) {
      if ((Math.abs(dx) === plate || Math.abs(dz) === plate) && (dx + dz) % 3 === 0) {
        setBlock(blocks, [landmark.x + dx, baseY + 1, landmark.z + dz], "neon");
      }
    }
  }

  if (style === 0) {
    // Stepped megabuilding with glowing window bands and an antenna mast.
    addPlate(blocks, landmark.x, landmark.z, baseY + 1, 3, "stone");
    const tiers = [[3, 7], [2, 6], [1, 5]] as const;
    tiers.forEach(([radius, height], tierIndex) => {
      const tierBase = baseY + 1 + (tierIndex === 0 ? 0 : tiers.slice(0, tierIndex).reduce((sum, [, tierHeight]) => sum + tierHeight, 0));
      for (let y = 1; y <= height; y += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          for (let dz = -radius; dz <= radius; dz += 1) {
            const edge = Math.abs(dx) === radius || Math.abs(dz) === radius;
            if (!edge) continue;
            const corner = Math.abs(dx) === radius && Math.abs(dz) === radius;
            if (corner) {
              setBlock(blocks, [landmark.x + dx, tierBase + y, landmark.z + dz], "neon");
              continue;
            }
            const window = y % 2 === 0 && (dx === 0 || dz === 0);
            setBlock(blocks, [landmark.x + dx, tierBase + y, landmark.z + dz], window ? "neon" : "timber");
          }
        }
      }
    });
    buildColumn(blocks, landmark.x, landmark.z, baseY + 15, 3, "timber");
    setBlock(blocks, [landmark.x, baseY + 19, landmark.z], "neon");
  } else if (style === 1) {
    // Twin towers with a sky bridge and a neon crown.
    for (const [dx, dz] of [[-2, -1], [2, -1]] as const) {
      for (let y = 1; y <= 9; y += 1) {
        const window = y % 3 === 0;
        setBlock(blocks, [landmark.x + dx, baseY + y, landmark.z + dz], window ? "neon" : "timber");
        setBlock(blocks, [landmark.x + dx, baseY + y, landmark.z + dz + 1], window ? "neon" : "timber");
      }
      setBlock(blocks, [landmark.x + dx, baseY + 10, landmark.z + dz], "gold");
    }
    for (let offset = -1; offset <= 1; offset += 1) {
      setBlock(blocks, [landmark.x + offset, baseY + 8, landmark.z], "neon");
    }
    for (const dz of [-1, 1]) {
      for (let y = 1; y <= 5; y += 1) setBlock(blocks, [landmark.x, baseY + y, landmark.z + dz], "timber");
    }
    setBlock(blocks, [landmark.x, baseY + 6, landmark.z], "neon");
  } else {
    // Billboard wall: a huge glowing display framed in gold, backed by a data block.
    for (let dx = -3; dx <= 3; dx += 1) {
      for (let y = 1; y <= 8; y += 1) {
        const frame = Math.abs(dx) === 3 || y === 1 || y === 8;
        setBlock(blocks, [landmark.x + dx, baseY + y, landmark.z], frame ? "gold" : "neon");
      }
    }
    for (let dz = 1; dz <= 2; dz += 1) {
      for (let dx = -2; dx <= 2; dx += 1) {
        for (let y = 1; y <= 5; y += 1) setBlock(blocks, [landmark.x + dx, baseY + y, landmark.z + dz], y % 3 === 0 ? "neon" : "timber");
      }
    }
    buildColumn(blocks, landmark.x, landmark.z + 3, baseY, 2, "timber");
    setBlock(blocks, [landmark.x, baseY + 3, landmark.z + 3], "crystal");
  }
}

function addNightCityBackdrop(blocks: Map<string, VoxelBlockKind>, seed: number) {
  // Distant skyline silhouettes beyond the ring boulevard sell the metropolis.
  for (let index = 0; index < 42; index += 1) {
    const angle = (index / 42) * Math.PI * 2 + hash2(seed, index, 3) * 0.2;
    const radius = 23 + Math.round(hash2(seed + 5, index, 9) * 2);
    const x = Math.round(Math.cos(angle) * radius);
    const z = Math.round(Math.sin(angle) * radius);
    if (Math.abs(x) > 25 || Math.abs(z) > 25) continue;
    const height = 8 + Math.round(hash2(seed + 11, x, z) * 9);
    const width = hash2(seed + 17, x, z) > 0.55 ? 2 : 1;
    for (let dx = -width; dx <= width; dx += 1) {
      for (let dz = -width; dz <= width; dz += 1) {
        for (let y = 6; y <= 6 + height; y += 1) {
          const window = y % 4 === 0 && hash2(seed + 23, x + dx * y, z + dz) > 0.62;
          setBlock(blocks, [x + dx, y, z + dz], window ? "neon" : "timber");
        }
      }
    }
    setBlock(blocks, [x, 7 + height, z], hash2(seed + 31, x, z) > 0.5 ? "neon" : "gold");
  }
}

function createNightCity(seed: number) {
  const blocks = new Map<string, VoxelBlockKind>();
  const surfaceY = 5;
  const landmarks = getVoxelThemeLayout("neon-district").landmarks;

  for (let x = -worldRadius; x <= worldRadius; x += 1) {
    for (let z = -worldRadius; z <= worldRadius; z += 1) {
      if (Math.hypot(x, z) > worldRadius) continue;
      const street = isNightCityStreet(x, z);
      for (let y = 3; y <= surfaceY; y += 1) {
        const kind: VoxelBlockKind = y === surfaceY ? (street ? "stone" : "soil") : "stone";
        setBlock(blocks, [x, y, z], kind);
      }
      if (street) {
        const lane = (Math.abs(x) <= 1 ? z : x) % 5 === 0;
        if (lane) setBlock(blocks, [x, surfaceY + 1, z], "neon");
      }
    }
  }

  // Mid-block filler towers between the exhibit plazas keep the city dense.
  for (let x = -worldRadius; x <= worldRadius; x += 1) {
    for (let z = -worldRadius; z <= worldRadius; z += 1) {
      if (Math.hypot(x, z) > worldRadius - 3 || isNightCityStreet(x, z)) continue;
      const nearLandmark = landmarks.some((entry) => Math.hypot(x - entry.x, z - entry.z) < 6.5);
      if (nearLandmark) continue;
      const roll = hash2(seed + 41, Math.floor(x / 3), Math.floor(z / 3));
      if (roll <= 0.82) continue;
      const anchorX = Math.floor(x / 3) * 3;
      const anchorZ = Math.floor(z / 3) * 3;
      if (anchorX !== x || anchorZ !== z) continue;
      const touchesStreet = [anchorX, anchorX + 1].some((cx) => [anchorZ, anchorZ + 1].some((cz) => isNightCityStreet(cx, cz)));
      if (touchesStreet) continue;
      const height = 4 + Math.round(hash2(seed + 43, anchorX, anchorZ) * 8);
      for (let dx = 0; dx <= 1; dx += 1) {
        for (let dz = 0; dz <= 1; dz += 1) {
          for (let y = 1; y <= height; y += 1) {
            setBlock(blocks, [anchorX + dx, surfaceY + y, anchorZ + dz], y % 3 === 0 ? "neon" : "timber");
          }
        }
      }
      setBlock(blocks, [anchorX, surfaceY + height + 1, anchorZ], "crystal");
    }
  }

  landmarks.forEach((entry, index) => addNightCityTower(blocks, entry, index));
  addNightCityBackdrop(blocks, seed);

  // Central plaza monolith marks the world hub.
  fillBox(blocks, [-1, 6, -1], [1, 15, 1], "timber", true);
  for (let y = 6; y <= 15; y += 2) {
    setBlock(blocks, [0, y, 0], "neon");
  }
  addPlate(blocks, 0, 0, 6, 3, "stone");
  addPlate(blocks, 0, 0, 6, 4, "crystal");

  return blocks;
}

/* ------------------------------------------------------------------ */
/* The underworld — obsidian karst split by lava rivers and shrines    */
/* ------------------------------------------------------------------ */

function isLavaChannel(x: number, z: number) {
  const riverA = Math.abs(z - 7 * Math.sin(x * 0.22 + 1.2));
  const riverB = Math.abs(x - 9 * Math.sin(z * 0.19 - 0.7) - 18);
  return riverA <= 2.2 || riverB <= 2.2;
}

function terrainNoise(seed: number, x: number, z: number) {
  const coarse = Math.sin((x + z) * 0.16 + seed * 0.0017) + Math.cos((x - z) * 0.13);
  const detail = hash2(seed, x, z) - 0.5;
  return coarse * 1.1 + detail * 2.2;
}

function createUnderworld(seed: number) {
  const blocks = new Map<string, VoxelBlockKind>();
  const landmarks = getVoxelThemeLayout("underworld-forge").landmarks;

  for (let x = -worldRadius; x <= worldRadius; x += 1) {
    for (let z = -worldRadius; z <= worldRadius; z += 1) {
      if (Math.hypot(x, z) > worldRadius) continue;
      const nearShrine = landmarks.some((entry) => Math.hypot(x - entry.x, z - entry.z) < 4.5);
      const lava = isLavaChannel(x, z) && !nearShrine;
      const height = lava ? 3 : Math.max(4, Math.min(9, Math.round(5.4 + terrainNoise(seed, x, z))));
      for (let y = 2; y <= height; y += 1) {
        const kind: VoxelBlockKind = y === height ? (lava ? "magma" : height >= 8 ? "stone" : "turf") : y >= height - 1 ? "soil" : "stone";
        setBlock(blocks, [x, y, z], kind);
      }
      if (!lava && height <= 4 && hash2(seed + 53, x, z) > 0.965) {
        setBlock(blocks, [x, height + 1, z], "magma");
      }
    }
  }

  // The great temple: a colonnaded hall with a gold pediment above the crossing.
  const templeBase = 8;
  addPlate(blocks, 0, 0, templeBase, 5, "stone");
  addPlate(blocks, 0, 0, templeBase + 1, 4, "stone");
  const columnHeight = 6;
  for (const offset of [-4, -2, 0, 2, 4]) {
    for (const side of [-4, 4]) {
      buildColumn(blocks, offset, side, templeBase + 1, columnHeight, "timber");
      setBlock(blocks, [offset, templeBase + columnHeight + 2, side], "gold");
      buildColumn(blocks, side, offset, templeBase + 1, columnHeight, "timber");
      setBlock(blocks, [side, templeBase + columnHeight + 2, offset], "gold");
    }
  }
  for (let offset = -4; offset <= 4; offset += 1) {
    fillBox(blocks, [offset, templeBase + columnHeight + 1, -4], [offset, templeBase + columnHeight + 1, 4], "timber");
  }
  fillBox(blocks, [-2, templeBase + columnHeight + 2, -2], [2, templeBase + columnHeight + 3, 2], "gold", true);
  setBlock(blocks, [0, templeBase + columnHeight + 4, 0], "magma");
  for (const [dx, dz] of [[-5, -5], [5, -5], [-5, 5], [5, 5]] as const) {
    buildColumn(blocks, dx, dz, templeBase + 1, 2, "stone");
    setBlock(blocks, [dx, templeBase + 4, dz], "magma");
  }

  // Exhibit shrines: broken columns, a brazier pedestal, and gold laurels.
  landmarks.forEach((entry, index) => {
    const surface = Math.max(4, Math.min(9, Math.round(5.4 + terrainNoise(seed, entry.x, entry.z))));
    const baseY = surface + 1;
    addPlate(blocks, entry.x, entry.z, baseY, 3, "stone");
    const columnHeight = 3 + (index % 2);
    for (const [dx, dz] of [[-2, -2], [2, -2], [-2, 2], [2, 2]] as const) {
      buildColumn(blocks, entry.x + dx, entry.z + dz, baseY, columnHeight, "stone");
      setBlock(blocks, [entry.x + dx, baseY + columnHeight + 1, entry.z + dz], index % 2 === 0 ? "gold" : "crystal");
    }
    for (let offset = -2; offset <= 2; offset += 1) {
      setBlock(blocks, [entry.x + offset, baseY + columnHeight + 1, entry.z - 2], "timber");
      setBlock(blocks, [entry.x + offset, baseY + columnHeight + 1, entry.z + 2], "timber");
    }
    buildColumn(blocks, entry.x, entry.z, baseY, 2, "stone");
    setBlock(blocks, [entry.x, baseY + 3, entry.z], "magma");
    const relic = entry.tier === "archive" ? 5 : 7;
    buildColumn(blocks, entry.x, entry.z, baseY + 3, relic - 3, "crystal");
  });

  return blocks;
}

/* ------------------------------------------------------------------ */
/* The astral isles — floating shrine islands over a luminous abyss    */
/* ------------------------------------------------------------------ */

const astralIslandHeights: Record<VoxelExhibitId, number> = {
  "alpha-research-system": 13,
  "cfzzs-crm": 12,
  "creative-workbench": 9,
  "dcf-quantum": 12,
  "portrait-booking": 9,
  "rocodex-platform": 14,
  "notes-archive": 11,
  "lab-foundry": 15,
};

function addAstralIsland(
  blocks: Map<string, VoxelBlockKind>,
  centerX: number,
  centerZ: number,
  topY: number,
  radius: number,
  seed: number,
) {
  const depth = radius + 2;
  for (let layer = 0; layer <= depth; layer += 1) {
    const layerRadius = Math.max(0, radius - Math.round(layer * 0.9));
    if (layerRadius < 0) break;
    const kind: VoxelBlockKind = layer === 0 ? "turf" : layer === 1 ? "soil" : "stone";
    for (let dx = -layerRadius; dx <= layerRadius; dx += 1) {
      for (let dz = -layerRadius; dz <= layerRadius; dz += 1) {
        const distance = Math.hypot(dx, dz);
        if (distance > layerRadius + hash2(seed + layer, centerX + dx, centerZ + dz) - 0.4) continue;
        if (layer > 0 && hash2(seed + 61 + layer, centerX + dx, centerZ + dz + layer) < 0.22) continue;
        setBlock(blocks, [centerX + dx, topY - layer, centerZ + dz], kind);
      }
    }
  }
  // Crystal stalactites hang beneath the island and catch the abyss light.
  for (let index = 0; index < Math.ceil(radius * 1.5); index += 1) {
    const angle = hash2(seed + 71, centerX + index, centerZ) * Math.PI * 2;
    const distance = hash2(seed + 73, index, centerZ) * (radius - 1);
    const x = Math.round(centerX + Math.cos(angle) * distance);
    const z = Math.round(centerZ + Math.sin(angle) * distance);
    const length = 1 + Math.round(hash2(seed + 79, x, z) * 3);
    for (let drop = 1; drop <= length; drop += 1) {
      if (blocks.has(voxelKey(x, topY - radius - 1 - drop, z))) continue;
      setBlock(blocks, [x, topY - radius - 1 - drop, z], drop === length ? "crystal" : "stone");
    }
  }
}

function addAstralBridge(blocks: Map<string, VoxelBlockKind>, from: readonly [number, number, number], to: readonly [number, number, number]) {
  const steps = Math.max(Math.abs(to[0] - from[0]), Math.abs(to[2] - from[2]));
  for (let step = 2; step <= steps - 2; step += 1) {
    const ratio = step / steps;
    const x = Math.round(from[0] + (to[0] - from[0]) * ratio);
    const y = Math.round(from[1] + (to[1] - from[1]) * ratio);
    const z = Math.round(from[2] + (to[2] - from[2]) * ratio);
    setBlock(blocks, [x, y, z], step % 4 === 0 ? "gold" : "stone");
    if (step % 3 === 0) {
      setBlock(blocks, [x, y + 1, z], "timber");
      if (step % 6 === 0) setBlock(blocks, [x, y + 2, z], "neon");
    }
  }
}

function addAstralShrine(blocks: Map<string, VoxelBlockKind>, landmark: VoxelLandmarkSpec, topY: number, index: number) {
  const columnHeight = 4 + (index % 2);
  addPlate(blocks, landmark.x, landmark.z, topY + 1, 3, "stone");
  addPlate(blocks, landmark.x, landmark.z, topY + 1, 4, "gold");
  for (const [dx, dz] of [[-3, -2], [3, -2], [-3, 2], [3, 2]] as const) {
    buildColumn(blocks, landmark.x + dx, landmark.z + dz, topY + 1, columnHeight, "timber");
    setBlock(blocks, [landmark.x + dx, topY + columnHeight + 2, landmark.z + dz], "gold");
  }
  for (const dz of [-2, 2]) {
    for (let dx = -2; dx <= 2; dx += 1) {
      setBlock(blocks, [landmark.x + dx, topY + columnHeight + 1, landmark.z + dz], dx % 2 === 0 ? "timber" : "neon");
    }
  }
  buildColumn(blocks, landmark.x, landmark.z, topY + 1, 1, "stone");
  setBlock(blocks, [landmark.x, topY + 2, landmark.z], "crystal");
  for (const [dx, dz] of [[0, -2], [-2, 0], [2, 0], [0, 2]] as const) {
    setBlock(blocks, [landmark.x + dx, topY + 1, landmark.z + dz], "neon");
  }
}

function createAstralIsles(seed: number) {
  const blocks = new Map<string, VoxelBlockKind>();
  const landmarks = getVoxelThemeLayout("astral-covenant").landmarks;
  const hubY = 11;

  addAstralIsland(blocks, 0, 0, hubY, 9, seed);
  addPlate(blocks, 0, 0, hubY + 1, 3, "stone");
  for (const [dx, dz] of [[-3, -3], [3, -3], [-3, 3], [3, 3]] as const) {
    buildColumn(blocks, dx, dz, hubY + 1, 3, "timber");
    setBlock(blocks, [dx, hubY + 5, dz], "neon");
  }
  fillBox(blocks, [-1, hubY + 1, -1], [1, hubY + 1, 1], "gold");
  setBlock(blocks, [0, hubY + 2, 0], "crystal");
  for (const [dx, dz] of [[0, -2], [-2, 0], [2, 0], [0, 2]] as const) {
    setBlock(blocks, [dx, hubY + 1, dz], "neon");
  }

  landmarks.forEach((entry, index) => {
    const topY = astralIslandHeights[entry.id];
    const radius = entry.tier === "primary" ? 5 : 4;
    addAstralIsland(blocks, entry.x, entry.z, topY, radius, seed + index * 13);
    const from: readonly [number, number, number] = [Math.round(entry.x * 0.42), hubY + 1, Math.round(entry.z * 0.42)];
    addAstralBridge(blocks, from, [entry.x, topY + 1, entry.z]);
    addAstralShrine(blocks, entry, topY, index);
  });

  // A chain of stepping-stone isles circles the archipelago.
  for (let index = 0; index < 10; index += 1) {
    const angle = (index / 10) * Math.PI * 2 + 0.31;
    const radius = 21 + (index % 3);
    const x = Math.round(Math.cos(angle) * radius);
    const z = Math.round(Math.sin(angle) * radius);
    addAstralIsland(blocks, x, z, 8 + (index % 5) * 2, 2, seed + 200 + index * 7);
    setBlock(blocks, [x, 10 + (index % 5) * 2, z], "crystal");
  }

  return blocks;
}

function clearSpawnPocket(blocks: Map<string, VoxelBlockKind>, theme: CstdThemeId) {
  if (theme === "astral-covenant") return; // the hub island is already clear
  const [spawnX, spawnZ] = getVoxelThemeLayout(theme).spawn;
  const groundY = theme === "neon-district" ? 5 : 9; // highest natural terrain step
  for (let dx = -2; dx <= 2; dx += 1) {
    for (let dz = -2; dz <= 2; dz += 1) {
      for (let y = groundY + 1; y <= 48; y += 1) {
        blocks.delete(voxelKey(spawnX + dx, y, spawnZ + dz));
      }
    }
  }
}

export function createVoxelWorld(theme: CstdThemeId, seed: number): VoxelWorld {
  const normalizedSeed = Math.abs(Math.trunc(seed)) || 1;
  const blocks = theme === "neon-district"
    ? createNightCity(normalizedSeed)
    : theme === "underworld-forge"
      ? createUnderworld(normalizedSeed)
      : createAstralIsles(normalizedSeed);
  clearSpawnPocket(blocks, theme);
  return { seed: normalizedSeed, shards: 0, blocks, base: new Map(blocks) };
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
  const removed: VoxelWorldSnapshot["removed"] = [];
  const added: VoxelWorldSnapshot["added"] = [];
  for (const key of world.base.keys()) {
    if (!world.blocks.has(key)) {
      const coordinate = parseVoxelKey(key);
      removed.push([coordinate[0], coordinate[1], coordinate[2]]);
    }
  }
  for (const [key, kind] of world.blocks) {
    const original = world.base.get(key);
    if (original !== undefined && original === kind) continue;
    const coordinate = parseVoxelKey(key);
    added.push([coordinate[0], coordinate[1], coordinate[2], kind]);
  }
  return { version: 3, theme, seed: world.seed, shards: world.shards, removed, added };
}

export function parseVoxelSnapshot(value: string | null, theme: CstdThemeId): VoxelWorldSnapshot | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<VoxelWorldSnapshot>;
    if (parsed.version !== 3 || parsed.theme !== theme || typeof parsed.seed !== "number" || !Number.isInteger(parsed.seed) || typeof parsed.shards !== "number" || !Number.isInteger(parsed.shards)) return null;
    if (!Array.isArray(parsed.removed) || parsed.removed.length > editLimit) return null;
    if (!Array.isArray(parsed.added) || parsed.added.length > editLimit) return null;
    const removed: VoxelWorldSnapshot["removed"] = [];
    for (const entry of parsed.removed) {
      if (!Array.isArray(entry) || entry.length !== 3) return null;
      const [x, y, z] = entry;
      if (!isEditableVoxelCoordinate([x, y, z])) return null;
      removed.push([x, y, z]);
    }
    const added: VoxelWorldSnapshot["added"] = [];
    for (const entry of parsed.added) {
      if (!Array.isArray(entry) || entry.length !== 4) return null;
      const [x, y, z, kind] = entry;
      if (!isEditableVoxelCoordinate([x, y, z]) || typeof kind !== "string" || !blockKinds.has(kind)) return null;
      added.push([x, y, z, kind as VoxelBlockKind]);
    }
    return { version: 3, theme, seed: parsed.seed, shards: Math.max(0, parsed.shards), removed, added };
  } catch {
    return null;
  }
}

export function restoreVoxelWorld(snapshot: VoxelWorldSnapshot): VoxelWorld {
  const world = createVoxelWorld(snapshot.theme, snapshot.seed);
  world.shards = snapshot.shards;
  for (const [x, y, z] of snapshot.removed) world.blocks.delete(voxelKey(x, y, z));
  for (const [x, y, z, kind] of snapshot.added) world.blocks.set(voxelKey(x, y, z), kind);
  return world;
}

const neighbors: readonly VoxelCoordinate[] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];
