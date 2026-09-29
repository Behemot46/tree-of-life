// ══════════════════════════════════════════════════════
// KIN — SOUND
//
// Synthesised with Web Audio: no audio files to download and nothing new
// for the Content-Security-Policy to allow. Browsers only start audio after
// a tap, so the context is created lazily on the first sound. Off by
// default; the player turns it on.
//
// A right answer plays two notes a fifth apart, pitched a semitone higher
// for every correct answer in a row, so a streak is something you hear.
// ══════════════════════════════════════════════════════

let ctx = null;
let enabled = false;

export function setEnabled(on) { enabled = !!on; }

function audio() {
  if (!enabled) return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { ctx = new AC(); } catch { return null; }
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq, at, dur, { type = 'triangle', gain = 0.07, slideTo } = {}) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + at;
  const osc = a.createOscillator();
  const amp = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  amp.gain.setValueAtTime(0.0001, t);
  amp.gain.exponentialRampToValueAtTime(gain, t + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(amp);
  amp.connect(a.destination);
  osc.start(t);
  osc.stop(t + dur + 0.03);
}

export const sfx = {
  tap() { tone(880, 0, 0.05, { type: 'sine', gain: 0.03 }); },
  right(streak) {
    const base = 523.25 * Math.pow(2, Math.min(streak, 12) / 12);
    tone(base, 0, 0.13);
    tone(base * 1.5, 0.09, 0.18);
  },
  wrong() { tone(233, 0, 0.26, { type: 'sine', gain: 0.07, slideTo: 147 }); },
  win() { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.09, 0.2)); },
};

/* A short buzz where the platform has one (Android). iOS Safari does not. */
export function buzz(pattern) {
  try { if (navigator.vibrate) navigator.vibrate(pattern); } catch { /* unsupported */ }
}
