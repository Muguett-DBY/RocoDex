import { describe, expect, it } from "vitest";
import { creatures } from "@/data/creatures";
import { guideBuilds } from "@/data/guide-builds";
import { pvpTeams } from "@/data/pvp-teams";
import { getGuideBuildBySlug, guideBuildSlug, seoLandingPages } from "@/lib/seo-pages";
import { getPvpTeamBySlug, pvpTeamSlug } from "@/lib/pvp-query";

describe("seo page helpers", () => {
  it("defines high-intent landing pages with stable hrefs", () => {
    expect(seoLandingPages.map((page) => page.slug)).toEqual(
      expect.arrayContaining(["best-pvp", "best-pve", "catchable", "event-limited", "beginner"]),
    );
    expect(seoLandingPages.every((page) => page.href.startsWith("/discover/"))).toBe(true);
  });

  it("creates stable guide and pvp detail slugs", () => {
    const guide = guideBuilds.find((build) => build.name === "迪莫") ?? guideBuilds[0];
    const team = pvpTeams[0];

    expect(getGuideBuildBySlug(guideBuilds, guideBuildSlug(guide))?.id).toBe(guide.id);
    expect(getPvpTeamBySlug(pvpTeams, pvpTeamSlug(team))?.id).toBe(team.id);
  });

  it("landing page queries return player-meaningful creatures", () => {
    const catchable = seoLandingPages.find((page) => page.slug === "catchable")?.selectCreatures(creatures, guideBuilds) ?? [];

    expect(catchable.length).toBeGreaterThan(0);
    expect(catchable.every((item) => item.isCatchable === true)).toBe(true);
  });
});
