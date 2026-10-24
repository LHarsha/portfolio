import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Portal } from '../art/Portal.jsx';
import { GooEdge } from '../art/GooEdge.jsx';
import { CopyEmailButton, ContactLinks } from '../shell/ContactBits.jsx';
import { whoosh } from '../lib/sound.js';
import { person } from '../data/facts.js';
import './footer.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The ending loops the story: a portal opens again as you arrive (the one trick), and the last
// word is the easiest way to get in touch. Not pinned: it's the end of the page.
export function Footer({ onJump }) {
  const root = useRef(null);

  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          root.current.querySelectorAll('.goo-edge__drip'),
          { scaleY: 0.5 },
          { scaleY: 1.2, transformOrigin: '50% 0%', ease: 'none', stagger: { each: 0.03, from: 'random' }, scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 20%', scrub: 0.8 } },
        );
        gsap.fromTo(
          root.current.querySelector('.end__portal'),
          { scale: 0.08, rotate: -120 },
          { scale: 1, rotate: 0, ease: 'power2.out', scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'top 10%', scrub: 0.6 } },
        );
      });
    },
    { scope: root },
  );

  return (
    <footer id="the-end" className="end" ref={root} aria-labelledby="end-title">
      <GooEdge color="var(--portal-light)" />
      <div className="end__portal">
        <Portal />
      </div>

      <h2 id="end-title" className="end__title">Still here? Say hi.</h2>
      <p className="end__line">
        I'm open to internships in AI/ML and software, and to freelance work. My inbox is the fastest portal.
      </p>

      <a className="end__email" href={`mailto:${person.email}`}>
        {person.email}
      </a>

      <div className="end__actions">
        <CopyEmailButton />
        <ContactLinks />
      </div>

      <a
        className="end__again"
        href="#hero"
        onClick={(e) => {
          e.preventDefault();
          whoosh();
          onJump('hero');
        }}
      >
        Back to the start
      </a>

      <div className="end__small">
        <p>© {new Date().getFullYear()} {person.name}</p>
        <p>Every drawing on this site was made by hand for it. No AI images, no stock art.</p>
      </div>
    </footer>
  );
}
