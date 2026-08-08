import type { CstdSceneId } from "../experience/scene-manifest";

type AudioLayers = {
  city: GainNode;
  data: GainNode;
  rain: GainNode;
  cue: GainNode;
};

type AudioSession = {
  context: AudioContext;
  master: GainNode;
  layers: AudioLayers;
  sources: AudioScheduledSourceNode[];
};

const sceneMix: Record<CstdSceneId, readonly [city: number, data: number, rain: number]> = {
  hero: [0.68, 0.22, 0.48],
  systems: [0.38, 0.62, 0.18],
  proof: [0.32, 0.72, 0.12],
  operator: [0.56, 0.26, 0.42],
  path: [0.3, 0.4, 0.24],
  finale: [0.74, 0.16, 0.34],
};

class AmbientSoundEngine {
  private session: AudioSession | null = null;
  private scene: CstdSceneId = "hero";
  private overdrive = false;

  async start() {
    if (this.session) return;
    const context = new AudioContext();
    await context.resume();
    const master = context.createGain();
    master.gain.setValueAtTime(0, context.currentTime);
    master.gain.linearRampToValueAtTime(0.052, context.currentTime + 0.9);
    master.connect(context.destination);

    const layers: AudioLayers = {
      city: context.createGain(),
      data: context.createGain(),
      rain: context.createGain(),
      cue: context.createGain(),
    };
    Object.values(layers).forEach((layer) => layer.connect(master));
    layers.cue.gain.value = 0.7;

    const cityFilter = context.createBiquadFilter();
    cityFilter.type = "lowpass";
    cityFilter.frequency.value = 310;
    cityFilter.Q.value = 0.72;
    cityFilter.connect(layers.city);
    const bass = context.createOscillator();
    const harmonic = context.createOscillator();
    bass.type = "sine";
    bass.frequency.value = 46;
    harmonic.type = "triangle";
    harmonic.frequency.value = 69;
    bass.connect(cityFilter);
    harmonic.connect(cityFilter);

    const dataTone = context.createOscillator();
    const dataFilter = context.createBiquadFilter();
    const dataModulator = context.createOscillator();
    const dataModulationDepth = context.createGain();
    dataTone.type = "triangle";
    dataTone.frequency.value = 144;
    dataFilter.type = "bandpass";
    dataFilter.frequency.value = 760;
    dataFilter.Q.value = 1.6;
    dataModulator.type = "square";
    dataModulator.frequency.value = 1.35;
    dataModulationDepth.gain.value = 0.16;
    dataTone.connect(dataFilter);
    dataFilter.connect(layers.data);
    dataModulator.connect(dataModulationDepth);
    dataModulationDepth.connect(layers.data.gain);

    const rainBuffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const rainData = rainBuffer.getChannelData(0);
    for (let index = 0; index < rainData.length; index += 1) {
      rainData[index] = (Math.random() * 2 - 1) * (0.35 + Math.sin(index * 0.0007) * 0.08);
    }
    const rain = context.createBufferSource();
    const rainFilter = context.createBiquadFilter();
    rain.buffer = rainBuffer;
    rain.loop = true;
    rainFilter.type = "highpass";
    rainFilter.frequency.value = 2100;
    rainFilter.Q.value = 0.3;
    rain.connect(rainFilter);
    rainFilter.connect(layers.rain);

    const sources: AudioScheduledSourceNode[] = [bass, harmonic, dataTone, dataModulator, rain];
    sources.forEach((source) => source.start());
    this.session = { context, master, layers, sources };
    this.applyMix(0.02);
    this.pulse();
  }

  stop() {
    const session = this.session;
    if (!session) return;
    this.session = null;
    session.master.gain.cancelScheduledValues(session.context.currentTime);
    session.master.gain.setValueAtTime(session.master.gain.value, session.context.currentTime);
    session.master.gain.linearRampToValueAtTime(0, session.context.currentTime + 0.28);
    for (const source of session.sources) source.stop(session.context.currentTime + 0.3);
    window.setTimeout(() => void session.context.close(), 340);
  }

  setScene(scene: CstdSceneId) {
    if (scene === this.scene) return;
    this.scene = scene;
    this.applyMix(0.85);
    this.sceneCue(scene);
  }

  setOverdrive(active: boolean) {
    this.overdrive = active;
    this.applyMix(0.35);
    if (active) this.pulse(1.35);
  }

  pulse(multiplier = 1) {
    const session = this.session;
    if (!session) return;
    const { context, layers } = session;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = this.overdrive ? "sawtooth" : "sine";
    oscillator.frequency.setValueAtTime(this.overdrive ? 320 : 240, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(72, context.currentTime + 0.34);
    gain.gain.setValueAtTime(0.075 * multiplier, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.36);
    oscillator.connect(gain);
    gain.connect(layers.cue);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.38);
  }

  private applyMix(duration: number) {
    const session = this.session;
    if (!session) return;
    const [city, data, rain] = sceneMix[this.scene];
    const boost = this.overdrive ? 1.28 : 1;
    const targets = {
      city: city * boost,
      data: data * (this.overdrive ? 1.46 : 1),
      rain: rain * (this.overdrive ? 0.58 : 1),
    };
    for (const key of ["city", "data", "rain"] as const) {
      const gain = session.layers[key].gain;
      gain.cancelScheduledValues(session.context.currentTime);
      gain.setValueAtTime(gain.value, session.context.currentTime);
      gain.linearRampToValueAtTime(targets[key], session.context.currentTime + duration);
    }
  }

  private sceneCue(scene: CstdSceneId) {
    const session = this.session;
    if (!session) return;
    const { context, layers } = session;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const sceneIndex = Object.keys(sceneMix).indexOf(scene);
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(180 + sceneIndex * 24, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(90 + sceneIndex * 8, context.currentTime + 0.52);
    gain.gain.setValueAtTime(0.045, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.54);
    oscillator.connect(gain);
    gain.connect(layers.cue);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.56);
  }
}

export const ambientSound = new AmbientSoundEngine();
