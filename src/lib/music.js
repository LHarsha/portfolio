import { ctx, out, soundEnabled } from './sound.js';
import { rng } from './rng.js';

// The radio's music: three original stations, composed here and synthesized live with Web Audio
// (no recordings, nothing from any show). A small scheduler looks a little ahead and books each
// 16th-note step on the audio clock, so timing stays tight however busy the page is.

const midi = (n) => 440 * 2 ** ((n - 69) / 12);

/* ---------- instruments ---------- */
let noiseBuf;
function noise(a) {
  if (!noiseBuf) {
    noiseBuf = a.createBuffer(1, a.sampleRate, a.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const s = a.createBufferSource();
  s.buffer = noiseBuf;
  return s;
}
function env(a, g, t, peak, attack, release) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + release);
}

const kit = {
  kick(a, dest, t, level = 0.9) {
    const o = a.createOscillator();
    const g = a.createGain();
    o.frequency.setValueAtTime(130, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.16);
    env(a, g, t, level, 0.004, 0.32);
    o.connect(g).connect(dest);
    o.start(t);
    o.stop(t + 0.4);
  },
  snare(a, dest, t, level = 0.3) {
    const n = noise(a);
    const bp = a.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1900;
    bp.Q.value = 0.8;
    const g = a.createGain();
    env(a, g, t, level, 0.002, 0.16);
    n.connect(bp).connect(g).connect(dest);
    n.start(t, Math.random() * 0.5);
    n.stop(t + 0.2);
  },
  hat(a, dest, t, level = 0.08, len = 0.04) {
    const n = noise(a);
    const hp = a.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 7500;
    const g = a.createGain();
    env(a, g, t, level, 0.001, len);
    n.connect(hp).connect(g).connect(dest);
    n.start(t, Math.random() * 0.5);
    n.stop(t + len + 0.02);
  },
  bass(a, dest, t, note, dur, level = 0.22) {
    const o = a.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = midi(note);
    const lp = a.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(900, t);
    lp.frequency.exponentialRampToValueAtTime(220, t + dur);
    lp.Q.value = 4;
    const g = a.createGain();
    env(a, g, t, level, 0.01, dur);
    o.connect(lp).connect(g).connect(dest);
    o.start(t);
    o.stop(t + dur + 0.05);
  },
  // a soft chord: two detuned triangles per note, slow in and out
  pad(a, dest, t, notes, dur, level = 0.05) {
    const lp = a.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1400;
    const g = a.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(level, t + dur * 0.3);
    g.gain.setValueAtTime(level, t + dur * 0.7);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    lp.connect(g).connect(dest);
    for (const n of notes) {
      for (const cents of [-7, 7]) {
        const o = a.createOscillator();
        o.type = 'triangle';
        o.frequency.value = midi(n);
        o.detune.value = cents;
        o.connect(lp);
        o.start(t);
        o.stop(t + dur + 0.05);
      }
    }
  },
  // the lab's theremin: a sine that glides into each note with a wobbly vibrato
  theremin(a, dest, t, note, dur, from = note - 2, level = 0.07) {
    const o = a.createOscillator();
    o.frequency.setValueAtTime(midi(from), t);
    o.frequency.exponentialRampToValueAtTime(midi(note), t + Math.min(0.12, dur * 0.4));
    const lfo = a.createOscillator();
    const depth = a.createGain();
    lfo.frequency.value = 5.5;
    depth.gain.setValueAtTime(0, t);
    depth.gain.linearRampToValueAtTime(midi(note) * 0.012, t + dur * 0.6);
    lfo.connect(depth).connect(o.frequency);
    const g = a.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(level, t + 0.06);
    g.gain.setValueAtTime(level, t + dur * 0.75);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(dest);
    o.start(t);
    lfo.start(t);
    o.stop(t + dur + 0.05);
    lfo.stop(t + dur + 0.05);
  },
  pluck(a, dest, t, note, level = 0.06, len = 0.16) {
    const o = a.createOscillator();
    o.type = 'square';
    o.frequency.value = midi(note);
    const lp = a.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(4000, t);
    lp.frequency.exponentialRampToValueAtTime(500, t + len);
    const g = a.createGain();
    env(a, g, t, level, 0.003, len);
    o.connect(lp).connect(g).connect(dest);
    o.start(t);
    o.stop(t + len + 0.05);
  },
  // a lab bubble: a quick upward sweep
  bubble(a, dest, t, level = 0.05) {
    const o = a.createOscillator();
    const f = 500 + Math.random() * 700;
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(f * 2.4, t + 0.07);
    const g = a.createGain();
    env(a, g, t, level, 0.005, 0.07);
    o.connect(g).connect(dest);
    o.start(t);
    o.stop(t + 0.1);
  },
  // a far-off star ping, sent into the echo
  ping(a, dest, t, note, level = 0.05) {
    const o = a.createOscillator();
    o.frequency.value = midi(note);
    const g = a.createGain();
    env(a, g, t, level, 0.005, 0.9);
    o.connect(g).connect(dest);
    o.start(t);
    o.stop(t + 1);
  },
};

