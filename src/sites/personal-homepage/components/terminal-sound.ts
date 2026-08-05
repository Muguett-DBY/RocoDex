"use client";

/**
 * 终端音效：Web Audio 合成哔声（零资源、事件驱动）。
 * 只在用户交互（键盘/点击）时发声，遵守浏览器 autoplay 策略。
 * calm 模式下组件层不会调用。
 */
const MUTE_KEY = "cstd-terminal-muted";

let audioContext: AudioContext | null = null;
let muted = false;

try {
  muted = window.localStorage.getItem(MUTE_KEY) === "1";
} catch {
  muted = false;
}

function getContext(): AudioContext | null {
  if (muted) return null;
  try {
    if (!audioContext) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      audioContext = new Ctor();
    }
    if (audioContext.state === "suspended") {
      void audioContext.resume();
    }
    return audioContext;
  } catch {
    return null;
  }
}

function beep(frequency: number, durationMs: number, volume: number) {
  const ctx = getContext();
  if (!ctx) return;
  try {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "square";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + durationMs / 1000);
  } catch {
    // 音频不可用时静默降级
  }
}

export const terminalSound = {
  /** 按键音 */
  key(): void {
    beep(620 + Math.random() * 60, 22, 0.012);
  },
  /** 回车执行音（含轻振动反馈，Android 有效） */
  enter(): void {
    beep(880, 55, 0.03);
    setTimeout(() => beep(1245, 45, 0.02), 45);
    try {
      navigator.vibrate?.(12);
    } catch {
      // 不支持振动的环境静默降级
    }
  },
  /** Tab 补全音 */
  tab(): void {
    beep(440, 30, 0.02);
  },
  /** 错误提示音 */
  error(): void {
    beep(180, 90, 0.035);
  },
  isMuted(): boolean {
    return muted;
  },
  setMuted(next: boolean): void {
    muted = next;
    try {
      window.localStorage.setItem(MUTE_KEY, next ? "1" : "0");
    } catch {
      // 存储不可用时仅本次会话生效
    }
  },
  /** 用户点击静音开关时的确认音 */
  toggle(next: boolean): void {
    terminalSound.setMuted(next);
    if (!next) {
      beep(990, 40, 0.025);
    }
  },
};
