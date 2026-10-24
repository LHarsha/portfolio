import { dripPath } from '../lib/shapes.js';

// Slime hanging off the bottom edge of whatever it's placed in (parent must be position: relative).
const drips = [
  { x: 16, w: 6, len: 26 },
  { x: 43, w: 8, len: 40 },
  { x: 70, w: 5, len: 18 },
  { x: 93, w: 7, len: 31 },
];

export function Goo({ color = 'var(--portal)', className = '' }) {
  return (
    <svg className={`goo ${className}`} viewBox="0 -4 110 50" aria-hidden="true" focusable="false">
      <path d="M0 -4H110V3C98 5 86 2 74 4S48 6 34 3S10 5 0 3Z" fill={color} />
      {drips.map((d) => (
        <path key={d.x} className="goo__drip" d={dripPath(d.x, d.w, d.len)} fill={color} stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
      ))}
    </svg>
  );
}
