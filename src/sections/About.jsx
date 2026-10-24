import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Portal } from '../art/Portal.jsx';
import { Avatar } from '../art/Avatar.jsx';
import { GooEdge } from '../art/GooEdge.jsx';
import { Drift } from '../art/Drift.jsx';
import { blip } from '../lib/sound.js';
import { points, useScene } from '../lib/story.js';
import { person, education } from '../data/facts.js';
import './about.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const greeting = `Hi, I'm ${person.firstName}.`;
const words = greeting.split(' ');

// Centre of an element in its scene's coordinates, from layout offsets (they ignore transforms).
function centreIn(el, scene) {
  let x = el.offsetWidth / 2;
  let y = el.offsetHeight / 2;
  for (let n = el; n && n !== scene; n = n.offsetParent) {
    x += n.offsetLeft;
    y += n.offsetTop;
  }
  return [x, y];
}

// The letters' drop out of the small portal: where each starts, measured in one batch per refresh
// (measuring per letter inside the tween forced a fresh layout for every letter).
function letterDrop(root) {
  const q = gsap.utils.selector(root);
  const scene = q('.about__scene')[0];
  const portal = q('.about__portal')[0];
  const letters = q('.about__char');
  const tilt = letters.map(() => gsap.utils.random(-40, 40));
  let offsets = [];
  const measure = () => {
    const [px, py] = centreIn(portal, scene);
    offsets = letters.map((el) => {
      const [lx, ly] = centreIn(el, scene);
      return [px - lx, py - ly];
    });
  };
  measure();
  ScrollTrigger.addEventListener('refreshInit', measure);
  const from = (axis) => (i) => offsets[i]?.[axis === 'x' ? 0 : 1] ?? 0;
  // fromTo with the start pose set up front: GSAP's immediateRender only set the first letter of
  // the stagger, so later letters showed in place before their turn
  const start = { x: from('x'), y: from('y'), scale: 0.15, rotation: (i) => tilt[i], autoAlpha: 0 };
  gsap.set(letters, start);
  // a little pop per landed letter, if sound is on
  let landed = 0;
  const onLand = (p) => {
    const n = Math.floor(gsap.utils.clamp(0, 1, p) * letters.length);
    if (n > landed) blip(420 + n * 30, 50);
    landed = n;
  };
  return { letters, portal, start, onLand, off: () => ScrollTrigger.removeEventListener('refreshInit', measure) };
}

// Hello: a small portal opens over the heading and the letters drop out of it, squashing as they
// land. The heading and bio are written in their final state, so they read fine without motion.
export function About() {
  const root = useRef(null);

  useScene({
    id: 'about',
    inLen: 0.4,
    build: ({ tl, q, el, exit }) => {
      const { letters, portal, start, onLand, off } = letterDrop(el);
      const title = q('.about__title')[0];
      const stop = letters[letters.length - 1];
      // the full stop the exit zooms through, in the title's box and on the screen (for In my words)
      const zoom = { ox: 0, oy: 0 };
      const measureStop = () => {
        [zoom.ox, zoom.oy] = centreIn(stop, title);
        const [x, y] = centreIn(stop, el);
        points.zoom = { x, y };
      };
      measureStop();
      ScrollTrigger.addEventListener('refreshInit', measureStop);
      const fx = { p: 0 };

      // 1. the sky opens out of the portal's starry core
      tl.fromTo(el, { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', duration: 0.4, ease: 'power2.in' }, 0)
        // 2. the small portal opens, and the letters drop out of it one by one
        .fromTo(portal, { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.15, ease: 'back.out(2)' }, 0.25)
        .fromTo(letters, start, { x: 0, y: 0, scale: 1, rotation: 0, autoAlpha: 1, duration: 0.1, ease: 'power1.in', stagger: 0.04 }, 0.35)
        .fromTo(letters, { scaleY: 0.62, scaleX: 1.25 }, { scaleY: 1, scaleX: 1, duration: 0.08, ease: 'back.out(3)', stagger: 0.04, immediateRender: false }, 0.45)
        .fromTo(fx, { p: 0 }, { p: 1, duration: 0.6, onUpdate: () => onLand(fx.p) }, 0.4)
        // 3. the avatar pops in and the bio reads in, line by line
        .fromTo(q('.about__avatar'), { scale: 0.6, rotate: -12, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.15, ease: 'back.out(2)' }, 0.78)
        .fromTo(q('.about__bio p'), { opacity: 0.15, y: 14 }, { opacity: 1, y: 0, duration: 0.12, stagger: 0.1 }, 0.84)
        .addLabel('settle', 1.18)
        // 4. the portal closes behind the letters
        .to(portal, { scale: 0, rotation: 90, duration: 0.15, ease: 'back.in(2)' }, 1.15)
        .to({}, { duration: 0.1 }, 1.3);
      // exit: the camera zooms through the full stop; In my words opens out of it
      const x = tl.duration();
      tl.to(q('.about__intro'), { opacity: 0, y: 40, duration: exit * 0.5 }, x)
        .to(title, { scale: 14, transformOrigin: () => `${zoom.ox}px ${zoom.oy}px`, duration: exit, ease: 'power2.in' }, x);

      return () => {
        off();
        ScrollTrigger.removeEventListener('refreshInit', measureStop);
      };
    },
  });

  // phones: no stage; the letters drop as the chapter scrolls in, then the portal closes
  useGSAP(
    () => {
      const scene = root.current.querySelector('.about__scene');
      gsap.matchMedia().add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        const { letters, portal, start, onLand, off } = letterDrop(root.current);
        const fx = { p: 0 };
        gsap
          .timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: scene, start: 'top 95%', end: 'top top', scrub: 0.6, invalidateOnRefresh: true } })
          .fromTo(letters, start, { x: 0, y: 0, scale: 1, rotation: 0, autoAlpha: 1, duration: 0.12, ease: 'power1.in', stagger: 0.06 })
          .fromTo(letters, { scaleY: 0.62, scaleX: 1.25 }, { scaleY: 1, scaleX: 1, duration: 0.1, ease: 'back.out(3)', stagger: 0.06, immediateRender: false }, 0.12)
          .fromTo(fx, { p: 0 }, { p: 1, duration: 0.9, onUpdate: () => onLand(fx.p) }, 0.1);
        gsap.to(portal, { scale: 0, rotation: 90, ease: 'back.in(2)', scrollTrigger: { trigger: scene, start: 'top -5%', end: 'top -35%', scrub: 0.6 } });
        return off;
      });
    },
    { scope: root },
  );

  return (
    <section id="about" className="about scene" data-scene ref={root} aria-labelledby="about-title">
      <GooEdge from="hero" />
      <Drift seed={5} corner="tr" />
      <div className="about__scene" data-exit>
        <div className="about__portal" aria-hidden="true">
          <Portal spin />
        </div>

        <h2 id="about-title" className="about__title" aria-label={greeting}>
          {words.map((w, wi) => (
            <span className="about__word" key={wi} aria-hidden="true">
              {[...w].map((c, ci) => (
                <span className="about__char" key={ci} data-text={c}>
                  {c}
                </span>
              ))}
            </span>
          ))}
        </h2>

        <div className="about__intro">
          <figure className="about__avatar" data-depth style={{ '--depth': -0.2 }}>
            <Avatar />
          </figure>
          <div className="about__bio">
            <p>
              I'm a {education.degree} student at {education.school}, specialising in {education.specialization}{' '}
              (CGPA {education.cgpa}).
            </p>
            <p>
              I like turning ideas into things people can open and use: a party game you play on your phone, an AI that
              helps debug code, a solar system you steer with your hands.
            </p>
            <p>Right now I'm open to internships and freelance work.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
