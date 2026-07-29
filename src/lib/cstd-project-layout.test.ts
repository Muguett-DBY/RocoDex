import { describe, expect, it } from "vitest";
import { getCstdProjectLayout } from "./cstd-project-layout";

describe("getCstdProjectLayout", () => {
  it("promotes the first visible live project with a preview", () => {
    expect(
      getCstdProjectLayout({
        index: 0,
        hasPreview: true,
        status: "Live",
      }),
    ).toBe("feature");
  });

  it("keeps later live projects in the standard gallery rhythm", () => {
    expect(
      getCstdProjectLayout({
        index: 1,
        hasPreview: true,
        status: "Live",
      }),
    ).toBe("standard");
  });

  it("reserves the full-width studio queue treatment for incubating work", () => {
    expect(
      getCstdProjectLayout({
        index: 0,
        hasPreview: false,
        status: "Next",
      }),
    ).toBe("incubator");
  });
});
