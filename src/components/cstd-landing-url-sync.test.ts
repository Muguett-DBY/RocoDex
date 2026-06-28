import { readFileSync } from "node:fs";

import { describe, expect, test } from "vitest";

const source = readFileSync(new URL("./cstd-landing.tsx", import.meta.url), "utf8");

describe("CSTD landing URL state sync", () => {
  test("does not frame-delay initial deep-link restoration", () => {
    expect(source).toContain('const useCstdClientLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;');
    expect(source).toContain("useCstdClientLayoutEffect(() => {");
    expect(source).toContain("const [projectViewStateSynced, setProjectViewStateSynced] = useState(false);");
    expect(source).toContain("setProjectViewStateSynced(true);");
    expect(source).toContain("{projectViewStateSynced ? (");
    expect(source).not.toContain("requestAnimationFrame(syncViewState)");
  });

  test("guards clipboard access for browser environments without navigator", () => {
    expect(source).toContain("function getCstdClipboardWriter()");
    expect(source).toContain('if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) return undefined;');
    expect(source).not.toContain("navigator.clipboard ?");
  });
});
