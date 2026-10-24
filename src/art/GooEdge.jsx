import { dripPath } from '../lib/shapes.js';

// Goo hanging off the bottom of the chapter above, drawn across the top of the chapter below.
// Stretched to the chapter's width (preserveAspectRatio none), so bulbs go a little oval: fine for goo.
const W = 1200;
const drips = [
  { x: 60, w: 9, len: 46 },
  { x: 170, w: 14, len: 78 },
  { x: 255, w: 7, len: 34 },
  { x: 390, w: 11, len: 62 },
  { x: 520, w: 16, len: 96 },
  { x: 610, w: 8, len: 40 },
  { x: 735, w: 12, len: 70 },
  { x: 860, w: 9, len: 50 },
  { x: 965, w: 15, len: 88 },
  { x: 1080, w: 8, len: 38 },
  { x: 1150, w: 11, len: 58 },
];

// color: the chapter above's colour (defaults to space, for the drip after the portal dive).
export function GooEdge({ className = '', color }) {
  return (
    <svg className={`goo-edge ${className}`} style={color ? { '--goo': color } : undefined} viewBox={`0 0 ${W} 110`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {drips.map((d) => (
        <path key={d.x} className="goo-edge__drip" d={dripPath(d.x, d.w, d.len + 10)} />
      ))}
      <path
        className="goo-edge__band"
        d={`M0 0H${W}V12C1120 16 1060 9 990 13S860 18 780 12 640 8 560 14 420 17 340 11 200 9 120 14 40 15 0 11Z`}
      />
    </svg>
  );
}
