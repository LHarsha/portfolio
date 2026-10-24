import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { GooEdge } from '../art/GooEdge.jsx';
import { Drift } from '../art/Drift.jsx';
import { CopyEmailButton, ContactLinks } from '../shell/ContactBits.jsx';
import { useScene } from '../lib/story.js';
import { scrollToY } from '../lib/smoothScroll.js';
import { whoosh } from '../lib/sound.js';
import { person } from '../data/facts.js';
import './footer.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Rewinds the whole story to the top like a tape: it plays backwards as it goes, with a TV-style
// "rewind" in the corner (RewindOsd, in the app shell). Keyboard focus goes back to the top when it's done.
function rewind(reduced) {
  const html = document.documentElement;
  const done = () => {
    html.classList.remove('is-rewinding');
    document.querySelector('.hdr__name')?.focus({ preventScroll: true });
  };
  if (reduced) {
    scrollToY(0, false, { onComplete: done });
    return;
  }
  whoosh();
  html.classList.add('is-rewinding');
  scrollToY(0, true, { duration: 2.6, onComplete: done });
}

// The sign-off, and the only place the contact details live. On the stage it arrives out of the
// Toolkit switching off like an old CRT: a bright dot lingers on the dark, then opens into this.
export function Footer({ reduced }) {
  const root = useRef(null);

  useScene({
    id: 'contact',
    inLen: 0.55,
    // sits under the Toolkit, so the switch-off reveals it
    z: 1,
    build: ({ tl, q }) => {
      tl.fromTo(q('.end__dot'), { scale: 0, autoAlpha: 1 }, { scale: 1, duration: 0.08, ease: 'back.out(3)' }, 0.42)
        .to(q('.end__dot'), { scale: 40, autoAlpha: 0, duration: 0.2, ease: 'power2.in' }, 0.56)
        .fromTo(q('.end__item'), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.14, stagger: 0.05, ease: 'back.out(1.4)' }, 0.62)
        .addLabel('settle', tl.duration())
        .to({}, { duration: 0.15 }, tl.duration());
    },
  });

  // phones: no stage; the sign-off rises in as it scrolls up
  useGSAP(
    () => {
      gsap.matchMedia().add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          root.current.querySelectorAll('.end__item'),
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, ease: 'none', stagger: 0.05, scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'top 15%', scrub: 0.5 } },
        );
      });
    },
    { scope: root },
  );

  return (
    <section id="contact" className="end scene" data-scene ref={root} aria-labelledby="end-title">
      <GooEdge from="toolkit" />
      <Drift seed={21} corner="tl" tone="light" />
      <span className="end__dot" aria-hidden="true" />

      <p className="end__note end__item">End of transmission.</p>
      <h2 id="end-title" className="end__title end__item">Still here? Say hi.</h2>
      <p className="end__line end__item">
        I'm open to internships and freelance work. My inbox is the fastest portal.
      </p>

      <a className="end__email end__item" href={`mailto:${person.email}`}>
        {person.email}
      </a>

      <div className="end__actions end__item">
        <CopyEmailButton />
        <ContactLinks />
      </div>

      <button type="button" className="end__rewind end__item" onClick={() => rewind(reduced)}>
        <svg className="end__rewind-icon" viewBox="0 0 34 18" aria-hidden="true" focusable="false">
          <path d="M16 2L3 9L16 16Z M31 2L18 9L31 16Z" />
        </svg>
        Rewind to the start
      </button>

      <div className="end__small end__item">
        <p>© {new Date().getFullYear()} {person.name}</p>
        <p>Every drawing on this site was made by hand for it. No AI images, no stock art.</p>
      </div>
    </section>
  );
}

// The corner readout while rewinding; lives outside the scenes so it stays up the whole way back.
export function RewindOsd() {
  return (
    <p className="rewind-osd" aria-hidden="true">
      <svg viewBox="0 0 34 18" focusable="false">
        <path d="M16 2L3 9L16 16Z M31 2L18 9L31 16Z" />
      </svg>
      Rewind
    </p>
  );
}
