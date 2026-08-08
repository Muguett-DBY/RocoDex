type AudioSession = {
  context: AudioContext;
  master: GainNode;
  sources: AudioScheduledSourceNode[];
};

class AmbientSoundEngine {
  private session: AudioSession | null = null;

  async start() {
    if (this.session) return;
    const context = new AudioContext();
    await context.resume();
    const master = context.createGain();
    master.gain.setValueAtTime(0, context.currentTime);
    master.gain.linearRampToValueAtTime(0.045, context.currentTime + 0.7);
    master.connect(context.destination);

    const drone = context.createOscillator();
    const harmonic = context.createOscillator();
    const filter = context.createBiquadFilter();
    const droneGain = context.createGain();
    drone.type = "sine";
    drone.frequency.value = 54;
    harmonic.type = "triangle";
    harmonic.frequency.value = 81;
    filter.type = "lowpass";
    filter.frequency.value = 420;
    filter.Q.value = 0.8;
    droneGain.gain.value = 0.52;
    drone.connect(droneGain);
    harmonic.connect(droneGain);
    droneGain.connect(filter);
    filter.connect(master);
    drone.start();
    harmonic.start();

    this.session = { context, master, sources: [drone, harmonic] };
    this.pulse();
  }

  stop() {
    const session = this.session;
    if (!session) return;
    this.session = null;
    session.master.gain.cancelScheduledValues(session.context.currentTime);
    session.master.gain.setValueAtTime(session.master.gain.value, session.context.currentTime);
    session.master.gain.linearRampToValueAtTime(0, session.context.currentTime + 0.25);
    for (const source of session.sources) source.stop(session.context.currentTime + 0.28);
    window.setTimeout(() => void session.context.close(), 320);
  }

  pulse() {
    const session = this.session;
    if (!session) return;
    const { context, master } = session;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(240, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(72, context.currentTime + 0.34);
    gain.gain.setValueAtTime(0.08, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.36);
    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.38);
  }
}

export const ambientSound = new AmbientSoundEngine();
