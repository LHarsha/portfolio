import { blobPath, spiralArm } from '../lib/shapes.js';
import { rng } from '../lib/rng.js';
import './portal.css';

// Flat-band cartoon portal: pale splashy rim, three greens, spiral arms.
// Only the arms spin; the rim boils in place.
const rim = blobPath({ r: 168, jag: 0.05, splash: 0.16, points: 34, seed: 4 });
const band = blobPath({ r: 150, jag: 0.04, splash: 0.05, points: 28, seed: 9 });
const inner = blobPath({ r: 112, jag: 0.06, points: 22, seed: 2 });
const core = blobPath({ r: 30, jag: 0.12, points: 12, seed: 7 });

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
      <g className={spin ? 'portal__arms' : undefined}>
        {thick.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="var(--portal-dark)" strokeWidth="20" strokeLinecap="round" />
        ))}
        {thin.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="var(--portal-light)" strokeWidth="5" strokeLinecap="round" />
        ))}
      </g>
      <path d={core} fill="var(--portal-light)" />
    </svg>
  );
}
