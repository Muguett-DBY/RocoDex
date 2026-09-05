import { readdirSync } from "node:fs";
import path from "node:path";

import { describe, expect, test } from "vitest";
import { cstdCaseStudies } from "../content/case-studies";
import { cstdKnowledgeGraph } from "../content/knowledge-graph";
import { cstdLabs } from "../content/labs";
import { cstdTechnicalNotes } from "../content/technical-notes";

function publicRoutes() {
  const stable = ["/", "/work", "/notes", "/lab", "/voxel", "/map", "/about", "/now", "/resume", "/resume.json", "/proof.json", "/observatory.json", "/content-health.json", "/performance.json", "/experience.json"];
  const archiveAssets = readdirSync(path.join(process.cwd(), "public", "cstd-archive")).map((name) => `/cstd-archive/${name}`);
  const zh = [
    ...stable,
    ...archiveAssets,
    ...cstdCaseStudies.map((entry) => `/work/${entry.slug}`),
    ...cstdTechnicalNotes.map((entry) => `/notes/${entry.slug}`),
    ...cstdLabs.map((entry) => `/lab/${entry.slug}`),
  ];
  return new Set([...zh, ...zh.map((path) => path === "/" ? "/en" : `/en${path}`)]);
}

describe("CSTD internal links", () => {
  test("keeps every content and graph relationship on a published route", () => {
    const routes = publicRoutes();
    const hrefs = [
      ...cstdCaseStudies.flatMap((entry) => entry.artifacts.flatMap((artifact) => [artifact.href.zh, artifact.href.en])),
      ...cstdKnowledgeGraph.nodes.flatMap((node) => [node.href.zh, node.href.en]),
    ].filter((href) => href.startsWith("/"));

    expect(hrefs.length).toBeGreaterThan(50);
    expect([...new Set(hrefs)].filter((href) => !routes.has(href))).toEqual([]);
  });
});
