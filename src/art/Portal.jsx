import { blobPath } from '../lib/shapes.js';
import { rng } from '../lib/rng.js';
import './portal.css';

// Flat-band cartoon portal: a pale splashy rim around a funnel of greens that darken toward a
// starry core you can see the other side through, tapered swirl ribbons, and flecks of light
// being pulled in. All flat colour and ink, no glow.
// Layers, so spinning is cheap: the back SVG (rim, funnel bands) stays put and boils by flipping
// between three drawn takes (no SVG filter: those are CPU-drawn and costly at this size); the
// front layers (ribbons, then flecks and core) each turn as a whole element, which the compositor
// can rotate without repainting the rim. The inner layer turns faster, so the swirl reads as a
// vortex. `.portal__front` is free for scroll-driven rotation; the inner layers idle via CSS.
const takes = [0, 1, 2];
const rims = takes.map((t) => blobPath({ r: 168, jag: 0.05, splash: 0.16, points: 34, seed: 4, boil: t && 0.012, boilSeed: t }));
// the funnel: each band a little smaller and darker
const bands = [
  { d: blobPath({ r: 150, jag: 0.04, splash: 0.05, points: 28, seed: 9 }), fill: 'var(--portal)' },
  { d: blobPath({ r: 120, jag: 0.06, points: 24, seed: 2 }), fill: 'var(--portal-mid)' },
  { d: blobPath({ r: 90, jag: 0.07, points: 20, seed: 13 }), fill: 'var(--portal-dark)' },
  { d: blobPath({ r: 60, jag: 0.08, points: 16, seed: 17 }), fill: 'var(--portal-ink)' },
];
const coreRim = blobPath({ r: 36, jag: 0.12, points: 12, seed: 7 });
// Shared with the hero's dive so the hole that swallows the screen is this exact shape.
export const holeShape = { r: 100, jag: 0.12, points: 12, seed: 8 };
const core = blobPath({ ...holeShape, r: 27 });
const coreStars = [[-9, -8, 1.8], [8, -3, 1.3], [-2, 9, 1.5], [12, 9, 1]];

const splats = takes.map((t) => {
  const rand = rng(31);
  return Array.from({ length: 7 }, (_, i) => {
    const a = (i / 7) * Math.PI * 2 + rand() * 0.6;
    const d = 186 + rand() * 16;
    const r = 5 + rand() * 7;
    return blobPath({ cx: Math.cos(a) * d, cy: Math.sin(a) * d, r, jag: 0.25, points: 9, seed: 50 + i, boil: t && 0.08, boilSeed: t + i * 3 });
  });
});

const f = (n) => n.toFixed(1);
// A swirl ribbon: follows a spiral from r0 out to r1, fat in the middle and tapered at both ends.
function ribbon({ r0, r1, turns, offset, width, steps = 36 }) {
  const out = [];
  const back = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = offset + t * turns * Math.PI * 2;
    const r = r0 + (r1 - r0) * t;
    const w = (width * Math.sin(Math.PI * t) ** 0.8) / 2;
    out.push(`${f(Math.cos(a) * (r + w))} ${f(Math.sin(a) * (r + w))}`);
    back.unshift(`${f(Math.cos(a) * (r - w))} ${f(Math.sin(a) * (r - w))}`);
  }
  return `M${out.join('L')}L${back.join('L')}Z`;
}
const thirds = [0, 1, 2].map((i) => (i / 3) * Math.PI * 2);
const darkRibbons = thirds.map((o) => ribbon({ r0: 30, r1: 146, turns: 0.85, offset: o, width: 30 }));
const lightRibbons = thirds.map((o) => ribbon({ r0: 46, r1: 136, turns: 0.7, offset: o + 1.05, width: 11 }));
// flecks of light being pulled in, on the faster inner layer
const flecks = (() => {
  const rand = rng(64);
  return Array.from({ length: 11 }, (_, i) => {
    const a = (i / 11) * Math.PI * 2 + rand() * 0.4;
    const d = 44 + rand() * 96;
    return { d: blobPath({ cx: Math.cos(a) * d, cy: Math.sin(a) * d, r: 2.5 + rand() * 3.5, jag: 0.3, points: 7, seed: 80 + i }), light: i % 3 !== 0 };
  });
})();
// a glossy streak along the rim, top left, where the light would catch it
const gloss = 'M-118 -96Q-72 -146 -6 -152';

const box = '-220 -220 440 440';

export function Portal({ className = '', spin = true }) {
  return (
    <div className={`portal ${className}`} aria-hidden="true">
      <svg className="portal__back" viewBox={box} focusable="false">
        <g className="portal__rim">
          {takes.map((t) => (
            <g key={t} className="portal__take">
              {splats[t].map((d, i) => (
                <path key={i} d={d} fill="var(--portal-light)" stroke="var(--ink)" strokeWidth="3.5" />
              ))}
              <path d={rims[t]} fill="var(--portal-light)" stroke="var(--ink)" strokeWidth="5" strokeLinejoin="round" />
            </g>
          ))}
        </g>
        {bands.map((b, i) => (
          <path key={i} d={b.d} fill={b.fill} />
        ))}
        <path d={gloss} fill="none" stroke="var(--labcoat)" strokeWidth="7" strokeLinecap="round" opacity="0.85" />
      </svg>
      <div className="portal__front">
        <svg className={spin ? 'portal__arms' : undefined} viewBox={box} focusable="false">
          {darkRibbons.map((d, i) => (
            <path key={i} d={d} fill="var(--portal-ink)" opacity="0.75" />
          ))}
          {lightRibbons.map((d, i) => (
            <path key={i} d={d} fill="var(--portal-light)" />
          ))}
        </svg>
        <svg className={spin ? 'portal__inner' : undefined} viewBox={box} focusable="false">
          {flecks.map((k, i) => (
            <path key={i} d={k.d} fill={k.light ? 'var(--portal-light)' : 'var(--labcoat)'} />
          ))}
          <path d={coreRim} fill="var(--portal-light)" stroke="var(--ink)" strokeWidth="2.5" />
          <path d={core} fill="var(--space)" />
          {coreStars.map(([x, y, r]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill="var(--labcoat)" />
          ))}
        </svg>
      </div>
    </div>
  );
}
