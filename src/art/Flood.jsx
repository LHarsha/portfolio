import gsap from 'gsap';
import { rng } from '../lib/rng.js';
import { fallingDrop } from '../lib/shapes.js';

// A stage entry: the next scene's colour surges up over the one before like a knocked-over drink.
// The surface comes in tilted and sloshes level, with a foaming head on top, splashes flung off
// the crest, and fizz rising through it. The spill becomes the scene's background on the stage;
// its content sits above. Hidden on the stacked page.
const W = 2400; // the crest's drawing width: the spill is wider than the screen so it can tilt
const H = 160;
const SURFACE = 104;
const f = (n) => Math.round(n * 10) / 10;

// a wavy surface, drawn a little past both edges
function surface(phase, amp, offset = 0) {
  const pts = [];
  for (let x = -600; x <= W + 600; x += 24) {
    const y = SURFACE + offset + Math.sin((x / 520) * Math.PI * 2 + phase) * amp + Math.sin((x / 190) * Math.PI * 2 + phase * 1.6) * amp * 0.3;
    pts.push([x, y]);
  }
  return pts;
}
const fillBelow = (pts) => `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L')}L${W + 600} ${H}L-600 ${H}Z`;
const front = surface(0, 9);
const back = surface(2.4, 11, -6);

// the foaming head: a band riding the surface with a scalloped top made of bubbles
const foam = (() => {
  const r = rng(5);
  const top = [];
  const bot = [];
  for (let i = 0; i < front.length; i++) {
    const [x, y] = front[i];
    bot.unshift(`${f(x)} ${f(y + 14)}`);
    if (i % 2 === 0) top.push([x, y - 18 - r() * 14]);
  }
  let d = `M${f(top[0][0])} ${f(top[0][1])}`;
  for (let i = 1; i < top.length; i++) {
    const [x, y] = top[i];
    const rad = (x - top[i - 1][0]) / 2 + 3;
    d += `A${f(rad)} ${f(rad * 0.8)} 0 0 1 ${f(x)} ${f(y)}`;
  }
  return `${d}L${bot.join('L')}Z`;
})();
// little bubbles in the foam
const foamBubbles = (() => {
  const r = rng(9);
  return Array.from({ length: 110 }, () => {
    const [x, y] = front[Math.floor(r() * front.length)];
    return { x, y: y - 2 - r() * 22, r: 2.5 + r() * 6 };
  });
})();
// splashes flung up off the crest
const splashes = (() => {
  const r = rng(21);
  return Array.from({ length: 14 }, () => ({ x: 120 + r() * (W - 240), r: 8 + r() * 10, up: 70 + r() * 110, side: (r() - 0.5) * 110 }));
})();
// fizz rising through the drink
const fizz = (() => {
  const r = rng(77);
  return Array.from({ length: 16 }, () => ({ x: 3 + r() * 94, y: 6 + r() * 70, s: 6 + r() * 14 }));
})();

export function Flood({ color }) {
  return (
    <div className="flood" style={{ '--flood': color }} aria-hidden="true">
      <div className="spill">
        <svg className="spill__crest" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" focusable="false">
          <g className="spill__wave spill__wave--back">
            <path className="spill__shade" d={fillBelow(back)} />
          </g>
          <g className="spill__wave spill__wave--front">
            <path className="spill__liquid" d={fillBelow(front)} />
            <path className="spill__foam" d={foam} />
            {foamBubbles.map((b, i) => (
              <circle key={i} className="spill__foam-bubble" cx={f(b.x)} cy={f(b.y)} r={f(b.r)} />
            ))}
          </g>
          {splashes.map((s, i) => (
            <path key={i} className="spill__splash" d={fallingDrop(s.x, s.r, SURFACE - 30 - s.r * 2)} data-up={f(s.up)} data-side={f(s.side)} />
          ))}
        </svg>
        <div className="spill__body">
          {fizz.map((b, i) => (
            <span key={i} className="spill__fizz" style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.s, height: b.s }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Adds a spill entry to a stage timeline. A panel inside a scene is also shown at that moment; a
// whole scene is shown by the story itself.
export function pour(tl, panel, at, len) {
  const flood = panel.querySelector(':scope > .flood');
  const q = gsap.utils.selector(flood);
  const spill = q('.spill')[0];
  const crest = q('.spill__crest')[0];
  if (!panel.hasAttribute('data-scene')) tl.fromTo(panel, { opacity: 0 }, { opacity: 1, duration: 0.001 }, at);
  // surge up from below the screen, fast at first and settling at the top
  tl.fromTo(spill, { y: () => flood.clientHeight + crest.clientHeight }, { y: 0, duration: len, ease: 'power2.out' }, at)
    // tilted as it comes in, then sloshes back and forth until it's level
    .fromTo(spill, { rotation: -9 }, { keyframes: { rotation: [-9, 5, -2.5, 1, 0] }, duration: len, ease: 'none' }, at)
    // splashes leap off the crest and fall back
    .fromTo(
      q('.spill__splash'),
      { x: 0, y: 0, opacity: 0 },
      { keyframes: { x: [0, (i, t) => +t.dataset.side * 0.6, (i, t) => +t.dataset.side], y: [0, (i, t) => -t.dataset.up, 40], opacity: [1, 1, 0] }, duration: len * 0.6, stagger: { each: len * 0.03, from: 'random' }, ease: 'none' },
      at + len * 0.15,
    )
    // fizz rises through it, and is gone once it's settled
    .fromTo(q('.spill__fizz'), { y: 0, opacity: 1 }, { keyframes: { y: [0, () => -window.innerHeight * 0.25, () => -window.innerHeight * 0.35], opacity: [1, 1, 0] }, duration: len + 0.15, stagger: 0.012 }, at);
}

// The room tilts a little as the drink washes over it: a woozy sway for whatever is being covered.
export function tipsy(tl, el, at, len) {
  tl.to(el, { keyframes: { rotation: [0, -2.4, 1.8, -0.9, 0], xPercent: [0, -1.4, 1.1, -0.4, 0], ease: 'sine.inOut' }, duration: len, ease: 'none' }, at);
}
