import { readFileSync } from "node:fs";

import { describe, expect, test } from "vitest";

const source = readFileSync(new URL("./cstd-landing.tsx", import.meta.url), "utf8");

describe("CSTD landing project navigation", () => {
  test("applies the shared external-link target policy to header navigation links", () => {
    const navLinkStart = source.indexOf("function NavLink(");
    const navLinkEnd = source.indexOf("function HeroButton(", navLinkStart);
    const navLinkSource = source.slice(navLinkStart, navLinkEnd);

    expect(navLinkStart).toBeGreaterThanOrEqual(0);
    expect(navLinkEnd).toBeGreaterThan(navLinkStart);
    expect(navLinkSource).toContain("const targetProps = getCstdLinkTargetProps(href);");
    expect(navLinkSource).toContain("{...targetProps}");
  });
});
