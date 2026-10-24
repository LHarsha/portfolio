import { blobPath, spiralArm } from '../lib/shapes.js';
import { rng } from '../lib/rng.js';
import './portal.css';

// Flat-band cartoon portal: pale splashy rim, three greens, spiral arms, and a starry core
// you can see the other side through.
// Two stacked layers so spinning is cheap: the back SVG (rim, bands) stays put and boils by
// flipping between three drawn takes (no SVG filter: those are CPU-drawn and costly at this size); the
// front SVG (arms, core) turns as a whole element, which the compositor can rotate without
// repainting the rim. `.portal__front` is free for scroll-driven rotation; the inner
// `.portal__arms` idles via CSS.
// Three takes of the rim and splats, flipped every ~120ms (CSS) for line boil without a filter.
const takes = [0, 1, 2];
const rims = takes.map((t) => blobPath({ r: 168, jag: 0.05, splash: 0.16, points: 34, seed: 4, boil: t && 0.012, boilSeed: t }));
const band = blobPath({ r: 150, jag: 0.04, splash: 0.05, points: 28, seed: 9 });
const inner = blobPath({ r: 112, jag: 0.06, points: 22, seed: 2 });
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

const thick = [0, 1, 2].map((i) => spiralArm({ r0: 22, r1: 142, turns: 0.85, offset: (i / 3) * Math.PI * 2 }));
const thin = [0, 1, 2].map((i) => spiralArm({ r0: 40, r1: 132, turns: 0.7, offset: (i / 3) * Math.PI * 2 + 1 }));

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
        <path d={band} fill="var(--portal)" />
        <path d={inner} fill="var(--portal)" stroke="var(--portal-dark)" strokeWidth="6" />
      </svg>
      <div className="portal__front">
        <svg className={spin ? 'portal__arms' : undefined} viewBox={box} focusable="false">
          {thick.map((d, i) => (
            <path key={i} d={d} fill="none" stroke="var(--portal-dark)" strokeWidth="20" strokeLinecap="round" />
          ))}
          {thin.map((d, i) => (
            <path key={i} d={d} fill="none" stroke="var(--portal-light)" strokeWidth="5" strokeLinecap="round" />
          ))}
          <path d={coreRim} fill="var(--portal-light)" />
          <path d={core} fill="var(--space)" />
          {coreStars.map(([x, y, r]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill="var(--labcoat)" />
          ))}
        </svg>
      </div>
    </div>
  );
}
