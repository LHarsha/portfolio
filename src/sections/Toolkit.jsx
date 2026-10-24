import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
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

  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
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
    <section id="toolkit" className="toolkit" ref={root} aria-labelledby="toolkit-title">
      <h2 id="toolkit-title" className="toolkit__title">Toolkit</h2>
      <div className="board">
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
    </section>
  );
}
