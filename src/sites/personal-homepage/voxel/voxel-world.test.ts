import { describe, expect, it } from "vitest";
import { createVoxelSnapshot, createVoxelWorld, getExposedVoxels, parseVoxelSnapshot, restoreVoxelWorld, voxelKey } from "./voxel-world";

describe("CSTD voxel world", () => {
  it("generates deterministic but theme-specific playable worlds", () => {
    const neonA = createVoxelWorld("neon-district", 1707);
    const neonB = createVoxelWorld("neon-district", 1707);
    const underworld = createVoxelWorld("underworld-forge", 1707);
    const astral = createVoxelWorld("astral-covenant", 1707);

    expect([...neonA.blocks]).toEqual([...neonB.blocks]);
    expect(neonA.blocks.size).toBeGreaterThan(2_000);
    expect([...neonA.blocks]).not.toEqual([...underworld.blocks]);
    expect(astral.blocks.has(voxelKey(7, 16, -7))).toBe(true);
    expect(getExposedVoxels(neonA).length).toBeLessThan(neonA.blocks.size);
  });

  it("round-trips a bounded local save and rejects malformed data", () => {
    const world = createVoxelWorld("underworld-forge", 991);
    world.shards = 4;
    world.blocks.set(voxelKey(2, 14, 3), "crystal");
    const snapshot = createVoxelSnapshot(world, "underworld-forge");
    const parsed = parseVoxelSnapshot(JSON.stringify(snapshot), "underworld-forge");

    expect(parsed).not.toBeNull();
    expect(restoreVoxelWorld(parsed!).blocks.get(voxelKey(2, 14, 3))).toBe("crystal");
    expect(parsed?.shards).toBe(4);
    expect(parseVoxelSnapshot(JSON.stringify(snapshot), "astral-covenant")).toBeNull();
    expect(parseVoxelSnapshot('{"version":1,"theme":"underworld-forge","seed":1,"shards":0,"blocks":[[999,1,1,"stone"]]}', "underworld-forge")).toBeNull();
  });
});
