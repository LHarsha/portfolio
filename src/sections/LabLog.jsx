import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { labLog } from '../data/facts.js';
import { rng } from '../lib/rng.js';
import './lablog.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Each checkbox is drawn a little differently so the log looks hand-ruled.
function boxPath(seed) {
  const r = rng(seed);
  const j = () => (r() - 0.5) * 3;
  return `M${3 + j()} ${4 + j()}L${27 + j()} ${3 + j()}L${28 + j()} ${27 + j()}L${4 + j()} ${28 + j()}Z`;
}

function Check({ seed }) {
  return (
    <svg className="log__check" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path className="log__box" d={boxPath(seed)} />
      <path className="log__tick" pathLength="1" d="M7 16C10 18 12 21 14 24C17 16 22 9 30 2" />
    </svg>
  );
}

// Flat cartoon rosette for the one prize: ribbon tails, scalloped badge, "1st".
function Rosette() {
  return (
    <svg className="log__rosette" viewBox="0 0 80 100" aria-hidden="true" focusable="false">
      <path d="M28 52L16 96L30 86L38 98L44 56Z M52 52L64 96L50 86L42 98L36 56Z" fill="var(--alien)" stroke="var(--ink)" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M40 6L47 12L56 10L59 19L68 22L66 31L72 38L66 45L68 54L59 57L56 66L47 64L40 70L33 64L24 66L21 57L12 54L14 45L8 38L14 31L12 22L21 19L24 10L33 12Z" fill="var(--mustard)" stroke="var(--ink)" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M40 18C51 18 58 27 58 38S51 58 40 58 22 49 22 38 29 18 40 18Z" fill="var(--labcoat)" stroke="var(--ink)" strokeWidth="3" />
      <text x="40" y="45" textAnchor="middle" fontFamily="'Bagel Fat One', sans-serif" fontSize="17" fill="var(--ink)">1st</text>
    </svg>
  );
}

// The one trick: ticks draw into the checkboxes in order as you scroll, and the prize gets its
// rosette stamped last. Text is readable throughout; reduced motion shows everything ticked.
export function LabLog() {
  const root = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      // desktop: the whole sheet fits, so pin it briefly and tick through in order
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({ scrollTrigger: { trigger: q('.log__sheet')[0], start: 'top top', end: '+=90%', pin: true, scrub: 0.5 } })
          .fromTo(q('.log__tick'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.1, stagger: 0.09, ease: 'power1.out' })
          .fromTo(q('.log__rosette'), { scale: 0, rotate: -40 }, { scale: 1, rotate: -8, duration: 0.15, ease: 'back.out(2.5)', transformOrigin: '50% 40%' })
          .to({}, { duration: 0.2 });
      });
      // phone: the list is taller than the screen, so no pin; each tick draws as its entry arrives
      mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        q('.log__entry').forEach((entry) => {
          const st = { trigger: entry, start: 'top 82%', end: 'top 60%', scrub: 0.5 };
          gsap.fromTo(entry.querySelector('.log__tick'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: st });
          const rosette = entry.querySelector('.log__rosette');
          if (rosette) gsap.fromTo(rosette, { scale: 0, rotate: -40 }, { scale: 1, rotate: -8, ease: 'back.out(2.5)', transformOrigin: '50% 40%', scrollTrigger: st });
        });
      });
    },
    { scope: root },
  );

  let seed = 40;
  return (
    <section id="lab-log" className="log" ref={root} aria-labelledby="log-title">
      <div className="log__sheet">
        <h2 id="log-title" className="log__title">Lab log</h2>
        <div className="log__years">
          {labLog.map((group) => (
            <section key={group.year} className="log__year" aria-labelledby={`log-${group.year}`}>
              <h3 id={`log-${group.year}`} className="log__year-title">{group.year}</h3>
              <ul className="log__list">
                {group.entries.map((e) => (
                  <li key={e.what} className={`log__entry${e.prize ? ' log__entry--prize' : ''}`}>
                    <Check seed={seed++} />
                    <div className="log__text">
                      {/* the year heading already says "2026"; only show dates that add something */}
                      {e.when !== group.year && <p className="log__when">{e.when}</p>}
                      <p className="log__what">{e.what}</p>
                      <p className="log__where">
                        {e.where}
                        {e.note && <span className="log__note">. {e.note}</span>}
                      </p>
                    </div>
                    {e.prize && <Rosette />}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