/* ---------- stations: each books one 16th-note step at a time ---------- */
// step: 16th since start; bar = 16 steps. busses: { dry, echo }.
const stations = [
  {
    id: 'garage',
    name: 'Garage',
    bpm: 86,
    swing: 0.12,
    // D minor-ish loop, voiced warm: Dm9, Bbmaj7, Gm9, A7sus
    chords: [[50, 53, 57, 60, 64], [46, 50, 53, 57, 62], [43, 46, 50, 53, 57], [45, 50, 52, 55, 59]],
    roots: [38, 34, 31, 33],
    scale: [62, 65, 67, 69, 72, 74, 77],
    play(a, b, step, t, s, r) {
      const bar = Math.floor(step / 16);
      const i = step % 16;
      const c = bar % 4;
      if (i === 0) s.pad(a, b.dry, t, this.chords[c], this.barLen * 1.02, 0.045);
      if (i === 0 || i === 10 || (i === 7 && bar % 2)) s.kick(a, b.dry, t, 0.75);
      if (i === 4 || i === 12) s.snare(a, b.dry, t, 0.22);
      if (i % 2 === 0) s.hat(a, b.dry, t, i % 4 === 2 ? 0.07 : 0.04);
      if ([0, 3, 6, 10, 11].includes(i)) s.bass(a, b.dry, t, this.roots[c] + (i === 11 ? 7 : 0), this.step * (i === 0 ? 2.5 : 1.6), 0.2);
      // a theremin phrase every other bar, made up fresh from the scale
      if (bar % 2 === 1 && [2, 6, 8, 12].includes(i) && r() < 0.8) {
        const n = this.scale[Math.floor(r() * this.scale.length)];
        s.theremin(a, b.echo, t, n, this.step * (i === 12 ? 4 : 2.2), n - (r() < 0.5 ? 2 : 5), 0.05);
      }
      if (r() < 0.05) s.bubble(a, b.echo, t, 0.035);
    },
  },
  {
    id: 'space',
    name: 'Deep space',
    bpm: 64,
    swing: 0,
    // slow drift: Em(add9), Cmaj7, Am9, Bsus4
    chords: [[52, 55, 59, 66], [48, 52, 55, 59], [45, 52, 55, 59, 64], [47, 52, 54, 59]],
    roots: [28, 24, 33, 35],
    scale: [76, 79, 81, 83, 86, 88],
    play(a, b, step, t, s, r) {
      const bar = Math.floor(step / 16);
      const i = step % 16;
      const c = Math.floor(bar / 2) % 4;
      if (i === 0 && bar % 2 === 0) {
        s.pad(a, b.dry, t, this.chords[c], this.barLen * 2.05, 0.1);
        s.bass(a, b.dry, t, this.roots[c] + 12, this.barLen * 1.9, 0.14);
      }
      if (i % 4 === 0 && r() < 0.35) s.ping(a, b.echo, t, this.scale[Math.floor(r() * this.scale.length)], 0.07);
      if (i === 8 && bar % 4 === 3) s.theremin(a, b.echo, t, this.scale[1] - 12, this.barLen * 0.9, this.scale[0] - 12, 0.07);
    },
  },
  {
    id: 'bleeps',
    name: 'Bleeps',
    bpm: 116,
    swing: 0,
    // bouncy: Am, F, C, G, arpeggiated
    chords: [[57, 60, 64, 69], [53, 57, 60, 65], [48, 52, 55, 60], [55, 59, 62, 67]],
    roots: [33, 29, 36, 31],
    play(a, b, step, t, s, r) {
      const bar = Math.floor(step / 16);
      const i = step % 16;
      const c = bar % 4;
      const arp = this.chords[c];
      const order = [0, 1, 2, 3, 2, 1, 3, 2];
      s.pluck(a, i % 4 === 0 ? b.dry : b.echo, t, arp[order[i % 8]] + (i >= 8 && bar % 2 ? 12 : 0), 0.05, 0.13);
      if (i % 4 === 0) s.kick(a, b.dry, t, 0.55);
      if (i % 4 === 2) s.hat(a, b.dry, t, 0.06, 0.05);
      if (i % 2 === 0) s.bass(a, b.dry, t, this.roots[c] + (i % 4 === 2 ? 12 : 0), this.step * 0.9, 0.14);
      if (i === 14 && r() < 0.5) s.bubble(a, b.echo, t, 0.04);
    },
  },
];
stations.forEach((st) => {
  st.step = 60 / st.bpm / 4;
  st.barLen = st.step * 16;
});
export const stationNames = stations.map((s) => s.name);

