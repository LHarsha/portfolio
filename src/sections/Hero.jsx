import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Portal, holeShape } from '../art/Portal.jsx';
import { Arrow } from '../art/Arrow.jsx';
import { Drift } from '../art/Drift.jsx';
import { blobPath, sparklePath } from '../lib/shapes.js';
import { rng } from '../lib/rng.js';
import { whoosh } from '../lib/sound.js';
import { person, projects } from '../data/facts.js';
import { useReducedMotion } from '../lib/motion.js';
import { useScene } from '../lib/story.js';
import './hero.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const holePath = blobPath(holeShape);
const liveApps = projects.filter((p) => p.live);
const stars = (() => {
  const rand = rng(91);
  return Array.from({ length: 64 }, () => ({ x: rand() * 100, y: rand() * 100, r: 1 + rand() * 2, big: rand() < 0.12 }));
})();

// The dive: the copy steps aside, the portal slides to the middle and grows, and its starry core
// opens into a hole that swallows the screen. Shared by the stage and the phone's own pinned scene.
function buildDive(section, tl, { big }) {
  const q = gsap.utils.selector(section);
  const portal = q('.hero__portal')[0];
  // Layout offsets ignore transforms, so these stay right however far the dive has run.
  const toCentre = (axis) => () =>
    axis === 'x'
      ? section.clientWidth / 2 - (portal.offsetLeft + portal.offsetWidth / 2)
      : section.clientHeight / 2 - (portal.offsetTop + portal.offsetHeight / 2);
  const cover = () => (Math.hypot(window.innerWidth, window.innerHeight) / holeShape.r) * 1.25;
  // Written by hand: clipPath children are finicky about transform origins, this is exact.
  const holeEl = q('.dive__hole')[0];
  const hole = { s: 0 };
  // size is read once per refresh, not on every frame (reading it forces layout)
  let w = section.clientWidth;
  let h = section.clientHeight;
  const resize = () => ({ clientWidth: w, clientHeight: h } = section);
  ScrollTrigger.addEventListener('refreshInit', resize);
  const drawHole = () => holeEl.setAttribute('transform', `translate(${w / 2} ${h / 2}) scale(${hole.s})`);
  // side effects that follow the dive: hold the rim's boil still once it's moving, one whoosh going in
  const fx = { p: 0 };
  let last = 0;
  const onFx = () => {
    portal.firstElementChild?.classList.toggle('is-still', fx.p > 0.03);
    if (last < 0.4 && fx.p >= 0.4) whoosh();
    last = fx.p;
  };

  gsap.set(q('.dive'), { autoAlpha: 1 });
  tl.to(q('.hero__name, .hero__role, .hero__sticky, .hero__sticky-arrow'), { yPercent: -40, opacity: 0, duration: 0.18, stagger: 0.02 }, 0)
    .to(q('.hero__cue'), { autoAlpha: 0, duration: 0.08 }, 0)
    .to(portal, { x: toCentre('x'), y: toCentre('y'), scale: 1.25, duration: 0.3, ease: 'power1.inOut' }, 0)
    .to(portal, { scale: big ? 3.6 : 3, duration: 0.42, ease: 'power2.in' }, 0.3)
    .to(q('.portal__front'), { rotation: -300, duration: 0.72 }, 0)
    .fromTo(hole, { s: 0 }, { s: cover, duration: 0.36, ease: 'power3.in', onUpdate: drawHole }, 0.32)
    .fromTo(q('.dive__stars'), { scale: 1.25 }, { scale: 1, transformOrigin: '50% 50%', duration: 0.3 }, 0.6)
    .fromTo(q('.dive__caption'), { autoAlpha: 0, y: 30, rotate: -6 }, { autoAlpha: 1, y: 0, rotate: -2, duration: 0.14, ease: 'back.out(1.7)' }, 0.62)
    .fromTo(fx, { p: 0 }, { p: 1, duration: 0.72, onUpdate: onFx }, 0);

  return () => {
    ScrollTrigger.removeEventListener('refreshInit', resize);
    portal.firstElementChild?.classList.remove('is-still');
  };
}

