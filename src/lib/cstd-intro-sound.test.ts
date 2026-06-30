import { afterEach, describe, expect, test, vi } from "vitest";
import {
  isCstdBgmPlaying,
  listenForCstdAudioActivation,
  playCstdIntroSound,
  playCstdPokeSound,
  setCstdAudioVolume,
  startCstdBgm,
  stopCstdBgm,
  unlockCstdAudio,
} from "./cstd-intro-sound";

type FakeAudioOptions = {
  rejectPlay?: boolean;
  throwConstructor?: boolean;
};

type FakeAudioRecord = {
  currentTime: number;
  loop: boolean;
  pause: ReturnType<typeof vi.fn>;
  play: ReturnType<typeof vi.fn>;
  preload: string;
  src: string;
  volume: number;
};

type ListenerRecord = {
  listener: EventListenerOrEventListenerObject;
  options?: AddEventListenerOptions | boolean;
  type: string;
};

const audioInstances: FakeAudioRecord[] = [];

function installFakeAudio({ rejectPlay = false, throwConstructor = false }: FakeAudioOptions = {}) {
  audioInstances.length = 0;

  class FakeAudio implements FakeAudioRecord {
    currentTime = 0;
    loop = false;
    pause = vi.fn();
    play = vi.fn(() => (rejectPlay ? Promise.reject(new Error("blocked")) : Promise.resolve()));
    preload = "";
    src: string;
    volume = 1;

    constructor(src: string) {
      if (throwConstructor) throw new Error("asset failed");
      this.src = src;
      audioInstances.push(this);
    }
  }

  const localStorage = {
    getItem: vi.fn<(key: string) => string | null>(() => null),
    setItem: vi.fn<(key: string, value: string) => void>(),
  };

  vi.stubGlobal("window", { Audio: FakeAudio, localStorage });

  return { localStorage };
}

describe("CSTD intro sound", () => {
  afterEach(() => {
    stopCstdBgm();
    audioInstances.length = 0;
    vi.restoreAllMocks();
    Reflect.deleteProperty(globalThis, "window");
  });

  test("does not throw when browser audio is unavailable", async () => {
    await expect(unlockCstdAudio()).resolves.toBe(false);
    await expect(playCstdIntroSound()).resolves.toBe(false);
    await expect(playCstdPokeSound()).resolves.toBe(false);
    await expect(startCstdBgm()).resolves.toBe(false);
  });

  test("does not throw when Audio is unavailable", async () => {
    vi.stubGlobal("window", {});

    await expect(unlockCstdAudio()).resolves.toBe(false);
    await expect(playCstdIntroSound()).resolves.toBe(false);
    await expect(startCstdBgm()).resolves.toBe(false);
  });

  test("silences asset construction and playback failures", async () => {
    installFakeAudio({ throwConstructor: true });
    await expect(playCstdIntroSound()).resolves.toBe(false);

    installFakeAudio({ rejectPlay: true });
    await expect(playCstdIntroSound()).resolves.toBe(false);
    await expect(startCstdBgm()).resolves.toBe(false);
    expect(isCstdBgmPlaying()).toBe(false);
  });

  test("plays local cinematic intro and poke assets after a user gesture", async () => {
    installFakeAudio();

    await expect(unlockCstdAudio()).resolves.toBe(true);
    await expect(playCstdIntroSound()).resolves.toBe(true);
    await expect(playCstdPokeSound()).resolves.toBe(true);

    expect(audioInstances.map((audio) => audio.src)).toEqual([
      "/cstd-audio/intro-custard-stinger.wav",
      "/cstd-audio/custard-pop.wav",
    ]);
    expect(audioInstances[0].volume).toBeGreaterThan(0.5);
    expect(audioInstances[0].play).toHaveBeenCalledTimes(1);
    expect(audioInstances[1].play).toHaveBeenCalledTimes(1);
  });

  test("starts one warm loop asset, updates volume, and stops it without stacking", async () => {
    installFakeAudio();

    await expect(startCstdBgm()).resolves.toBe(true);
    expect(isCstdBgmPlaying()).toBe(true);
    expect(audioInstances).toHaveLength(1);
    expect(audioInstances[0].src).toBe("/cstd-audio/custard-warm-loop.wav");
    expect(audioInstances[0].loop).toBe(true);
    expect(audioInstances[0].play).toHaveBeenCalledTimes(1);

    await expect(startCstdBgm()).resolves.toBe(true);
    expect(audioInstances).toHaveLength(1);
    expect(audioInstances[0].play).toHaveBeenCalledTimes(1);

    setCstdAudioVolume(0.32);
    expect(audioInstances[0].volume).toBe(0.22);

    stopCstdBgm();
    expect(isCstdBgmPlaying()).toBe(false);
    expect(audioInstances[0].pause).toHaveBeenCalledTimes(1);
    expect(audioInstances[0].currentTime).toBe(0);
  });

  test("does not start audio when saved audio preference is disabled", async () => {
    const { localStorage } = installFakeAudio();
    localStorage.getItem.mockReturnValue("disabled");

    await expect(playCstdIntroSound()).resolves.toBe(false);
    await expect(startCstdBgm()).resolves.toBe(false);

    expect(audioInstances).toHaveLength(0);
    expect(isCstdBgmPlaying()).toBe(false);
  });

  test("keeps activation listeners available until playback succeeds or cleanup runs", () => {
    const listeners: ListenerRecord[] = [];
    const target = {
      addEventListener: vi.fn((type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean) => {
        listeners.push({ listener, options, type });
      }),
      removeEventListener: vi.fn((type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean) => {
        const index = listeners.findIndex((record) => record.type === type && record.listener === listener && record.options === options);
        if (index >= 0) listeners.splice(index, 1);
      }),
    };
    const onActivate = vi.fn();

    const cleanup = listenForCstdAudioActivation(onActivate, target);

    expect(target.addEventListener).toHaveBeenCalledTimes(3);
    expect(listeners.map((listener) => listener.type)).toEqual(["pointerdown", "keydown", "touchstart"]);
    expect(listeners.every((listener) => listener.options && typeof listener.options === "object" && listener.options.capture === true)).toBe(true);

    const firstListener = listeners[0].listener;
    if (typeof firstListener === "function") firstListener(new Event("pointerdown"));

    expect(onActivate).toHaveBeenCalledTimes(1);
    expect(target.removeEventListener).not.toHaveBeenCalled();
    expect(listeners).toHaveLength(3);

    cleanup();
    expect(onActivate).toHaveBeenCalledTimes(1);
    expect(target.removeEventListener).toHaveBeenCalledTimes(3);
    expect(listeners).toHaveLength(0);
  });
});
