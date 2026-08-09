import { describe, expect, test } from "vitest";
import { cstdCaseStudies } from "../content/case-studies";
import { cstdKnowledgeGraph } from "../content/knowledge-graph";
import { cstdLabs } from "../content/labs";
import { cstdTechnicalNotes } from "../content/technical-notes";

function publicRoutes() {
  const stable = ["/", "/work", "/notes", "/lab", "/map", "/about", "/now", "/resume", "/resume.json", "/proof.json", "/observatory.json", "/content-health.json"];
  const zh = [
    ...stable,
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
