import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { GooEdge } from '../art/GooEdge.jsx';
import { Dish } from '../art/Dish.jsx';
import { Arrow } from '../art/Arrow.jsx';
import { CopyEmailButton, ContactLinks } from '../shell/ContactBits.jsx';
import { person } from '../data/facts.js';
import './contact.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Not pinned on purpose: someone reaching for the email shouldn't be held by a scroll scene.
// The chapter's one trick is the goo from the dive above stretching as the chapter arrives.
export function Contact() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          root.current.querySelectorAll('.goo-edge__drip'),
          { scaleY: 0.5 },
          {
            scaleY: 1.25,
            transformOrigin: '50% 0%',
            ease: 'none',
            stagger: { each: 0.03, from: 'random' },
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 10%', scrub: 0.8 },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section id="contact" className="contact" ref={root} aria-labelledby="contact-title">
      <GooEdge />
      <div className="contact__inner">
        <h2 id="contact-title" className="contact__lead">
          Fastest way to reach me
          <Arrow className="contact__lead-arrow" variant="down-right" />
        </h2>

        <a className="contact__email" href={`mailto:${person.email}`}>
          {person.email}
        </a>

        <div className="contact__actions">
          <div className="contact__copy">
            <CopyEmailButton />
            <p className="contact__copy-note">it's long, just copy it</p>
          </div>

          <ContactLinks />
        </div>
      </div>

      <Dish className="contact__dish" />
    </section>
  );
}
