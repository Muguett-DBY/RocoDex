import { VFile } from "vfile";
import { matter } from "vfile-matter";

export function parseContentDocument(source: string) {
  const file = new VFile(source);
  // Share the YAML parser between authoring tools and rendered MDX pages.
  matter(file, { strip: true });
  const data = file.data.matter ?? {};
  if (typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Content frontmatter must be a YAML mapping");
  }
  return { data: data as Record<string, unknown>, content: String(file) };
}
