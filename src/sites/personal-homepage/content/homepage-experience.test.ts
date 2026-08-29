import { describe, expect, it } from "vitest";
import { cstdCaseStudies } from "./case-studies";
import { createHomepageEvidenceChains } from "./homepage-experience";

const selectedCases = ["rocodex", "alpha", "crm"]
  .map((projectId) => cstdCaseStudies.find((entry) => entry.projectId === projectId))
  .filter((entry) => entry !== undefined);

describe("CSTD homepage experience projection", () => {
  it.each(["zh", "en"] as const)("projects three evidence chains with four complete phases in %s", (locale) => {
    const chains = createHomepageEvidenceChains(selectedCases, locale);
    expect(chains).toHaveLength(3);
    expect(chains.map((chain) => chain.id)).toEqual(["rocodex", "alpha", "crm"]);
    for (const chain of chains) {
      expect(chain.phases.map((phase) => phase.id)).toEqual(["problem", "decision", "system", "verification"]);
      expect(chain.phases.every((phase) => phase.title.length > 0 && phase.detail.length > 20 && phase.signal.length > 0)).toBe(true);
      expect(chain.caseHref).toMatch(locale === "en" ? /^\/en\/work\// : /^\/work\//);
      expect(chain.coverageScore).toBeGreaterThan(0);
      expect(chain.artifactCount).toBeGreaterThan(0);
    }
  });
});
