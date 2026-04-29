import { afterEach, describe, expect, test, vi } from "vitest";
import { playCstdIntroSound, playCstdPokeSound, unlockCstdAudio } from "./cstd-intro-sound";

describe("CSTD intro sound", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    Reflect.deleteProperty(globalThis, "window");
  });

  test("does not throw when Web Audio is unavailable", async () => {
    await expect(unlockCstdAudio()).resolves.toBe(false);
    await expect(playCstdIntroSound()).resolves.toBe(false);
    await expect(playCstdPokeSound()).resolves.toBe(false);
  });

  test("does not throw when AudioContext is unavailable", async () => {
    vi.stubGlobal("window", {});

    await expect(playCstdIntroSound()).resolves.toBe(false);
  });

  test("silences autoplay or audio setup failures", async () => {
    vi.stubGlobal("window", {
      AudioContext: class {
        constructor() {
          throw new Error("blocked");
        }
      },
    });

    await expect(playCstdIntroSound()).resolves.toBe(false);
  });

  test("silences resume failures from browser autoplay blocking", async () => {
    vi.stubGlobal("window", {
      AudioContext: class {
        currentTime = 0;
        destination = {};
        state = "suspended";

        resume() {
          return Promise.reject(new Error("blocked"));
        }
      },
    });

    await expect(playCstdIntroSound()).resolves.toBe(false);
  });

  test("silences oscillator setup failures", async () => {
    vi.stubGlobal("window", {
      setTimeout: vi.fn(),
      AudioContext: class {
        currentTime = 0;
        destination = {};
        state = "running";

        createGain() {
          return {
            connect: vi.fn(),
            disconnect: vi.fn(),
            gain: {
              setValueAtTime: vi.fn(),
              exponentialRampToValueAtTime: vi.fn(),
              linearRampToValueAtTime: vi.fn(),
            },
          };
        }

        createOscillator() {
          throw new Error("oscillator failed");
        }
      },
    });

    await expect(playCstdIntroSound()).resolves.toBe(false);
  });

  test("unlocks audio and schedules layered intro and poke cues after a user gesture", async () => {
    const starts: number[] = [];

    vi.stubGlobal("window", {
      setTimeout: vi.fn(),
      AudioContext: class {
        currentTime = 0;
        destination = {};
        state = "suspended";

        resume() {
          this.state = "running";
          return Promise.resolve();
        }

        createGain() {
          return {
            connect: vi.fn(),
            disconnect: vi.fn(),
            gain: {
              setValueAtTime: vi.fn(),
              exponentialRampToValueAtTime: vi.fn(),
              linearRampToValueAtTime: vi.fn(),
            },
          };
        }

        createOscillator() {
          return {
            connect: vi.fn(),
            start: (time: number) => starts.push(time),
            stop: vi.fn(),
            frequency: {
              setValueAtTime: vi.fn(),
              exponentialRampToValueAtTime: vi.fn(),
              linearRampToValueAtTime: vi.fn(),
            },
            type: "sine",
          };
        }
      },
    });

    await expect(unlockCstdAudio()).resolves.toBe(true);
    await expect(playCstdIntroSound()).resolves.toBe(true);
    await expect(playCstdPokeSound()).resolves.toBe(true);
    expect(starts).toHaveLength(9);
  });
});
