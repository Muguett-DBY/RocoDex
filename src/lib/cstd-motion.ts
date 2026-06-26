export const CSTD_MOTION_PREFERENCE_KEY = "cstd.motionPreference";
export const CSTD_INTRO_SEEN_KEY = "cstd.introSeen";

export type CstdMotionPreference = "enabled" | "disabled";

type IntroDecision = {
  hasProjectFocus?: boolean;
  reducedMotion: boolean;
  motionPreference: string | null;
  introSeen?: string | null;
};

type IntroReplayDecision = {
  reducedMotion: boolean;
  motionPreference: string | null;
};

type PointerTiltInput = {
  clientX: number;
  clientY: number;
  rectLeft: number;
  rectTop: number;
  rectWidth: number;
  rectHeight: number;
};

export function shouldPlayCstdIntro({ hasProjectFocus, reducedMotion, motionPreference, introSeen }: IntroDecision) {
  if (hasProjectFocus) return false;
  if (reducedMotion) return false;
  if (motionPreference === "disabled") return false;
  return introSeen !== "true";
}

export function shouldPlayCstdIntroReplay({ motionPreference }: IntroReplayDecision) {
  return motionPreference !== "disabled";
}

export function getCstdIntroControlLabel(motionPreference: string | null) {
  return motionPreference === "disabled" ? "开场动画：关" : "开场动画：开";
}

export function getCstdPointerTilt({ clientX, clientY, rectLeft, rectTop, rectWidth, rectHeight }: PointerTiltInput) {
  const safeWidth = Math.max(rectWidth, 1);
  const safeHeight = Math.max(rectHeight, 1);
  const x = clamp((clientX - rectLeft) / safeWidth, 0, 1) * 2 - 1;
  const y = clamp((clientY - rectTop) / safeHeight, 0, 1) * 2 - 1;

  return {
    x,
    y,
    rotateX: round(-y * 8),
    rotateY: round(x * 10),
    glowX: round(((x + 1) / 2) * 100),
    glowY: round(((y + 1) / 2) * 100),
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function round(value: number) {
  const rounded = Math.round(value * 100) / 100;
  return Object.is(rounded, -0) ? 0 : rounded;
}
