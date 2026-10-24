// Original sounds only, synthesized at runtime. Off until the visitor turns them on.
const KEY = 'hl-sound';
let ac;
let enabled = false;
try { enabled = localStorage.getItem(KEY) === 'on'; } catch { /* storage blocked */ }

export const soundEnabled = () => enabled;

export function setSound(on) {
  enabled = on;
  try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch { /* storage blocked */ }
  if (on) blip(520, 110);
}

function ctx() {
  ac ??= new AudioContext();
  if (ac.state === 'suspended') ac.resume();
  return ac;
}

export function blip(freq = 660, ms = 90) {
  if (!enabled) return;
  const a = ctx();
  const t = a.currentTime;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = 'square';
  o.frequency.setValueAtTime(freq, t);
  o.frequency.exponentialRampToValueAtTime(freq * 1.5, t + ms / 1000);
  g.gain.setValueAtTime(0.05, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + ms / 1000);
  o.connect(g).connect(a.destination);
  o.start(t);
  o.stop(t + ms / 1000);
}

// Filtered noise sweep for the portal.
export function whoosh(ms = 700) {
  if (!enabled) return;
  const a = ctx();
  const t = a.currentTime;
  const len = Math.floor(a.sampleRate * ms / 1000);
  const buf = a.createBuffer(1, len, a.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = a.createBufferSource();
  src.buffer = buf;
  const bp = a.createBiquadFilter();
  bp.type = 'bandpass';
  bp.Q.value = 6;
  bp.frequency.setValueAtTime(200, t);
  bp.frequency.exponentialRampToValueAtTime(2400, t + ms / 1000);
  const g = a.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.12, t + 0.12);
  g.gain.exponentialRampToValueAtTime(0.0001, t + ms / 1000);
  src.connect(bp).connect(g).connect(a.destination);
  src.start(t);
}
