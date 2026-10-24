import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Portal, holeShape } from '../art/Portal.jsx';
import { Arrow } from '../art/Arrow.jsx';
import { blobPath, sparklePath } from '../lib/shapes.js';
import { rng } from '../lib/rng.js';
import { whoosh } from '../lib/sound.js';
import { person, projects } from '../data/facts.js';
import { useReducedMotion } from '../lib/motion.js';
import './hero.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const holePath = blobPath(holeShape);
const liveApps = projects.filter((p) => p.live);
const stars = (() => {
  const rand = rng(91);
  return Array.from({ length: 64 }, () => ({ x: rand() * 100, y: rand() * 100, r: 1 + rand() * 2, big: rand() < 0.12 }));
})();

// The one trick: scroll and the portal's starry core swallows the screen.
// Markup is the finished, readable hero; the dive is layered on only when motion is allowed.
export function Hero({ onDarkChange }) {
  const root = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const portal = q('.hero__portal')[0];
      // Layout offsets ignore transforms, so these stay right however far the dive has run.
      const toCentre = (axis) => () =>
        axis === 'x'
          ? root.current.clientWidth / 2 - (portal.offsetLeft + portal.offsetWidth / 2)
          : root.current.clientHeight / 2 - (portal.offsetTop + portal.offsetHeight / 2);

      let dark = false;
      let whooshed = false;
      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
          phone: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
        },
        (ctx) => {
          const { desktop } = ctx.conditions;
          const cover = () => (Math.hypot(window.innerWidth, window.innerHeight) / holeShape.r) * 1.25;
          // Written by hand: clipPath children are finicky about transform origins, this is exact.
          const holeEl = q('.dive__hole')[0];
          const hole = { s: 0 };
          const drawHole = () => {
            const { clientWidth: w, clientHeight: h } = root.current;
            holeEl.setAttribute('transform', `translate(${w / 2} ${h / 2}) scale(${hole.s})`);
          };

          gsap.set(q('.dive'), { autoAlpha: 1 });
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: desktop ? '+=130%' : '+=100%',
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
              onUpdate(self) {
                const d = self.progress > 0.62;
                if (d !== dark) onDarkChange?.((dark = d));
                if (self.progress > 0.3 && self.direction > 0 && !whooshed) {
                  whooshed = true;
                  whoosh();
                }
                if (self.progress < 0.1) whooshed = false;
              },
            },
          });

          // 1. the copy steps aside while the portal slides to the middle of the screen
          // 2. the portal grows and spins up; its starry core opens into the hole that swallows the view
          // 3. the caption lands while the stars settle, with a short hold so it can be read
          tl.to(q('.hero__name, .hero__role, .hero__sticky, .hero__sticky-arrow'), { yPercent: -40, autoAlpha: 0, duration: 0.18, stagger: 0.02 }, 0)
            .to(q('.hero__cue'), { autoAlpha: 0, duration: 0.08 }, 0)
            .to(portal, { x: toCentre('x'), y: toCentre('y'), scale: 1.25, duration: 0.3, ease: 'power1.inOut' }, 0)
            .to(portal, { scale: desktop ? 3.6 : 3, duration: 0.42, ease: 'power2.in' }, 0.3)
            .to(q('.portal__spin'), { rotation: -300, svgOrigin: '0 0', duration: 0.72 }, 0)
            .fromTo(hole, { s: 0 }, { s: cover, duration: 0.36, ease: 'power3.in', onUpdate: drawHole }, 0.32)
            .fromTo(q('.dive__stars'), { scale: 1.25 }, { scale: 1, transformOrigin: '50% 50%', duration: 0.3 }, 0.6)
            .fromTo(q('.dive__caption'), { autoAlpha: 0, y: 30, rotate: -6 }, { autoAlpha: 1, y: 0, rotate: -2, duration: 0.14, ease: 'back.out(1.7)' }, 0.66)
            .to({}, { duration: 0.2 });

          return () => {
            if (dark) onDarkChange?.((dark = false));
          };
        },
      );

    },
    { scope: root },
  );

  return (
    <section id="hero" className="hero" ref={root} aria-labelledby="hero-name">
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
      <p className="dive__caption" aria-hidden="true">First stop: how to reach me.</p>
    </section>
  );
}