/* ---------- the deck ---------- */
const ST_KEY = 'hl-station';
let station = 0;
try {
  const v = Number(localStorage.getItem(ST_KEY));
  if (v >= 0 && v < stations.length) station = v;
} catch { /* storage blocked */ }
let timer = 0;
let step = 0;
let nextAt = 0;
let busses = null;
let fader = null;
let rand = rng(1);
const listeners = new Set();
const emit = () => listeners.forEach((f) => f());

export const getStation = () => station;
export const isPlaying = () => !!timer;
export function subscribe(f) {
  listeners.add(f);
  return () => listeners.delete(f);
}

function wire(a) {
  if (busses) return;
  fader = a.createGain();
  fader.connect(out());
  const echo = a.createDelay(1);
  echo.delayTime.value = 0.36;
  const fb = a.createGain();
  fb.gain.value = 0.32;
  const tone = a.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = 2600;
  const send = a.createGain();
  echo.connect(tone).connect(fb).connect(echo);
  tone.connect(fader);
  send.connect(fader);
  send.connect(echo);
  busses = { dry: fader, echo: send };
}

function tick() {
  const a = ctx();
  const st = stations[station];
  while (nextAt < a.currentTime + 0.15) {
    const swing = step % 2 ? st.step * st.swing : 0;
    st.play(a, busses, step, nextAt + swing, kit, rand);
    nextAt += st.step;
    step++;
  }
}

export function play() {
  if (timer || !soundEnabled()) return;
  const a = ctx();
  wire(a);
  fader.gain.cancelScheduledValues(a.currentTime);
  fader.gain.setValueAtTime(0.0001, a.currentTime);
  fader.gain.exponentialRampToValueAtTime(1, a.currentTime + 0.8);
  step = 0;
  rand = rng(7 + station);
  nextAt = a.currentTime + 0.08;
  timer = setInterval(tick, 25);
  tick();
  emit();
}

export function stop() {
  if (!timer) return;
  clearInterval(timer);
  timer = 0;
  const a = ctx();
  fader.gain.cancelScheduledValues(a.currentTime);
  fader.gain.setTargetAtTime(0.0001, a.currentTime, 0.08);
  emit();
}

export function tune(i) {
  station = (i + stations.length) % stations.length;
  try { localStorage.setItem(ST_KEY, String(station)); } catch { /* storage blocked */ }
  if (timer) {
    // a quick crossfade: drop out, restart the new station from its first beat
    stop();
    setTimeout(play, 180);
  }
  emit();
}

// Background tabs throttle timers, which would stutter the beat, so the radio rests while hidden.
if (typeof document !== 'undefined') {
  let wasPlaying = false;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      wasPlaying = !!timer;
      stop();
    } else if (wasPlaying) {
      play();
    }
  });
}
