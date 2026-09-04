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
    expect(neonA.blocks.size).toBeLessThan(60_000);
    expect(underworld.blocks.size).toBeGreaterThan(2_000);
    expect(astral.blocks.size).toBeGreaterThan(1_000);
    expect([...neonA.blocks]).not.toEqual([...underworld.blocks]);
    expect(astral.blocks.has(voxelKey(0, 11, 0))).toBe(true);
    expect(astral.blocks.has(voxelKey(22, 0, 22))).toBe(false);
    expect(getExposedVoxels(neonA).length).toBeLessThan(neonA.blocks.size);
  });

  it("gives every world its own signature materials", () => {
    const neon = createVoxelWorld("neon-district", 1707);
    const underworld = createVoxelWorld("underworld-forge", 1707);
    const astral = createVoxelWorld("astral-covenant", 1707);

    const kindsOf = (world: ReturnType<typeof createVoxelWorld>) => new Set(world.blocks.values());
    expect(kindsOf(neon).has("neon")).toBe(true);
    expect(kindsOf(neon).has("magma")).toBe(false);
    expect(kindsOf(underworld).has("magma")).toBe(true);
    expect(kindsOf(underworld).has("gold")).toBe(true);
    expect(kindsOf(astral).has("neon")).toBe(true);
    expect(kindsOf(astral).has("gold")).toBe(true);
  });

  it("keeps every exhibit landmark standing on solid ground in every world", () => {
    for (const theme of ["neon-district", "underworld-forge", "astral-covenant"] as const) {
      const world = createVoxelWorld(theme, 4242);
      for (const key of world.blocks.keys()) {
        const [x, y, z] = key.split(",").map(Number);
        expect(Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z)).toBe(true);
      }
      expect(world.blocks.size).toBeGreaterThan(0);
    }
  });

  it("round-trips an edits-only save and rejects malformed data", () => {
    const world = createVoxelWorld("underworld-forge", 991);
    world.shards = 4;
    const probeKey = voxelKey(2, 20, 3);
    expect(world.blocks.has(probeKey)).toBe(false);
    world.blocks.set(probeKey, "crystal");
    const overwriteKey = [...world.base.keys()][0]!;
    const originalKind = world.base.get(overwriteKey)!;
    world.blocks.set(overwriteKey, "gold");
    const snapshot = createVoxelSnapshot(world, "underworld-forge");

    expect(snapshot.version).toBe(3);
    expect(snapshot.added).toContainEqual([2, 20, 3, "crystal"]);
    expect(snapshot.added).toContainEqual([...(overwriteKey.split(",").map(Number) as [number, number, number]), "gold"]);
    expect(snapshot.added.length).toBeLessThan(400);
    expect(createVoxelSnapshot({ ...world, blocks: new Map(world.base) }, "underworld-forge").added).toEqual([]);

    const parsed = parseVoxelSnapshot(JSON.stringify(snapshot), "underworld-forge");
    expect(parsed).not.toBeNull();
    const restored = restoreVoxelWorld(parsed!);
    expect(restored.blocks.get(probeKey)).toBe("crystal");
    expect(restored.blocks.get(overwriteKey)).toBe("gold");
    expect(restored.shards).toBe(4);
    expect(parsed?.added.length ?? 0).toBeLessThan(400);
    const pristine = { ...world, blocks: new Map(world.base), shards: 0 };
    const pristineSnapshot = createVoxelSnapshot(pristine, "underworld-forge");
    expect(pristineSnapshot.added).toEqual([]);
    expect(pristineSnapshot.removed).toEqual([]);
    expect(restoreVoxelWorld(parseVoxelSnapshot(JSON.stringify(pristineSnapshot), "underworld-forge")!).blocks.get(overwriteKey)).toBe(originalKind);

    expect(parseVoxelSnapshot(JSON.stringify(snapshot), "astral-covenant")).toBeNull();
    expect(parseVoxelSnapshot('{"version":3,"theme":"underworld-forge","seed":1,"shards":0,"removed":[],"added":[[999,1,1,"stone"]]}', "underworld-forge")).toBeNull();
    expect(parseVoxelSnapshot('{"version":3,"theme":"underworld-forge","seed":1,"shards":0,"removed":[],"added":[[1,1,1,"titanium"]]}', "underworld-forge")).toBeNull();
    expect(parseVoxelSnapshot('{"version":2,"theme":"underworld-forge","seed":1,"shards":0,"blocks":[[1,1,1,"stone"]]}', "underworld-forge")).toBeNull();
  });
});
