import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const landingPath = join(process.cwd(), "src", "components", "cstd-landing.tsx");

describe("CSTD audio policy", () => {
  it("keeps background music behind explicit UI actions instead of global activation listeners", () => {
    const landing = readFileSync(landingPath, "utf8");

    expect(landing).not.toContain("listenForCstdAudioActivation");
    expect(landing).not.toContain("tryStartBgm");
    expect(landing).not.toContain("点击页面后播放奶油音乐");
    expect(landing).toContain("奶油音乐待播放");
    expect(landing).toContain("void startCstdBgm(CSTD_BGM_NORMAL_VOLUME).then(setBgmActive)");
  });
});
