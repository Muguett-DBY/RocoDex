import { describe, expect, test } from "vitest";
import {
  cstdProjectCards,
  cstdHeaderClassName,
  cstdHeaderNavClassName,
  cstdHeroActionsClassName,
  cstdHeroSectionClassName,
  cstdMascotAsideClassName,
  cstdMascotShellClassName,
  cstdMobileNavClassName,
  cstdNavLinkClassName,
  cstdPageShellClassName,
  cstdProjectEvidenceClassName,
  cstdProjectEvidenceShareGridClassName,
  cstdProjectFocusActionRailClassName,
  cstdProjectFocusBodyClassName,
  cstdProjectFocusChecklistGridClassName,
  cstdProjectGridClassName,
  cstdProjectHeadingClassName,
  cstdProjectMetricGridClassName,
  cstdProjectMetricLabelClassName,
  cstdProjectMetricTileClassName,
  cstdProjectMetricValueClassName,
  cstdProjectComparisonClassName,
  cstdProjectComparisonColumnsClassName,
  cstdProjectProofTimelineGridClassName,
  cstdProjectToolbarActionsClassName,
  cstdProjectToolbarClassName,
  cstdProjectWorkflowSummaryGridClassName,
} from "./cstd-mobile-layout";

describe("CSTD mobile layout rules", () => {
  test("does not mark RocoDex as a primary or main project", () => {
    expect(cstdProjectCards[0].title).toContain("RocoDex");
    expect(cstdProjectCards[0].kicker).toBe("Data app");
    expect(cstdProjectCards.map((project) => project.kicker).join(" ")).not.toMatch(/primary|main/i);
  });

  test("includes the live personal AI workspace and招商 CRM project cards", () => {
    expect(cstdProjectCards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "私人 AI 创作工作台",
          kicker: "AI creation",
        }),
        expect.objectContaining({
          title: "产业园区招商 CRM",
          kicker: "CRM system",
        }),
      ]),
    );
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

  test("keeps mobile navigation compact while preserving desktop shortcuts", () => {
    expect(cstdHeaderClassName).toContain("sticky");
    expect(cstdHeaderClassName).toContain("backdrop-blur-md");
    expect(cstdHeaderClassName).toContain("sm:static");
    expect(cstdHeaderNavClassName).toContain("hidden");
    expect(cstdHeaderNavClassName).toContain("sm:flex");
    expect(cstdMobileNavClassName).toContain("sm:hidden");
    expect(cstdMobileNavClassName).toContain("grid");
    expect(cstdNavLinkClassName).toContain("min-w-0");
    expect(cstdNavLinkClassName).toContain("focus-visible:outline");
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

  test("keeps project metric text inside its tile at narrow card widths", () => {
    expect(cstdProjectMetricGridClassName).toContain("grid-cols-1");
    expect(cstdProjectMetricGridClassName).toContain("sm:grid-cols-3");
    expect(cstdProjectMetricTileClassName).toContain("min-w-0");
    expect(cstdProjectMetricValueClassName).toContain("min-w-0");
    expect(cstdProjectMetricValueClassName).toContain("break-words");
    expect(cstdProjectMetricLabelClassName).toContain("min-w-0");
    expect(cstdProjectMetricLabelClassName).toContain("break-words");
  });

  test("keeps project evidence in a readable stacked block", () => {
    expect(cstdProjectEvidenceClassName).toContain("grid");
    expect(cstdProjectEvidenceClassName).toContain("text-sm");
    expect(cstdProjectEvidenceClassName).not.toContain("grid-cols-3");
  });

  test("keeps the focused case study scan-first on mobile and action-stable on desktop", () => {
    expect(cstdProjectFocusBodyClassName).toContain("grid");
    expect(cstdProjectFocusBodyClassName).toContain("lg:grid-cols-[minmax(0,1fr)_20rem]");
    expect(cstdProjectFocusChecklistGridClassName).toContain("grid-cols-1");
    expect(cstdProjectFocusChecklistGridClassName).toContain("md:grid-cols-2");
    expect(cstdProjectFocusActionRailClassName).toContain("lg:sticky");
    expect(cstdProjectFocusActionRailClassName).toContain("lg:top-24");
  });

  test("keeps evidence sharing and proof timeline readable across breakpoints", () => {
    expect(cstdProjectEvidenceShareGridClassName).toContain("grid");
    expect(cstdProjectEvidenceShareGridClassName).toContain("lg:grid-cols-2");
    expect(cstdProjectEvidenceShareGridClassName).toContain("items-stretch");
    expect(cstdProjectProofTimelineGridClassName).toContain("grid-cols-1");
    expect(cstdProjectProofTimelineGridClassName).toContain("md:grid-cols-2");
    expect(cstdProjectProofTimelineGridClassName).toContain("xl:grid-cols-5");
  });

  test("keeps the project directory toolbar compact and action-stable", () => {
    expect(cstdProjectToolbarClassName).toContain("grid");
    expect(cstdProjectToolbarClassName).toContain("sm:grid-cols-[minmax(0,1fr)_auto]");
    expect(cstdProjectToolbarClassName).toContain("min-w-0");
    expect(cstdProjectToolbarActionsClassName).toContain("grid");
    expect(cstdProjectToolbarActionsClassName).toContain("min-[420px]:grid-cols-2");
    expect(cstdProjectToolbarActionsClassName).toContain("sm:flex");
  });

  test("keeps project comparison readable without horizontal scrolling", () => {
    expect(cstdProjectComparisonClassName).toContain("min-w-0");
    expect(cstdProjectComparisonClassName).toContain("overflow-hidden");
    expect(cstdProjectComparisonColumnsClassName).toContain("grid-cols-1");
    expect(cstdProjectComparisonColumnsClassName).toContain("sm:grid-cols-2");
  });

  test("keeps the project workflow summary scannable across breakpoints", () => {
    expect(cstdProjectWorkflowSummaryGridClassName).toContain("grid-cols-1");
    expect(cstdProjectWorkflowSummaryGridClassName).toContain("sm:grid-cols-2");
    expect(cstdProjectWorkflowSummaryGridClassName).toContain("xl:grid-cols-4");
  });

  test("keeps the project heading readable at narrow widths", () => {
    expect(cstdProjectHeadingClassName).toContain("max-w-full");
    expect(cstdProjectHeadingClassName).toContain("break-words");
    expect(cstdProjectHeadingClassName).toContain("text-2xl");
    expect(cstdProjectHeadingClassName).not.toContain("text-3xl");
    expect(cstdProjectHeadingClassName).toContain("sm:text-5xl");
  });
});