// Markup is the finished, readable hero; the dive is layered on only when motion is allowed.
export function Hero({ onDarkChange }) {
  const root = useRef(null);
  const reduced = useReducedMotion();

  // on the stage: the dive, then the stars rush past as the next scene opens out of the core
  useScene({
    id: 'hero',
    build: ({ tl, q, el, exit }) => {
      const off = buildDive(el, tl, { big: true });
      tl.addLabel('settle', 0);
      const x = tl.duration();
      tl.to(q('.dive__stars'), { scale: 1.6, duration: exit }, x).to(q('.dive__caption'), { autoAlpha: 0, scale: 1.3, duration: exit * 0.6 }, x);
      return off;
    },
    // once the core has swallowed the screen the header sits on space
    toneAt: (t) => (t > 0.45 ? { tone: 'dark', bg: 'var(--space)' } : null),
  });

  // on phones the hero is its own short pinned scene
  useGSAP(
    () => {
      let dark = false;
      gsap.matchMedia().add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=70%',
            pin: true,
            scrub: 0.4,
            invalidateOnRefresh: true,
            onUpdate(self) {
              const d = self.progress > 0.62;
              if (d !== dark) onDarkChange?.((dark = d));
            },
          },
        });
        const off = buildDive(root.current, tl, { big: false });
        tl.to({}, { duration: 0.08 });
        return () => {
          off();
          if (dark) onDarkChange?.((dark = false));
        };
      });
    },
    { scope: root },
  );

  return (
    <section id="hero" className="hero scene" data-scene ref={root} aria-labelledby="hero-name">
      <Drift seed={3} corner="br" count={6} />
      <div className="hero__stage">
        <div className="hero__copy">
          <h1 id="hero-name" className="hero__name">
            <span data-text={person.firstName}>{person.firstName}</span>
            <span data-text="Lolewar">Lolewar</span>
          </h1>
          <p className="hero__role">
            Computer Science student specialising in Cognitive Systems. I build AI/ML and web projects in {person.city}.
          </p>
          <div className="hero__proof">
            <div className="hero__sticky">
              <span className="hero__tape" aria-hidden="true" />
              <p>
                Two of my apps are live in this dimension right now:{' '}
                {liveApps.map((p, i) => (
                  <span key={p.slug}>
                    {i > 0 && (i === liveApps.length - 1 ? ' and ' : ', ')}
                    <a href={p.live} target="_blank" rel="noreferrer">
                      {p.name}
                    </a>
                  </span>
                ))}
                .
              </p>
            </div>
            <Arrow className="hero__sticky-arrow" />
          </div>
        </div>

        <div className="hero__portal">
          <Portal />
        </div>

        <p className="hero__cue">
          {reduced ? 'Scroll down' : 'Scroll to step through'}
          <Arrow className="hero__cue-arrow" />
        </p>
      </div>

      <svg className="dive" aria-hidden="true" focusable="false">
        <defs>
          {/* clipPath only accepts shapes, so the hole carries its own position and scale */}
          <clipPath id="dive-clip" clipPathUnits="userSpaceOnUse">
            <path className="dive__hole" d={holePath} transform="scale(0)" />
          </clipPath>
        </defs>
        <g clipPath="url(#dive-clip)">
          <rect width="100%" height="100%" fill="var(--space)" />
          <g className="dive__stars">
            {stars.map((s, i) =>
              s.big ? (
                <svg key={i} x={`${s.x}%`} y={`${s.y}%`} overflow="visible">
                  <path d={sparklePath(0, 0, s.r * 4)} fill="var(--labcoat)" />
                </svg>
              ) : (
                <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="var(--labcoat)" />
              ),
            )}
          </g>
        </g>
      </svg>
      <p className="dive__caption" aria-hidden="true">Step inside.</p>
    </section>
  );
}
