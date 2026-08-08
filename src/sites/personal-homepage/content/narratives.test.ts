import { describe, expect, test } from "vitest";
import { cstdNarratives, getNarrativeSystems } from "./narratives";
import { cstdSystems } from "./systems";

describe("CSTD visitor narratives", () => {
  test("offers three complete routes through the same capability system", () => {
    expect(cstdNarratives.map((entry) => entry.id)).toEqual(["builder", "researcher", "collaborator"]);
    for (const narrative of cstdNarratives) {
      expect(getNarrativeSystems(narrative.id).map((entry) => entry.id)).toEqual(narrative.systemOrder);
      expect(new Set(narrative.systemOrder)).toEqual(new Set(cstdSystems.map((entry) => entry.id)));
      expect(narrative.projectOrder).toHaveLength(3);
    }
  });
});
