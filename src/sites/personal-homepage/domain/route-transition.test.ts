import { describe, expect, it } from "vitest";
import { createCstdNavigationSnapshot, getCstdRouteTransitionKind } from "./route-transition";

describe("route transition continuity", () => {
  it("classifies public, localized, and internal paths consistently", () => {
    expect(getCstdRouteTransitionKind("/work", "/work/rocodex-platform")).toBe("work");
    expect(getCstdRouteTransitionKind("/cstd/en/notes/a", "/en/notes/b")).toBe("reading");
    expect(getCstdRouteTransitionKind("/topics/system-boundaries", "/map")).toBe("path");
    expect(getCstdRouteTransitionKind("/", "/lab/data-lens")).toBe("execute");
    expect(getCstdRouteTransitionKind("/en/voxel", "/")).toBe("execute");
    expect(getCstdRouteTransitionKind("/", "/voxel")).toBe("execute");
  });

  it("stores a bounded source snapshot without changing navigation behavior", () => {
    expect(createCstdNavigationSnapshot("/", "/work", -12, 42)).toEqual({ schemaVersion: 1, from: "/", to: "/work", kind: "work", scrollY: 0, at: 42 });
  });
});
