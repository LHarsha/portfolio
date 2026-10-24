import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { dripPath } from '../lib/shapes.js';
import { chapters } from '../data/chapters.js';

gsap.registerPlugin(ScrollTrigger, useGSAP);

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

// The hand-over between chapters: as a chapter scrolls in, the goo from the one above stretches
// down over it. from: the chapter above (its colour is the goo's); color overrides it.
export function GooEdge({ className = '', from, color }) {
  const root = useRef(null);
  const goo = color ?? chapters.find((c) => c.id === from)?.bg;

  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          root.current.querySelectorAll('.goo-edge__drip'),
          { scaleY: 0.4 },
          {
            scaleY: 1.25,
            transformOrigin: '50% 0%',
            ease: 'none',
            stagger: { each: 0.03, from: 'random' },
            scrollTrigger: { trigger: root.current.parentElement, start: 'top bottom', end: 'top 10%', scrub: 0.8 },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <svg ref={root} className={`goo-edge ${className}`} style={goo ? { '--goo': goo } : undefined} viewBox={`0 0 ${W} 110`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
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
