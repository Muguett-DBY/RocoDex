import { describe, expect, it } from "vitest";
import { getCstdLinkTargetProps } from "./cstd-link-target";

describe("CSTD link target policy", () => {
  it("opens external project links in a separate tab with a safe referrer policy", () => {
    expect(getCstdLinkTargetProps("https://rocodex.custard.top")).toEqual({
      target: "_blank",
      rel: "noreferrer",
    });
    expect(getCstdLinkTargetProps("https://cfzzs.custard.top")).toEqual({
      target: "_blank",
      rel: "noreferrer",
    });
  });

  it("keeps in-page and canonical CSTD links in the current tab", () => {
    expect(getCstdLinkTargetProps("#projects")).toEqual({});
    expect(getCstdLinkTargetProps("/?project=crm#project-focus")).toEqual({});
    expect(getCstdLinkTargetProps("https://custard.top/")).toEqual({});
  });
});
