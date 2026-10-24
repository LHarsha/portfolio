import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { scopeNode, setSound, setVolume, soundEnabled, soundVolume } from '../lib/sound.js';
import { getStation, isPlaying, play, stationNames, stop, subscribe, tune } from '../lib/music.js';

// The lab radio: a little piece of hardware in the header instead of a sound button. A flip switch
// for power, an oscilloscope screen that draws the music's waveform and names the station (tap it
// for the next one), station arrows, and a volume fader. Off until the visitor flips it.
function useDeck() {
  const station = useSyncExternalStore(subscribe, getStation);
  const playing = useSyncExternalStore(subscribe, isPlaying);
  return { station, playing };
}

// Draws the waveform while music plays and the screen is in view; a flat trace otherwise.
function useScope(canvas, on) {
  useEffect(() => {
    const c = canvas.current;
    const g = c.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = c.clientWidth;
    const h = c.clientHeight;
    c.width = w * dpr;
    c.height = h * dpr;
    g.scale(dpr, dpr);
    const trace = getComputedStyle(c).color;
    const flat = () => {
      g.clearRect(0, 0, w, h);
      g.strokeStyle = trace;
      g.globalAlpha = 0.5;
      g.lineWidth = 1.5;
      g.beginPath();
      g.moveTo(2, h * 0.64);
      g.lineTo(w - 2, h * 0.64);
      g.stroke();
      g.globalAlpha = 1;
    };
    if (!on) {
      flat();
      return undefined;
    }
    const an = scopeNode();
    const data = new Uint8Array(an.fftSize);
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(draw);
    });
    io.observe(c);
    function draw() {
      raf = 0;
      if (!visible) return;
      an.getByteTimeDomainData(data);
      g.clearRect(0, 0, w, h);
      g.strokeStyle = trace;
      g.lineWidth = 2;
      g.lineJoin = 'round';
      g.beginPath();
      const n = 96;
      for (let i = 0; i < n; i++) {
        // the mix is quiet, so the trace is boosted to read on a screen this small
        const v = Math.max(-1, Math.min(1, ((data[Math.floor((i / n) * data.length)] - 128) / 128) * 4));
        const x = 2 + (i / (n - 1)) * (w - 4);
        const y = h * 0.64 + v * h * 0.32;
        if (i) g.lineTo(x, y);
        else g.moveTo(x, y);
      }
      g.stroke();
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [canvas, on]);
}

export function RadioPanel({ onPower }) {
  const { station, playing } = useDeck();
  const [on, setOn] = useState(soundEnabled);
  const [vol, setVol] = useState(soundVolume);
  const scope = useRef(null);
  useScope(scope, playing);

  // A saved "on" can't start audio by itself (browsers need a click or key first), so the radio
  // comes back on with the visitor's first interaction.
  useEffect(() => {
    if (!soundEnabled()) return undefined;
    const start = () => play();
    window.addEventListener('pointerdown', start, { once: true });
    window.addEventListener('keydown', start, { once: true });
    return () => {
      window.removeEventListener('pointerdown', start);
      window.removeEventListener('keydown', start);
    };
  }, []);

  const power = () => {
    // read the live setting, not the render's copy, so fast double-clicks stay in sync
    const next = !soundEnabled();
    setSound(next);
    setOn(next);
    onPower?.(next);
    if (next) play();
    else stop();
  };

  return (
    <div className="radio" role="group" aria-label="Sound and music" data-on={on || undefined}>
      <span className="radio__rivet radio__rivet--l" aria-hidden="true" />
      <span className="radio__rivet radio__rivet--r" aria-hidden="true" />

      <button type="button" className="radio__switch" role="switch" aria-checked={on} aria-label="Sound" onClick={power}>
        <span className="radio__lever" aria-hidden="true" />
      </button>

      <button
        type="button"
        className="radio__screen"
        aria-label={`Station: ${stationNames[station]}. Next station`}
        onClick={() => tune(station + 1)}
        disabled={!on}
      >
        <canvas ref={scope} className="radio__scope" aria-hidden="true" />
        <span className="radio__station" aria-hidden="true">{on ? stationNames[station] : 'Off'}</span>
      </button>

      <div className="radio__tune">
        <button type="button" className="radio__arrow" aria-label="Previous station" onClick={() => tune(station - 1)} disabled={!on}>
          <svg viewBox="0 0 10 12" aria-hidden="true" focusable="false"><path d="M8 1L2 6L8 11Z" /></svg>
        </button>
        <button type="button" className="radio__arrow" aria-label="Next station" onClick={() => tune(station + 1)} disabled={!on}>
          <svg viewBox="0 0 10 12" aria-hidden="true" focusable="false"><path d="M2 1L8 6L2 11Z" /></svg>
        </button>
      </div>

      <label className="radio__fader">
        <span className="visually-hidden">Volume</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={vol}
          onChange={(e) => {
            const v = Number(e.target.value);
            setVol(v);
            setVolume(v);
          }}
        />
      </label>
      <span className="visually-hidden" aria-live="polite">{on ? `Playing ${stationNames[station]}` : ''}</span>
    </div>
  );
}
