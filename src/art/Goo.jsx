import { taperedDrip, fallingDrop } from '../lib/shapes.js';

// Slime hanging off the bottom edge of whatever it's placed in (parent must be position: relative):
// tapered drips with round bulbs and a shine on the fat ones. On a button's hover the drips stretch
// and one drop lets go (base.css).
const drips = [
  { x: 16, w: 6, len: 24 },
  { x: 43, w: 8, len: 38, shine: true },
  { x: 69, w: 5, len: 17 },
  { x: 93, w: 7, len: 30, shine: true },
];

export function Goo({ color = 'var(--portal)', className = '' }) {
  return (
    <svg className={`goo ${className}`} viewBox="0 -4 110 50" aria-hidden="true" focusable="false">
      <path d="M0 -4H110V3C98 5 86 2 74 4S48 6 34 3S10 5 0 3Z" fill={color} />
      {drips.map((d) => (
        <g key={d.x} className="goo__drip">
          <path d={taperedDrip(d.x, d.w, d.len)} fill={color} stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
          {d.shine && <ellipse cx={d.x - d.w * 0.22} cy={d.len - d.w * 0.85} rx={d.w * 0.18} ry={d.w * 0.26} fill="var(--labcoat)" opacity="0.8" />}
        </g>
      ))}
      <path className="goo__drop" d={fallingDrop(43, 3.6, 33)} fill={color} stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
