import { describe, expect, test } from "vitest";
import {
  cstdProjectCards,
  cstdHeaderNavClassName,
  cstdHeroActionsClassName,
  cstdHeroSectionClassName,
  cstdMascotAsideClassName,
  cstdMascotShellClassName,
  cstdNavLinkClassName,
  cstdPageShellClassName,
  cstdProjectGridClassName,
} from "./cstd-mobile-layout";

describe("CSTD mobile layout rules", () => {
  test("does not mark RocoDex as a primary or main project", () => {
    expect(cstdProjectCards[0].title).toContain("RocoDex");
    expect(cstdProjectCards[0].kicker).toBe("Data app");
    expect(cstdProjectCards.map((project) => project.kicker).join(" ")).not.toMatch(/primary|main/i);
  });

  test("keeps mobile hero content natural-flow while preserving desktop split hero", () => {
    expect(cstdPageShellClassName).toContain("calc(100%_-_48px)");
    expect(cstdPageShellClassName).toContain("max-w-[342px]");
    expect(cstdPageShellClassName).toContain("sm:w-[min(1160px,calc(100%_-_32px))]");
    expect(cstdHeroSectionClassName).toContain("min-h-0");
    expect(cstdHeroSectionClassName).toContain("lg:min-h-[calc(100vh-88px)]");
    expect(cstdHeroSectionClassName).toContain("lg:grid-cols-[minmax(0,1fr)_420px]");
    expect(cstdHeroSectionClassName).not.toContain("order-first");
  });

  test("keeps mobile navigation and hero actions inside narrow viewports", () => {
    expect(cstdHeaderNavClassName).toContain("grid-cols-3");
    expect(cstdHeaderNavClassName).toContain("w-full");
    expect(cstdHeaderNavClassName).toContain("sm:flex");
    expect(cstdNavLinkClassName).toContain("min-w-0");
    expect(cstdNavLinkClassName).toContain("justify-center");
    expect(cstdNavLinkClassName).toContain("text-xs");
    expect(cstdHeroActionsClassName).toContain("w-full");
    expect(cstdHeroActionsClassName).not.toContain("max-w-[320px]");
  });

  test("uses compact non-absolute mascot placement on mobile", () => {
    expect(cstdMascotAsideClassName).toContain("min-h-0");
    expect(cstdMascotAsideClassName).toContain("lg:min-h-[560px]");
    expect(cstdMascotAsideClassName).not.toContain("order-first");
    expect(cstdMascotShellClassName).toContain("relative");
    expect(cstdMascotShellClassName).toContain("w-[min(100%,240px)]");
    expect(cstdMascotShellClassName).toContain("lg:absolute");
  });

  test("renders all project cards with equal grid weight", () => {
    expect(cstdProjectGridClassName).toBe("grid gap-4 md:grid-cols-2 xl:grid-cols-3");
    expect(cstdProjectGridClassName).not.toContain("col-span");
  });
});
