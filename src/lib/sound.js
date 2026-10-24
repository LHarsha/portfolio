// Original sounds only, synthesized at runtime. Off until the visitor turns them on.
// Everything (UI blips and the radio's music, see music.js) plays through one mixer, so the
// radio's volume fader and power switch cover all of it, and its scope can watch the output.
const KEY = 'hl-sound';
const VOL_KEY = 'hl-volume';
let ac;
let bus;
let analyser;
let enabled = false;
let volume = 0.6;
try {
  enabled = localStorage.getItem(KEY) === 'on';
  const v = parseFloat(localStorage.getItem(VOL_KEY));
  if (v >= 0 && v <= 1) volume = v;
} catch { /* storage blocked */ }

export const soundEnabled = () => enabled;
export const soundVolume = () => volume;

export function setSound(on) {
  enabled = on;
  try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch { /* storage blocked */ }
  if (on) blip(520, 110);
}

export function setVolume(v) {
  volume = v;
  try { localStorage.setItem(VOL_KEY, String(v)); } catch { /* storage blocked */ }
  if (bus) bus.gain.setTargetAtTime(v * v, ac.currentTime, 0.03);
}

export function ctx() {
  if (!ac) {
    ac = new AudioContext();
    // the mixer: master volume → a gentle limiter → speakers, with the scope listening in
    bus = ac.createGain();
    bus.gain.value = volume * volume;
    const limit = ac.createDynamicsCompressor();
    limit.threshold.value = -10;
    limit.ratio.value = 6;
    analyser = ac.createAnalyser();
    analyser.fftSize = 512;
    bus.connect(limit).connect(ac.destination);
    limit.connect(analyser);
  }
  if (ac.state === 'suspended') ac.resume();
  return ac;
}
// where everything plays into
export const out = () => (ctx(), bus);
export const scopeNode = () => analyser;
// dev only: lets the review scripts listen to the output
if (import.meta.env.DEV) Object.assign(window, { __ac: () => ac, __scope: () => analyser });

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
  o.connect(g).connect(bus);
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
  src.connect(bp).connect(g).connect(bus);
  src.start(t);
}
