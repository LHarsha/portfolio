import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Charminar } from '../art/Charminar.jsx';
import { Guitar, Dumbbell } from '../art/Doodles.jsx';
import { GooEdge } from '../art/GooEdge.jsx';
import { useScene } from '../lib/story.js';
import { person } from '../data/facts.js';
import './hyderabad.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const title = ['Based', 'in', `${person.city}.`];

// Where he's from and what he does off the keyboard. The one trick: the city builds itself on a
// ground line (the Charminar grows up out of it) and the guitar and dumbbell swing down onto it.
// The drawings sit in wrappers so GSAP's transforms never fight their line boil.
function city(tl, q, at) {
  return tl
    .fromTo(q('.hyd__ground'), { scaleX: 0 }, { scaleX: 1, transformOrigin: '0% 50%', duration: 0.2, ease: 'power2.out' }, at)
    .fromTo(q('.hyd__word'), { yPercent: 110, rotate: 6 }, { yPercent: 0, rotate: 0, duration: 0.2, ease: 'back.out(1.6)', stagger: 0.08 }, at + 0.05)
    .fromTo(q('.hyd__charminar'), { scaleY: 0.05, opacity: 0 }, { scaleY: 1, opacity: 1, transformOrigin: '50% 100%', duration: 0.3, ease: 'back.out(1.4)' }, at + 0.15)
    .fromTo(q('.hyd__hobby'), { rotate: (i) => (i ? 50 : -50), y: -80, opacity: 0 }, { rotate: 0, y: 0, opacity: 1, duration: 0.3, ease: 'back.out(1.8)', stagger: 0.08 }, at + 0.3);
}

export function Hyderabad() {
  const root = useRef(null);

  useScene({
    id: 'hyderabad',
    inLen: 0.45,
    build: ({ tl, q, el, exit }) => {
      // entry: mustard rises up from the bottom like a sunrise over space
      tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.45, ease: 'power2.inOut' }, 0);
      city(tl, q, 0.35);
      tl.fromTo(q('.hyd__text'), { opacity: 0.15 }, { opacity: 1, duration: 0.3 }, 0.8)
        .addLabel('settle', 1.0)
        .to({}, { duration: 0.2 }, 1.1);
      // exit: the city drifts up as Work pours in over it
      tl.to(q('.hyd__inner'), { y: -50, duration: exit }, tl.duration());
    },
  });

  // phones: no stage; the city builds as the chapter scrolls in
  useGSAP(
    () => {
      gsap.matchMedia().add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        const q = gsap.utils.selector(root);
        city(gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'top 5%', scrub: 0.5 } }), q, 0);
      });
    },
    { scope: root },
  );

  return (
    <section id="hyderabad" className="hyd scene" data-scene ref={root} aria-labelledby="hyd-title">
      <GooEdge color="var(--space)" />
      <div className="hyd__inner" data-exit>
        <div className="hyd__copy">
          <h2 id="hyd-title" className="hyd__title" aria-label={title.join(' ')}>
            {title.map((w) => (
              <span className="hyd__clip" key={w} aria-hidden="true">
                <span className="hyd__word">{w}</span>
              </span>
            ))}
          </h2>
          <p className="hyd__text">
            Off the keyboard it's guitar (I was in the Music Club in my first semester) and the gym. I speak{' '}
            {person.languages.slice(0, -1).join(', ')} and {person.languages.at(-1)}.
          </p>
        </div>

        <div className="hyd__scene">
          <div className="hyd__charminar" data-depth style={{ '--depth': 0.15 }}>
            <Charminar />
          </div>
          <ul className="hyd__hobbies" aria-label="Interests">
            <li className="hyd__hobby hyd__hobby--guitar">
              <Guitar className="hyd__guitar" />
              <span>guitar</span>
            </li>
            <li className="hyd__hobby hyd__hobby--gym">
              <Dumbbell className="hyd__dumbbell" />
              <span>gym</span>
            </li>
          </ul>
          <span className="hyd__ground" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
