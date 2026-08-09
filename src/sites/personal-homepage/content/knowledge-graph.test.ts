import { describe, expect, test } from "vitest";
import { cstdKnowledgeGraph, findCstdKnowledgePath } from "./knowledge-graph";

describe("CSTD knowledge graph", () => {
  test("keeps every node id and edge id unique", () => {
    expect(new Set(cstdKnowledgeGraph.nodes.map((node) => node.id)).size).toBe(cstdKnowledgeGraph.nodes.length);
    expect(new Set(cstdKnowledgeGraph.edges.map((edge) => edge.id)).size).toBe(cstdKnowledgeGraph.edges.length);
  });

  test("connects every node to a valid published node", () => {
    const ids = new Set(cstdKnowledgeGraph.nodes.map((node) => node.id));
    for (const edge of cstdKnowledgeGraph.edges) {
      expect(ids.has(edge.source)).toBe(true);
      expect(ids.has(edge.target)).toBe(true);
    }
    for (const node of cstdKnowledgeGraph.nodes) {
      expect(cstdKnowledgeGraph.edges.some((edge) => edge.source === node.id || edge.target === node.id)).toBe(true);
      expect(node.href.zh.startsWith("/") || node.href.zh.startsWith("https://")).toBe(true);
      expect(node.href.en.startsWith("/") || node.href.en.startsWith("https://")).toBe(true);
    }
  });

  test("includes all five evidence layers", () => {
    expect(new Set(cstdKnowledgeGraph.nodes.map((node) => node.type))).toEqual(new Set(["system", "case", "note", "lab", "moment"]));
  });

  test("finds the shortest explainable path across reversed evidence edges", () => {
    expect(findCstdKnowledgePath(
      "system:edge-operations",
      "note:host-boundaries-in-one-next-deployment",
    )).toEqual([
      "system:edge-operations",
      "case:rocodex-platform",
      "note:host-boundaries-in-one-next-deployment",
    ]);
    expect(findCstdKnowledgePath("missing", "system:edge-operations")).toEqual([]);
  });
});
