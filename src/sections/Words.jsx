import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { statements } from '../data/facts.js';
import { GooEdge } from '../art/GooEdge.jsx';
import { Drift } from '../art/Drift.jsx';
import { Flood, pour, tipsy } from '../art/Flood.jsx';
import { points, useScene } from '../lib/story.js';
import { rng } from '../lib/rng.js';
import './words.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// In my words: Harsha's three statements, one per screen, each with one trick on its key word.
// On the stage they swap in place, each pouring down over the last; on phones they stack.
// Markup is the finished state; tricks run from a rough start state only when motion is allowed.

/* ---------- 1. working: a rough v0.1 straightens into v1.0, then keeps improving ---------- */
const tilts = [-14, 9, -7, 12, -9, 6, -12];
const lifts = [10, -14, 6, -10, 14, -6, 9];
const versions = ['v0.1', 'v0.4', 'v0.7', 'v1.0'];
const later = ['v1.0', 'v1.1', 'v1.2', 'v1.3'];
function tagger(tag) {
  const pick = (list, p) => list[Math.min(list.length - 1, Math.floor(gsap.utils.clamp(0, 0.999, p) * list.length))];
  return {
    rough: (p) => {
      const v = pick(versions, p);
      if (tag.textContent !== v) tag.textContent = v;
      tag.classList.toggle('is-rough', v !== 'v1.0');
    },
    later: (p) => {
      const v = pick(later, p);
      if (tag.textContent !== v) tag.textContent = v;
    },
  };
}

function Working() {
  const s = statements.working;
  return (
    <article className="words words--working belief" aria-labelledby="working-title">
      <GooEdge from="about" />
      <Drift seed={7} corner="br" />
      <div className="words__inner" data-exit>
        <h2 id="working-title" className="words__head">
          {s.lead}
          <span className="working__key">
            <span className="visually-hidden">{s.key}</span>
            {[...s.key].map((c, i) => (
              <span className="working__char" key={i} aria-hidden="true">
                {c}
              </span>
            ))}
            <svg className="working__tape" viewBox="0 0 300 50" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <path d="M6 10L294 4L292 40L8 46Z" fill="var(--labcoat)" stroke="var(--ink)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
              <path d="M40 14L36 38M110 11L106 36M190 9L186 35M260 7L256 33" stroke="#c9d4cf" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
            <span className="working__tag" aria-hidden="true">v1.0</span>
          </span>
          {s.tail}
        </h2>
        <p className="words__more" data-depth style={{ '--depth': 0.18 }}>{s.more}</p>
      </div>
    </article>
  );
}

/* ---------- 2. useful: an ink loop draws itself around the key word ---------- */
function Useful() {
  const s = statements.useful;
  return (
    <article className="words words--useful belief" aria-labelledby="useful-title">
      <Flood color="var(--alien)" />
      <GooEdge color="var(--portal)" />
      <Drift seed={9} corner="tr" />
      <div className="words__inner" data-exit>
        <h2 id="useful-title" className="words__head">
          <span className="words__line">
            {s.line1[0]}
            {s.line1[1]}
            {s.line1[2]}
          </span>{' '}
          <span className="words__line">
            {s.line2[0]}
            <span className="useful__key">
              {s.line2[1]}
              <svg className="useful__loop" viewBox="0 0 300 140" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                <path
                  pathLength="1"
                  d="M196 22C150 8 64 12 30 38C2 60 10 104 66 120C130 138 236 132 276 104C304 82 290 40 236 24C214 18 176 18 150 24"
                />
              </svg>
            </span>
            {s.line2[2]}
          </span>
        </h2>
        <p className="words__more" data-depth style={{ '--depth': 0.18 }}>{s.more}</p>
      </div>
    </article>
  );
}

