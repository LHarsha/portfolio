import { blobPath, spiralArm } from '../lib/shapes.js';
import { rng } from '../lib/rng.js';
import './portal.css';

// Flat-band cartoon portal: pale splashy rim, three greens, spiral arms, and a starry core
// you can see the other side through. Only the arms spin; the rim boils in place.
const rim = blobPath({ r: 168, jag: 0.05, splash: 0.16, points: 34, seed: 4 });
const band = blobPath({ r: 150, jag: 0.04, splash: 0.05, points: 28, seed: 9 });
const inner = blobPath({ r: 112, jag: 0.06, points: 22, seed: 2 });
const coreRim = blobPath({ r: 36, jag: 0.12, points: 12, seed: 7 });
// Shared with the hero's dive so the hole that swallows the screen is this exact shape.
export const holeShape = { r: 100, jag: 0.12, points: 12, seed: 8 };
const core = blobPath({ ...holeShape, r: 27 });
const coreStars = [[-9, -8, 1.8], [8, -3, 1.3], [-2, 9, 1.5], [12, 9, 1]];

const splats = (() => {
  const rand = rng(31);
  return Array.from({ length: 7 }, (_, i) => {
    const a = (i / 7) * Math.PI * 2 + rand() * 0.6;
    const d = 186 + rand() * 16;
    return blobPath({ cx: Math.cos(a) * d, cy: Math.sin(a) * d, r: 5 + rand() * 7, jag: 0.25, points: 9, seed: 50 + i });
  });
})();

const thick = [0, 1, 2].map((i) => spiralArm({ r0: 22, r1: 142, turns: 0.85, offset: (i / 3) * Math.PI * 2 }));
const thin = [0, 1, 2].map((i) => spiralArm({ r0: 40, r1: 132, turns: 0.7, offset: (i / 3) * Math.PI * 2 + 1 }));

export function Portal({ className = '', spin = true }) {
  return (
    <svg className={`portal ${className}`} viewBox="-220 -220 440 440" aria-hidden="true" focusable="false">
      <g className="boil">
        {splats.map((d, i) => (
          <path key={i} d={d} fill="var(--portal-light)" stroke="var(--ink)" strokeWidth="3.5" />
        ))}
        <path d={rim} fill="var(--portal-light)" stroke="var(--ink)" strokeWidth="5" strokeLinejoin="round" />
      </g>
      <path d={band} fill="var(--portal)" />
      <path d={inner} fill="var(--portal)" stroke="var(--portal-dark)" strokeWidth="6" />
      {/* outer group is free for scroll-driven rotation; the inner one idles via CSS */}
      <g className="portal__spin">
        <g className={spin ? 'portal__arms' : undefined}>
          {thick.map((d, i) => (
            <path key={i} d={d} fill="none" stroke="var(--portal-dark)" strokeWidth="20" strokeLinecap="round" />
          ))}
          {thin.map((d, i) => (
            <path key={i} d={d} fill="none" stroke="var(--portal-light)" strokeWidth="5" strokeLinecap="round" />
          ))}
        </g>
      </g>
      <path d={coreRim} fill="var(--portal-light)" />
      <path d={core} fill="var(--space)" />
      {coreStars.map(([x, y, r]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill="var(--labcoat)" />
      ))}
    </svg>
  );
}
