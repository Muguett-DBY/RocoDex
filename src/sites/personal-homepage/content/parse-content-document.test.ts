import { describe, expect, test } from "vitest";
import { parseContentDocument } from "./parse-content-document";

describe("content document parsing", () => {
  test("parses the nested bilingual metadata used by the homepage without changing MDX", () => {
    const body = '\n<LocaleBlock locale="en">\n\n# A page\n\n---\n\nText with = and ;\n</LocaleBlock>\n';
    const document = parseContentDocument(`---\nslug: test-page\nupdatedAt: "2026-10-10"\ntitle: {zh: "页面", en: "Page"}\ntags: [AI, Systems]\npublished: true\n---\n${body}`);
    expect(document.data).toEqual({
      slug: "test-page",
      updatedAt: "2026-10-10",
      title: { zh: "页面", en: "Page" },
      tags: ["AI", "Systems"],
      published: true,
    });
    expect(document.content).toBe(body);
  });

  test("leaves an ordinary document intact", () => {
    const source = "# Notes\n\nNo metadata here.\n";
    expect(parseContentDocument(source)).toEqual({ data: {}, content: source });
  });

  test("accepts Windows line endings", () => {
    const result = parseContentDocument('---\r\nslug: windows-page\r\n---\r\n<body />\r\n');
    expect(result.data).toEqual({ slug: "windows-page" });
    expect(result.content).toBe("<body />\r\n");
  });

  test("rejects malformed or duplicate metadata instead of publishing ambiguous content", () => {
    expect(() => parseContentDocument("---\nimage: [unfinished\n---\nText")).toThrow();
    expect(() => parseContentDocument("---\nslug: one\nslug: two\n---\nText")).toThrow();
  });

  test("requires metadata to be a mapping", () => {
    expect(() => parseContentDocument("---\n- first\n- second\n---\nText")).toThrow("YAML mapping");
  });
});
