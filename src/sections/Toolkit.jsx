import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { GooEdge } from '../art/GooEdge.jsx';
import { Flood, pour } from '../art/Flood.jsx';
import { useScene } from '../lib/story.js';
import { toolkit } from '../data/facts.js';
import { rng } from '../lib/rng.js';
import './toolkit.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const groups = Object.entries(toolkit);
const tones = ['mustard', 'labcoat', 'sky', 'portal', 'labcoat'];
// each tag hangs at its own slight angle, seeded so it's the same every load
const lean = (() => {
  const r = rng(63);
  return groups.flatMap(([, items]) => items).map(() => Math.round((r() - 0.5) * 10));
})();

// The one trick: when the board scrolls in, the tags swing on their strings and settle.
// Not pinned: it's a short list someone should be able to scan and move on from.
export function Toolkit() {
  const root = useRef(null);

  // on the stage: the board pours in, the tags swing on their strings as you scroll and settle,
  // and the exit is the whole screen switching off like an old CRT (the sign-off waits underneath)
  useScene({
    id: 'toolkit',
    inLen: 0.4,
    build: ({ tl, q, el, exit }) => {
      pour(tl, el, 0, 0.4);
      tl.fromTo(q('.toolkit__title, .board'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2, stagger: 0.08 }, 0.3)
        .fromTo(q('.tag'), { rotate: (i) => (i % 2 ? 28 : -28) }, { rotate: (i) => lean[i], duration: 0.3, ease: 'elastic.out(1, 0.3)', stagger: 0.025 }, 0.45)
        .addLabel('settle', 0.95)
        .to({}, { duration: 0.2 }, tl.duration());
      // exit: squash to a bright line, then to a dot, then gone
      const x = tl.duration();
      tl.fromTo(q('.crt-flash'), { opacity: 0 }, { opacity: 1, duration: exit * 0.35 }, x)
        .to(el, { scaleY: 0.006, duration: exit * 0.5, ease: 'power3.in', transformOrigin: '50% 50%' }, x)
        .to(el, { scaleX: 0.004, duration: exit * 0.3, ease: 'power2.in' }, x + exit * 0.5)
        .to(q('.crt-flash'), { opacity: 0, duration: exit * 0.2 }, x + exit * 0.8);
    },
  });

  // phones: no stage; the tags swing once when the board scrolls in
  useGSAP(
    () => {
      gsap.matchMedia().add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        const tags = gsap.utils.toArray('.tag', root.current);
        gsap.fromTo(
          tags,
          { rotate: (i) => (i % 2 ? 24 : -24) },
          {
            rotate: (i) => lean[i],
            duration: 1.6,
            ease: 'elastic.out(1, 0.28)',
            stagger: { each: 0.035, from: 'start' },
            scrollTrigger: { trigger: root.current.querySelector('.board'), start: 'top 70%', toggleActions: 'play none none none' },
          },
        );
      });
    },
    { scope: root },
  );

  let t = 0;
  return (
    <section id="toolkit" className="toolkit scene" data-scene ref={root} aria-labelledby="toolkit-title">
      <Flood color="var(--portal-light)" />
      <GooEdge from="lab-log" />
      <h2 id="toolkit-title" className="toolkit__title" data-depth style={{ '--depth': -0.15 }}>Toolkit</h2>
      <div className="board" data-exit>
        {groups.map(([group, items], gi) => (
          <section key={group} className="board__group" aria-labelledby={`tk-${gi}`}>
            <h3 id={`tk-${gi}`} className="board__tape">{group}</h3>
            <ul className="board__tags">
              {items.map((item) => {
                const i = t++;
                return (
                  <li key={item} className={`tag tag--${tones[gi % tones.length]}`} style={{ '--lean': `${lean[i]}deg` }}>
                    <span className="tag__peg" aria-hidden="true" />
                    <span className="tag__body">
                      <span className="tag__hole" aria-hidden="true" />
                      {item}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
      <span className="crt-flash" aria-hidden="true" />
    </section>
  );
}
