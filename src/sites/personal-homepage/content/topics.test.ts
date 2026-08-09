import { describe, expect, it } from "vitest";
import { cstdTopics, getCstdTopicSequence, getCstdTopicsForNote } from "./topics";

describe("curated topic paths", () => {
  it("forms a continuous circular path across all five judgments", () => {
    const first = getCstdTopicSequence(cstdTopics[0].slug);
    const last = getCstdTopicSequence(cstdTopics.at(-1)!.slug);
    expect(first?.position).toBe(1);
    expect(first?.previous.slug).toBe(cstdTopics.at(-1)!.slug);
    expect(last?.next.slug).toBe(cstdTopics[0].slug);
  });

  it("links technical notes back to one or more curated paths", () => {
    for (const topic of cstdTopics) {
      for (const noteSlug of topic.noteSlugs) {
        expect(getCstdTopicsForNote(noteSlug).some((candidate) => candidate.slug === topic.slug)).toBe(true);
      }
    }
  });
});