/* ---------- 3. easier: a tangled scribble untangles into a clean underline ---------- */
const W = 600;
const N = 90;
const tangled = (() => {
  const rand = rng(17);
  return Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    const a = t * Math.PI * 2 * 6.5;
    return [t * W + Math.sin(a) * 70 + (rand() - 0.5) * 14, 52 + Math.cos(a * 1.07) * 62 + (rand() - 0.5) * 16];
  });
})();
const straight = Array.from({ length: N }, (_, i) => [(i / (N - 1)) * W, 108]);
function scribble(k) {
  let d = '';
  for (let i = 0; i < N; i++) {
    const x = tangled[i][0] + (straight[i][0] - tangled[i][0]) * k;
    const y = tangled[i][1] + (straight[i][1] - tangled[i][1]) * k;
    d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}
const straightPath = scribble(1);

function Easier() {
  const s = statements.easier;
  return (
    <article className="words words--easier belief" aria-labelledby="easier-title">
      <Flood color="var(--space)" />
      <GooEdge color="var(--alien)" />
      <Drift seed={11} corner="br" tone="light" />
      <div className="words__inner" data-exit>
        <h2 id="easier-title" className="words__head">
          {s.lead}
          <span className="easier__key">
            <svg className="easier__scribble" viewBox={`0 0 ${W} 120`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <path className="easier__line" d={straightPath} />
            </svg>
            {s.key}
          </span>
          {s.tail}
        </h2>
        <p className="words__more" data-depth style={{ '--depth': 0.18 }}>{s.more}</p>
      </div>
    </article>
  );
}

// the three tricks, each written once and timed by whoever plays it (the stage or a phone's scroll)
function tricks(root) {
  const q = gsap.utils.selector(root);
  const tags = tagger(q('.working__tag')[0]);
  const line = q('.easier__line')[0];
  const untangle = { k: 0 };
  const draw = () => line.setAttribute('d', scribble(untangle.k));
  const rough = { p: 0 };
  const improve = { p: 0 };
  return {
    working: (tl, at, len) =>
      tl
        .fromTo(q('.working__tape'), { scaleX: 1, rotate: -7, autoAlpha: 1 }, { scaleX: 0, rotate: -20, autoAlpha: 0, transformOrigin: '100% 50%', duration: len * 0.4, ease: 'power2.in' }, at)
        .fromTo(q('.working__char'), { rotate: (i) => tilts[i % tilts.length], y: (i) => lifts[i % lifts.length] }, { rotate: 0, y: 0, duration: len * 0.5, ease: 'back.out(2)', stagger: len * 0.08 }, at + len * 0.2)
        .fromTo(rough, { p: 0 }, { p: 1, duration: len, onUpdate: () => tags.rough(rough.p) }, at),
    improving: (tl, at, len) => tl.fromTo(improve, { p: 0 }, { p: 1, duration: len, onUpdate: () => tags.later(improve.p) }, at),
    useful: (tl, at, len) => tl.fromTo(q('.useful__loop path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: len, ease: 'power1.inOut' }, at),
    easier: (tl, at, len) => {
      draw();
      return tl.fromTo(untangle, { k: 0 }, { k: 1, duration: len, ease: 'power2.inOut', onUpdate: draw }, at);
    },
    reset: () => {
      tags.rough(1);
      line.setAttribute('d', straightPath);
    },
  };
}

export function Words() {
  const root = useRef(null);

  useScene({
    id: 'words',
    inLen: 0.45,
    build: ({ tl, q, el, exit }) => {
      const t = tricks(el);
      const [, useful, easier] = q('.belief');
      const inner = (panel) => panel.querySelector('.words__inner');
      const more = (panel) => panel.querySelector('.words__more');
      const [working] = q('.belief');

      // entry: the chapter opens out of Hello's full stop
      tl.fromTo(
        el,
        { clipPath: () => `circle(0% at ${points.zoom.x}px ${points.zoom.y}px)` },
        { clipPath: () => `circle(150% at ${points.zoom.x}px ${points.zoom.y}px)`, duration: 0.45, ease: 'power2.in' },
        0,
      );
      // 1. working, then its paragraph reads in
      t.working(tl, 0.42, 0.5);
      tl.fromTo(more(working), { opacity: 0.15 }, { opacity: 1, duration: 0.3 }, 0.8).addLabel('settle', 1.12);
      // ...then keep improving it: past v1.0 while the next belief pours in
      t.improving(tl, 1.2, 0.45);
      // 2. useful pours in
      pour(tl, useful, 1.3, 0.35);
      tipsy(tl, inner(working), 1.28, 0.4);
      tl.fromTo(inner(useful), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.15 }, 1.55);
      t.useful(tl, 1.65, 0.45);
      tl.fromTo(more(useful), { opacity: 0.15 }, { opacity: 1, duration: 0.3 }, 2.0).addLabel('useful', 2.32);
      // 3. easier pours in
      pour(tl, easier, 2.45, 0.35);
      tipsy(tl, inner(useful), 2.43, 0.4);
      tl.fromTo(inner(easier), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.15 }, 2.7);
      t.easier(tl, 2.8, 0.5);
      tl.fromTo(more(easier), { opacity: 0.15 }, { opacity: 1, duration: 0.3 }, 3.2).addLabel('easier', 3.52).to({}, { duration: 0.15 }, 3.5);
      // exit: the last belief lifts away
      tl.to(inner(easier), { y: -60, opacity: 0, duration: exit }, tl.duration());
      return t.reset;
    },
    // the header follows the belief on screen: green, then pink, then space
    toneAt: (t) => (t >= 2.62 ? { tone: 'dark', bg: 'var(--space)' } : t >= 1.47 ? { bg: 'var(--alien)' } : null),
  });

  // phones: no stage; each trick plays as its belief scrolls in, done just before it reaches the top
  useGSAP(
    () => {
      gsap.matchMedia().add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        const t = tricks(root.current);
        const [working, useful, easier] = gsap.utils.toArray('.belief', root.current);
        const play = (panel) => gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: panel, start: 'top 95%', end: 'top 5%', scrub: 0.5 } });
        t.working(play(working), 0, 0.7);
        t.improving(gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: working, start: 'top top', end: 'bottom top', scrub: true } }), 0, 1);
        t.useful(play(useful), 0.05, 0.6);
        t.easier(play(easier), 0.05, 0.6);
        return t.reset;
      });
    },
    { scope: root },
  );

  return (
    <section id="words" className="beliefs scene" data-scene ref={root} aria-label="In my words">
      <Working />
      <Useful />
      <Easier />
    </section>
  );
}
