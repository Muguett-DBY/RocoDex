type AudioConstructor = new (src?: string) => HTMLAudioElement;

type AudioWindow = Window &
  typeof globalThis & {
    Audio?: AudioConstructor;
  };

const CSTD_AUDIO_PREFERENCE_KEY = "cstd.audioPreference";
const CSTD_INTRO_SOUND_SRC = "/cstd-audio/intro-custard-stinger.wav";
const CSTD_BGM_SOUND_SRC = "/cstd-audio/custard-warm-loop.wav";
const CSTD_POKE_SOUND_SRC = "/cstd-audio/custard-pop.wav";
const CSTD_INTRO_VOLUME = 0.78;
const CSTD_POKE_VOLUME = 0.58;
const CSTD_BGM_DEFAULT_VOLUME = 0.12;
const CSTD_BGM_MAX_VOLUME = 0.22;
const CSTD_AUDIO_ACTIVATION_EVENTS = ["pointerdown", "keydown", "touchstart"] as const;

let bgmAudio: HTMLAudioElement | null = null;
let bgmPlaying = false;
let bgmVolume = CSTD_BGM_DEFAULT_VOLUME;
let activeOneShots: HTMLAudioElement[] = [];

export async function unlockCstdAudio() {
  if (isCstdAudioPreferenceDisabled()) return false;
  return Boolean(getAudioConstructor());
}

export async function playCstdIntroSound() {
  return playCstdOneShot(CSTD_INTRO_SOUND_SRC, CSTD_INTRO_VOLUME);
}

export async function playCstdPokeSound() {
  return playCstdOneShot(CSTD_POKE_SOUND_SRC, CSTD_POKE_VOLUME);
}

export async function startCstdBgm(volume = CSTD_BGM_DEFAULT_VOLUME) {
  if (isCstdAudioPreferenceDisabled()) return false;

  const nextVolume = normalizeBgmVolume(volume);
  bgmVolume = nextVolume;

  try {
    if (!bgmAudio) {
      bgmAudio = createCstdAudio(CSTD_BGM_SOUND_SRC, {
        loop: true,
        preload: "auto",
        volume: nextVolume,
      });
    }

    if (!bgmAudio) return false;

    bgmAudio.loop = true;
    bgmAudio.volume = nextVolume;

    if (bgmPlaying) return true;

    const playResult = bgmAudio.play();
    if (playResult) await playResult;
    bgmPlaying = true;
    return true;
  } catch {
    bgmPlaying = false;
    bgmAudio = null;
    return false;
  }
}

export function listenForCstdAudioActivation(
  onActivate: () => void,
  target: Pick<Window, "addEventListener" | "removeEventListener"> | null = getAudioActivationTarget(),
) {
  if (!target) return () => {};

  const activationTarget = target;
  let cleanedUp = false;
  const handleActivation: EventListener = () => {
    if (cleanedUp) return;
    onActivate();
  };

  const options: AddEventListenerOptions = { capture: true, passive: true };

  for (const eventName of CSTD_AUDIO_ACTIVATION_EVENTS) {
    activationTarget.addEventListener(eventName, handleActivation, options);
  }

  function cleanup() {
    if (cleanedUp) return;
    cleanedUp = true;
    for (const eventName of CSTD_AUDIO_ACTIVATION_EVENTS) {
      activationTarget.removeEventListener(eventName, handleActivation, options);
    }
  }

  return cleanup;
}

export function stopCstdBgm() {
  if (!bgmAudio) {
    bgmPlaying = false;
    return;
  }

  try {
    bgmAudio.pause();
  } catch {
    // Decorative audio must never interrupt page interaction.
  }

  try {
    bgmAudio.currentTime = 0;
  } catch {
    // Some browsers can reject currentTime before metadata is ready.
  }

  bgmPlaying = false;
  bgmAudio = null;
}

export function setCstdAudioVolume(volume: number) {
  bgmVolume = normalizeBgmVolume(volume);

  if (!bgmAudio) return;

  try {
    bgmAudio.volume = bgmVolume;
  } catch {
    // Volume changes are non-critical.
  }
}

export function isCstdBgmPlaying() {
  return bgmPlaying;
}

function playCstdOneShot(src: string, volume: number) {
  if (isCstdAudioPreferenceDisabled()) return Promise.resolve(false);

  return playOneShotAsset(src, volume);
}

async function playOneShotAsset(src: string, volume: number) {
  try {
    const audio = createCstdAudio(src, {
      loop: false,
      preload: "auto",
      volume: normalizeOneShotVolume(volume),
    });
    if (!audio) return false;

    activeOneShots.push(audio);
    cleanupOneShot(audio);

    const playResult = audio.play();
    if (playResult) await playResult;
    return true;
  } catch {
    return false;
  }
}

function createCstdAudio(
  src: string,
  {
    loop,
    preload,
    volume,
  }: {
    loop: boolean;
    preload: "auto" | "metadata" | "none";
    volume: number;
  },
) {
  const AudioConstructor = getAudioConstructor();
  if (!AudioConstructor) return null;

  const audio = new AudioConstructor(src);
  audio.preload = preload;
  audio.loop = loop;
  audio.volume = volume;
  return audio;
}

function getAudioConstructor() {
  if (typeof window === "undefined") return null;

  const audioWindow = window as AudioWindow;
  return audioWindow.Audio ?? null;
}

function getAudioActivationTarget() {
  if (typeof window === "undefined") return null;
  return window;
}

function isCstdAudioPreferenceDisabled() {
  if (typeof window === "undefined") return false;

  try {
    return window.localStorage?.getItem(CSTD_AUDIO_PREFERENCE_KEY) === "disabled";
  } catch {
    return false;
  }
}

function cleanupOneShot(audio: HTMLAudioElement) {
  const removeAudio = () => {
    activeOneShots = activeOneShots.filter((item) => item !== audio);
  };

  try {
    audio.addEventListener?.("ended", removeAudio, { once: true });
  } catch {
    // Older test doubles and browsers can omit addEventListener on Audio.
  }

  if (typeof window !== "undefined" && typeof window.setTimeout === "function") {
    window.setTimeout(removeAudio, 7000);
  }
}

function normalizeBgmVolume(volume: number) {
  if (!Number.isFinite(volume)) return CSTD_BGM_DEFAULT_VOLUME;
  return Math.min(CSTD_BGM_MAX_VOLUME, Math.max(0, volume));
}

function normalizeOneShotVolume(volume: number) {
  if (!Number.isFinite(volume)) return 0.6;
  return Math.min(0.92, Math.max(0, volume));
}
