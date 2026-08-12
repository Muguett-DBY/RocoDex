import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /sitemap.xml", () => {
  it("serves only the personal homepage on the apex host", async () => {
    const response = GET(new Request("https://custard.top/sitemap.xml", { headers: { host: "custard.top" } }) as never);
    const sitemap = await response.text();

    expect(sitemap).toContain("<loc>https://custard.top/</loc>");
    expect(sitemap).toContain('hreflang="en-AU" href="https://custard.top/en"');
    expect(sitemap).toContain("<loc>https://custard.top/en/for/research</loc>");
    expect(sitemap).not.toContain("rocodex.custard.top/creatures");
  });

  it("serves the RocoDex catalog on the product host", async () => {
    const response = GET(new Request("https://rocodex.custard.top/sitemap.xml", { headers: { host: "rocodex.custard.top" } }) as never);
    const sitemap = await response.text();

    expect(sitemap).toContain("<loc>https://rocodex.custard.top/creatures</loc>");
    expect(sitemap).toContain("<loc>https://rocodex.custard.top/creatures/001</loc>");
    expect(sitemap).not.toContain("<loc>https://custard.top/</loc>");
  });
});
