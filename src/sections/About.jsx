import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Portal } from '../art/Portal.jsx';
import { Charminar } from '../art/Charminar.jsx';
import { Guitar, Dumbbell } from '../art/Doodles.jsx';
import { blip } from '../lib/sound.js';
import { person, education } from '../data/facts.js';
import './about.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const greeting = `Hi, I'm ${person.firstName}.`;
const words = greeting.split(' ');

// The one trick: a small portal opens over the heading and the letters drop out of it,
// squashing as they land. The heading and bio are written in their final state, so they
// read fine without motion; the drop is layered on only when motion is allowed.
export function About() {
  const root = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const scene = q('.about__scene')[0];
      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
          phone: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
        },
        (ctx) => {
          const { desktop } = ctx.conditions;
          const portal = q('.about__portal')[0];
          const letters = q('.about__char');
          // Offset from each letter to the portal's mouth, measured unpinned on every refresh.
          const fromPortal = (axis) => (i, el) => {
            const p = portal.getBoundingClientRect();
            const r = el.getBoundingClientRect();
            return axis === 'x' ? p.left + p.width / 2 - (r.left + r.width / 2) : p.top + p.height / 2 - (r.top + r.height / 2);
          };
          let landed = 0;

          // 1. the drop starts while the chapter is still scrolling in, so it never arrives empty
          const drop = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: scene,
              start: 'top 70%',
              end: () => `+=${window.innerHeight * (desktop ? 1.1 : 0.8)}`,
              scrub: 0.6,
              invalidateOnRefresh: true,
              onUpdate(self) {
                // a little pop per batch of landed letters, if sound is on
                const n = Math.floor(gsap.utils.clamp(0, 1, (self.progress - 0.15) / 0.85) * letters.length);
                if (n > landed && self.direction > 0) blip(420 + n * 30, 50);
                landed = n;
              },
            },
          });
          // fromTo, not from: with invalidateOnRefresh a from() re-reads its end values on refresh,
          // and if the letters are sitting in the portal at that moment, the portal becomes the end
          drop
            .fromTo(
              letters,
              { x: fromPortal('x'), y: fromPortal('y'), scale: 0.15, rotation: () => gsap.utils.random(-40, 40), autoAlpha: 0 },
              {
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0,
                autoAlpha: 1,
                duration: 0.12,
                ease: 'power1.in',
                // short flights, staggered so only a couple of letters are ever in the air
                stagger: 0.06,
              },
            )
            // squash on landing, then spring back
            .fromTo(letters, { scaleY: 0.62, scaleX: 1.25 }, { scaleY: 1, scaleX: 1, duration: 0.1, ease: 'back.out(3)', stagger: 0.06, immediateRender: false }, 0.12);

          // 2. the pin holds the finished greeting, then the portal closes behind the letters
          gsap
            .timeline({
              defaults: { ease: 'none' },
              scrollTrigger: { trigger: scene, start: 'top top', end: desktop ? '+=110%' : '+=70%', pin: true, scrub: 0.6 },
            })
            .to({}, { duration: 0.35 })
            .to(portal, { scale: 0, rotation: 90, duration: 0.2, ease: 'back.in(2)' })
            .to({}, { duration: 0.45 });
        },
      );
    },
    { scope: root },
  );

  return (
    <section id="about" className="about" ref={root} aria-labelledby="about-title">
      <div className="about__scene">
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
          <figure className="about__avatar">
            <div className="about__avatar-slot">
              <p>Cartoon avatar goes here</p>
              <p className="about__avatar-small">drawn from Harsha's photo</p>
            </div>
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
            <p>Right now I'm open to internships in AI/ML and software, and to freelance work.</p>
          </div>
        </div>
      </div>

      {/* where a dial jump to "Hello" should land: once the letters are down */}
      <span className="about__landing" data-landing aria-hidden="true" />

      <div className="about__more">
        <div className="about__city">
          <h3 className="about__city-title">Based in {person.city}.</h3>
          <p className="about__city-text">
            Off the keyboard it's guitar (I was in the Music Club in my first semester) and the gym. I speak{' '}
            {person.languages.slice(0, -1).join(', ')} and {person.languages.at(-1)}.
          </p>
          <Charminar className="about__charminar" />
        </div>
        <ul className="about__hobbies" aria-label="Interests">
          <li className="about__hobby about__hobby--guitar">
            <Guitar className="about__guitar" />
            <span>guitar</span>
          </li>
          <li className="about__hobby about__hobby--gym">
            <Dumbbell className="about__dumbbell" />
            <span>gym</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
