// Zero-dependency synthesized music-box chimes & subtle paper rustle via Web Audio API

let audioCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playMusicBoxNote(enabled: boolean, pitchIndex = 0) {
  if (!enabled) return;
  const ctx = getContext();
  if (!ctx) return;

  // Warm pentatonic celesta / brass chime frequencies
  const notes = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
  const freq = notes[Math.abs(pitchIndex) % notes.length];

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const overtone = ctx.createOscillator();
  const gain = ctx.createGain();
  const overtoneGain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, now);

  overtone.type = "triangle";
  overtone.frequency.setValueAtTime(freq * 2, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.075, now + 0.014);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);

  overtoneGain.gain.setValueAtTime(0.0001, now);
  overtoneGain.gain.exponentialRampToValueAtTime(0.018, now + 0.01);
  overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

  osc.connect(gain);
  overtone.connect(overtoneGain);
  gain.connect(ctx.destination);
  overtoneGain.connect(ctx.destination);

  osc.start(now);
  overtone.start(now);
  osc.stop(now + 1.2);
  overtone.stop(now + 0.5);
}

export function playHangCelebrationChime(enabled: boolean) {
  if (!enabled) return;
  const ctx = getContext();
  if (!ctx) return;

  // Gentle 3-note ascending music-box arpeggio
  const chord = [523.25, 659.25, 783.99, 1046.5];
  chord.forEach((freq, idx) => {
    const start = ctx.currentTime + idx * 0.095;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.07, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 1.4);
  });
}
