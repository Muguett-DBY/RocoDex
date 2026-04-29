type AudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

let sharedAudioContext: AudioContext | null = null;

export async function unlockCstdAudio() {
  const context = getCstdAudioContext();
  if (!context) return false;

  try {
    const resumed = await beginCstdAudioResume(context);
    if (!resumed) return false;
  } catch {
    sharedAudioContext = null;
    return false;
  }

  return Boolean(context);
}

export async function playCstdIntroSound() {
  const context = getCstdAudioContext();
  if (!context) return false;

  try {
    const resumePromise = beginCstdAudioResume(context);
    const start = context.currentTime + 0.025;
    const master = createMasterGain(context, start, 0.14, 1.05);

    scheduleTone(context, master, {
      delay: 0,
      duration: 0.26,
      fromFrequency: 196,
      toFrequency: 124,
      gain: 0.92,
      type: "sine",
    });
    scheduleTone(context, master, {
      delay: 0.035,
      duration: 0.18,
      fromFrequency: 294,
      toFrequency: 202,
      gain: 0.42,
      type: "sine",
    });
    scheduleTone(context, master, {
      delay: 0.17,
      duration: 0.18,
      fromFrequency: 720,
      toFrequency: 1080,
      gain: 0.54,
      type: "triangle",
    });
    scheduleTone(context, master, {
      delay: 0.3,
      duration: 0.2,
      fromFrequency: 1040,
      toFrequency: 1510,
      gain: 0.42,
      type: "sine",
    });
    scheduleTone(context, master, {
      delay: 0.44,
      duration: 0.14,
      fromFrequency: 1480,
      toFrequency: 2200,
      gain: 0.3,
      type: "triangle",
    });
    scheduleTone(context, master, {
      delay: 0.54,
      duration: 0.18,
      fromFrequency: 1880,
      toFrequency: 2680,
      gain: 0.24,
      type: "sine",
    });

    if (!(await resumePromise)) return false;
    scheduleDisconnect(master, 1180);
    return true;
  } catch {
    sharedAudioContext = null;
    return false;
  }
}

export async function playCstdPokeSound() {
  const context = getCstdAudioContext();
  if (!context) return false;

  try {
    const resumePromise = beginCstdAudioResume(context);
    const start = context.currentTime + 0.02;
    const master = createMasterGain(context, start, 0.085, 0.52);

    scheduleTone(context, master, {
      delay: 0,
      duration: 0.15,
      fromFrequency: 360,
      toFrequency: 190,
      gain: 0.62,
      type: "sine",
    });
    scheduleTone(context, master, {
      delay: 0.1,
      duration: 0.16,
      fromFrequency: 980,
      toFrequency: 1540,
      gain: 0.44,
      type: "triangle",
    });
    scheduleTone(context, master, {
      delay: 0.23,
      duration: 0.12,
      fromFrequency: 1680,
      toFrequency: 2260,
      gain: 0.26,
      type: "sine",
    });

    if (!(await resumePromise)) return false;
    scheduleDisconnect(master, 680);
    return true;
  } catch {
    sharedAudioContext = null;
    return false;
  }
}

function getCstdAudioContext() {
  if (typeof window === "undefined") return false;

  const audioWindow = window as AudioWindow;
  const AudioContextConstructor = audioWindow.AudioContext ?? audioWindow.webkitAudioContext;
  if (!AudioContextConstructor) return false;

  try {
    const context = sharedAudioContext ?? new AudioContextConstructor();
    sharedAudioContext = context;
    return context;
  } catch {
    sharedAudioContext = null;
    return false;
  }
}

function beginCstdAudioResume(context: AudioContext) {
  if (context.state === "suspended") {
    return context.resume().then(
      () => true,
      () => {
        sharedAudioContext = null;
        return false;
      },
    );
  }

  return Promise.resolve(true);
}

function createMasterGain(context: AudioContext, start: number, peakGain: number, duration: number) {
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, start);
  master.gain.exponentialRampToValueAtTime(peakGain, start + 0.025);
  master.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  master.connect(context.destination);
  return master;
}

function scheduleDisconnect(node: AudioNode, delay: number) {
  window.setTimeout(() => node.disconnect(), delay);
}

function scheduleTone(
  context: AudioContext,
  destination: AudioNode,
  {
    delay,
    duration,
    fromFrequency,
    gain,
    toFrequency,
    type,
  }: {
    delay: number;
    duration: number;
    fromFrequency: number;
    gain: number;
    toFrequency: number;
    type: OscillatorType;
  },
) {
  const start = context.currentTime + 0.025 + delay;
  const end = start + duration;
  const oscillator = context.createOscillator();
  const envelope = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(fromFrequency, start);
  oscillator.frequency.exponentialRampToValueAtTime(toFrequency, end);

  envelope.gain.setValueAtTime(0.0001, start);
  envelope.gain.exponentialRampToValueAtTime(gain, start + 0.025);
  envelope.gain.exponentialRampToValueAtTime(0.0001, end);

  oscillator.connect(envelope);
  envelope.connect(destination);
  oscillator.start(start);
  oscillator.stop(end + 0.03);
}
