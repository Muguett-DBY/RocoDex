import { describe, expect, test } from "vitest";
import { GET } from "./route";

function robotsRequest(host: string) {
  return new Request("https://example.test/robots.txt", {
    headers: {
      host,
    },
  });
}

describe("robots.txt route", () => {
  test("serves CSTD robots text with the personal-site sitemap", async () => {
    const response = GET(robotsRequest("custard.top") as never);
    const body = await response.text();

    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8");
    expect(response.headers.get("cache-control")).toBe("public, max-age=3600, s-maxage=3600");
    expect(body).toContain("Sitemap: https://custard.top/sitemap.xml");
  });

  test("serves RocoDex robots text with the graph-site sitemap", async () => {
    const response = GET(robotsRequest("rocodex.custard.top") as never);
    const body = await response.text();

    expect(body).toContain("Sitemap: https://rocodex.custard.top/sitemap.xml");
  });
});
