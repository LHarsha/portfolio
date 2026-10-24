import { dripPath } from '../lib/shapes.js';

// A stage entry: the scene's colour pours down over the one before, drips leading. The flood is the
// scene's background on the stage; the scene's content sits above it. Hidden on the stacked page.
const W = 1200;
const drips = [
  { x: 40, w: 10, len: 52 },
  { x: 150, w: 15, len: 84 },
  { x: 260, w: 8, len: 38 },
  { x: 380, w: 12, len: 66 },
  { x: 505, w: 17, len: 100 },
  { x: 615, w: 9, len: 44 },
  { x: 740, w: 13, len: 74 },
  { x: 850, w: 10, len: 54 },
  { x: 960, w: 16, len: 92 },
  { x: 1075, w: 9, len: 42 },
  { x: 1160, w: 12, len: 62 },
];

export function Flood({ color }) {
  return (
    <div className="flood" style={{ '--flood': color }} aria-hidden="true">
      <svg className="flood__drips" viewBox={`0 0 ${W} 110`} preserveAspectRatio="none" focusable="false">
        {drips.map((d) => (
          <path key={d.x} d={dripPath(d.x, d.w, d.len + 10)} />
        ))}
      </svg>
    </div>
  );
}

// Adds a flood entry to a stage timeline: the panel's colour pours down over what's behind it.
// A panel inside a scene is also shown at that moment; a whole scene is shown by the story itself.
export function pour(tl, panel, at, len) {
  const flood = panel.querySelector(':scope > .flood');
  if (!panel.hasAttribute('data-scene')) tl.fromTo(panel, { opacity: 0 }, { opacity: 1, duration: 0.001 }, at);
  tl.fromTo(
    flood,
    { yPercent: -100 },
    { yPercent: 0, duration: len, ease: 'power1.in' },
    at,
  );
}
