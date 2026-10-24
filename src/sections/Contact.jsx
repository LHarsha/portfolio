import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Goo } from '../art/Goo.jsx';
import { GooEdge } from '../art/GooEdge.jsx';
import { Dish } from '../art/Dish.jsx';
import { Arrow } from '../art/Arrow.jsx';
import { BadgeIcon, CodeIcon, SheetIcon } from '../art/Icons.jsx';
import { blip } from '../lib/sound.js';
import { person } from '../data/facts.js';
import './contact.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const links = [
  { label: 'LinkedIn', href: person.linkedin, Icon: BadgeIcon },
  { label: 'GitHub', href: person.github, Icon: CodeIcon },
  { label: 'Resume (PDF)', href: person.resume, Icon: SheetIcon },
];

// Not pinned on purpose: someone reaching for the email shouldn't be held by a scroll scene.
// The chapter's one trick is the goo from the dive above stretching as the chapter arrives.
export function Contact() {
  const root = useRef(null);
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.goo-edge__drip',
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

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      blip(780);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      window.location.href = `mailto:${person.email}`;
    }
  }

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
            <button type="button" className="btn contact__copy-btn" onClick={copyEmail} data-copied={copied || undefined}>
              {copied ? 'Email copied' : 'Copy email'}
              <Goo />
            </button>
            <p className="contact__copy-note">it's long, just copy it</p>
          </div>

          <ul className="contact__links">
            {links.map(({ label, href, Icon }) => (
              <li key={label}>
                <a className="btn btn--plain contact__link" href={href} target="_blank" rel="noreferrer">
                  <Icon className="contact__icon" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="visually-hidden" aria-live="polite">
          {copied ? 'Email address copied to clipboard' : ''}
        </p>
      </div>

      <Dish className="contact__dish" />
    </section>
  );
}
