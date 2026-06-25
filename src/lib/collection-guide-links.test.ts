import { describe, expect, it } from "vitest";
import { getCollectionGuideHref } from "@/lib/collection-guide-links";
import type { GuideCreatureBuild } from "@/types/guide";

const guide = (dexId: string, id: string, name: string): GuideCreatureBuild =>
  ({
    dexId,
    id,
    name,
  }) as GuideCreatureBuild;

describe("collection guide links", () => {
  it("builds a guide href for matching dex ids", () => {
    expect(getCollectionGuideHref("001", [guide("001", "creature-001", "迪莫")])).toBe("/guides/creature-001-%E8%BF%AA%E8%8E%AB");
  });

  it("returns null when no guide build matches", () => {
    expect(getCollectionGuideHref("999", [guide("001", "creature-001", "迪莫")])).toBeNull();
  });
});
