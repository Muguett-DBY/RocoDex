import { describe, expect, it } from "vitest";
import {
  buildCollectionCompareHref,
  normalizeCreatureCollectionIds,
  parseCreatureCollection,
  toggleCreatureCollectionId,
} from "@/lib/creature-collection";

describe("creature collection", () => {
  it("normalizes IDs without duplicates or malformed values", () => {
    expect(normalizeCreatureCollectionIds(["001", "001", "bad", "12", "347"])).toEqual(["001", "347"]);
  });

  it("parses the current storage schema and rejects invalid payloads", () => {
    expect(parseCreatureCollection(JSON.stringify({ version: 1, ids: ["005", "001", "005"] }))).toEqual(["005", "001"]);
    expect(parseCreatureCollection(JSON.stringify({ version: 2, ids: ["001"] }))).toEqual([]);
    expect(parseCreatureCollection("{broken")).toEqual([]);
    expect(parseCreatureCollection(null)).toEqual([]);
  });

  it("toggles a creature without mutating the input", () => {
    const ids = ["001", "005"];

    expect(toggleCreatureCollectionId(ids, "008")).toEqual(["001", "005", "008"]);
    expect(toggleCreatureCollectionId(ids, "001")).toEqual(["005"]);
    expect(ids).toEqual(["001", "005"]);
  });

  it("builds comparison links only for two to four valid unique IDs", () => {
    expect(buildCollectionCompareHref(["001"])).toBeNull();
    expect(buildCollectionCompareHref(["001", "005", "001", "008", "010", "011"])).toBe("/compare?ids=001%2C005%2C008%2C010");
  });
});
