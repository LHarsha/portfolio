import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { statements } from '../data/facts.js';
import { GooEdge } from '../art/GooEdge.jsx';
import { rng } from '../lib/rng.js';
import './words.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Three scenes, one per statement, each with one trick on its key word.
// Markup is the finished state; tricks run from a rough start state only when motion is allowed.
const MOTION = '(prefers-reduced-motion: no-preference)';
// No pins: the page never stops. Each trick plays across the whole slide-in, from the moment the
// scene appears, and is done just before it reaches the top.
const play = (scene) => ({ trigger: scene, start: 'top 95%', end: 'top 5%', scrub: 0.5 });

/* ---------- 1. working: a rough v0.1 straightens into v1.0 ---------- */
const tilts = [-14, 9, -7, 12, -9, 6, -12];
const lifts = [10, -14, 6, -10, 14, -6, 9];

function Working() {
  const root = useRef(null);
  const s = statements.working;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const tag = q('.working__tag')[0];
      gsap.matchMedia().add(MOTION, () => {
        const versions = ['v0.1', 'v0.4', 'v0.7', 'v1.0'];
        const setTag = (p) => {
          const v = versions[Math.min(versions.length - 1, Math.floor(p * versions.length))];
          if (tag.textContent !== v) tag.textContent = v;
          tag.classList.toggle('is-rough', v !== 'v1.0');
        };
        setTag(0);
        gsap
          .timeline({ defaults: { ease: 'none' }, scrollTrigger: { ...play(root.current), onUpdate: (st) => setTag(st.progress / 0.7) } })
          .fromTo(q('.working__tape'), { scaleX: 1, rotate: -7, autoAlpha: 1 }, { scaleX: 0, rotate: -20, autoAlpha: 0, transformOrigin: '100% 50%', duration: 0.25, ease: 'power2.in' }, 0)
          .fromTo(
            q('.working__char'),
            { rotate: (i) => tilts[i % tilts.length], y: (i) => lifts[i % lifts.length] },
            { rotate: 0, y: 0, duration: 0.3, ease: 'back.out(2)', stagger: 0.05 },
            0.15,
          )
          .to({}, { duration: 0.3 });
        // "...then keep improving it": as the statement scrolls away, the tag keeps going past v1.0
        const later = ['v1.0', 'v1.1', 'v1.2', 'v1.3'];
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          onUpdate: (st) => {
            const v = later[Math.min(later.length - 1, Math.floor(st.progress * later.length))];
            if (tag.textContent !== v) tag.textContent = v;
          },
        });
        return () => setTag(1);
      });
    },
    { scope: root },
  );

  return (
    <section id="words" className="words words--working" ref={root} aria-labelledby="working-title">
      <GooEdge from="about" />
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
    </section>
  );
}

/* ---------- 2. useful: an ink loop draws itself around the key word ---------- */
function Useful() {
  const root = useRef(null);
  const s = statements.useful;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.matchMedia().add(MOTION, () => {
        gsap
          .timeline({ defaults: { ease: 'none' }, scrollTrigger: play(root.current) })
          .fromTo(q('.useful__loop path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, ease: 'power1.inOut' }, 0.05)
          .to({}, { duration: 0.35 });
      });
    },
    { scope: root },
  );

  return (
    <section id="words-2" className="words words--useful" ref={root} aria-labelledby="useful-title">
      <GooEdge from="words" />
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
    </section>
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
  const root = useRef(null);
  const s = statements.easier;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const line = q('.easier__line')[0];
      gsap.matchMedia().add(MOTION, () => {
        const state = { k: 0 };
        const draw = () => line.setAttribute('d', scribble(state.k));
        draw();
        gsap
          .timeline({ defaults: { ease: 'none' }, scrollTrigger: play(root.current) })
          .fromTo(state, { k: 0 }, { k: 1, duration: 0.6, ease: 'power2.inOut', onUpdate: draw }, 0.05)
          .to({}, { duration: 0.35 });
        return () => line.setAttribute('d', straightPath);
      });
    },
    { scope: root },
  );

  return (
    <section id="words-3" className="words words--easier" ref={root} aria-labelledby="easier-title">
      <GooEdge from="words-2" />
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
    </section>
  );
}

export function Words() {
  return (
    <>
      <Working />
      <Useful />
      <Easier />
    </>
  );
}
