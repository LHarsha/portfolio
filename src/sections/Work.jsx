import { useCallback, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Tv, Bench, SCREEN } from '../art/Tv.jsx';
import { Goo } from '../art/Goo.jsx';
import { GooEdge } from '../art/GooEdge.jsx';
import { Flood, pour } from '../art/Flood.jsx';
import { jumpToStage, useScene } from '../lib/story.js';
import { blip } from '../lib/sound.js';
import { prefersReducedMotion, useReducedMotion } from '../lib/motion.js';
import { scrollToY } from '../lib/smoothScroll.js';
import { projects } from '../data/facts.js';
import { shots } from '../data/shots.js';
import './work.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const pct = (v, of) => `${(v / of) * 100}%`;
const screenBox = { left: pct(SCREEN.x, SCREEN.vw), top: pct(SCREEN.y, SCREEN.vh), width: pct(SCREEN.w, SCREEN.vw), height: pct(SCREEN.h, SCREEN.vh) };
const n = projects.length;

// A quarter-second of hand-made static on a tiny canvas, scaled up chunky.
function staticBurst(canvas, ms = 260) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(canvas.width, canvas.height);
  canvas.classList.add('is-on');
  const end = performance.now() + ms;
  const id = setInterval(() => {
    for (let i = 0; i < img.data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    if (performance.now() > end) {
      clearInterval(id);
      canvas.classList.remove('is-on');
    }
  }, 83);
}

function Screen({ project }) {
  if (!project.live && !project.stack.length) {
    // GroundRAG: nothing to show but the fact, so the channel is a hand-drawn test card
    return (
      <div className="screen__card">
        <span className="screen__bars" aria-hidden="true" />
        <p className="screen__card-text">Unpublished</p>
      </div>
    );
  }
  const shot = shots[project.slug].tv;
  // lazy, but every channel's image is in the DOM, so all of them load as the TV scrolls near
  return <img className="screen__shot" src={shot.src} width={shot.width} height={shot.height} alt={shot.alt} loading="lazy" decoding="async" />;
}

// The one trick: scrolling turns the channel. Each project is a channel; changing it flips the
// screen with a burst of static and turns the knob. The channel buttons do the same for anyone
// not scrolling (keyboard, screen readers, reduced motion).
export function Work() {
  const root = useRef(null);
  const canvas = useRef(null);
  const trigger = useRef(null);
  const current = useRef(0);
  const reduced = useReducedMotion();
  const [channel, setChannel] = useState(0);

  const tune = useCallback((i) => {
    if (i === current.current) return;
    current.current = i;
    setChannel(i);
    if (!prefersReducedMotion()) staticBurst(canvas.current);
    blip(300 + i * 90, 60);
  }, []);

  // on the stage: the garage pours in, the TV rises onto its bench, then scroll turns the channel
  const CH = 0.55;
  useScene({
    id: 'work',
    inLen: 0.4,
    build: ({ tl, q, el, exit }) => {
      const dial = { c: 0 };
      pour(tl, el, 0, 0.4);
      tl.fromTo(q('.work__set'), { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.25, ease: 'back.out(1.4)' }, 0.3)
        .fromTo(q('.work__title, .work__side'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2, stagger: 0.06 }, 0.35)
        .addLabel('settle', 0.62)
        .fromTo(dial, { c: 0 }, { c: n - 0.001, duration: CH * n, onUpdate: () => tune(Math.floor(dial.c)) }, 0.62);
      // a label in the middle of each channel's stretch, for the channel buttons
      projects.forEach((_, i) => tl.addLabel(`ch${i}`, 0.62 + CH * (i + 0.5)));
      tl.to({}, { duration: 0.1 }, tl.duration());
      // exit: the set drops out as Lab log wipes in
      tl.to(q('.work__scene'), { y: 50, opacity: 0.4, duration: exit }, tl.duration());
    },
  });

  // phones: no stage; the TV is its own short pinned scene
  useGSAP(
    () => {
      const scene = root.current.querySelector('.work__scene');
      gsap.matchMedia().add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        trigger.current = ScrollTrigger.create({
          trigger: scene,
          start: 'top top',
          end: '+=110%',
          pin: true,
          onUpdate: (self) => tune(Math.min(n - 1, Math.floor(self.progress * n))),
        });
        return () => {
          trigger.current = null;
        };
      });
    },
    { scope: root },
  );

  // With a scroll scene running, a button scrolls to that channel's stretch; otherwise it just tunes.
  const choose = (i) => {
    if (jumpToStage('work', `ch${i}`, !reduced)) return;
    const st = trigger.current;
    if (st) scrollToY(st.start + (st.end - st.start) * ((i + 0.5) / n), !reduced);
    else tune(i);
  };

  const p = projects[channel];

  return (
    <section id="work" className="work scene" data-scene ref={root} aria-labelledby="work-title">
      <Flood color="var(--garage)" />
      <GooEdge from="hyderabad" />
      <div className="work__scene">
        <h2 id="work-title" className="work__title">Things I've built</h2>

        <div className="work__set">
          <div className="work__tv">
            <Tv channel={channel} channels={n} />
            <div className="screen" style={screenBox}>
              {projects.map((proj, i) => (
                <div key={proj.slug} className="screen__channel" data-on={i === channel || undefined}>
                  <Screen project={proj} />
                </div>
              ))}
              <p className="screen__osd" aria-hidden="true">CH {channel + 1}</p>
              <canvas ref={canvas} className="screen__static" width="160" height="120" aria-hidden="true" />
            </div>
          </div>
          <Bench className="work__bench" />
        </div>

        <div className="work__side">
          <div className="work__tuner" role="group" aria-label="Change channel">
            {projects.map((proj, i) => (
              <button key={proj.slug} type="button" className="work__ch" aria-pressed={i === channel} onClick={() => choose(i)}>
                <span className="work__ch-num" aria-hidden="true">{i + 1}</span>
                <span className="work__ch-name">{proj.name}</span>
              </button>
            ))}
          </div>

        <div className="work__info" aria-live="polite">
          <p className="work__kind">{p.kind}</p>
          <h3 className="work__name">{p.name}</h3>
          <p className="work__summary">{p.summary}</p>
          {p.details.length > 0 && (
            <ul className="work__details">
              {p.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          )}
          {p.stack.length > 0 && <p className="work__stack">Built with {p.stack.join(', ')}.</p>}
          {(p.live || p.stack.length > 0) && (
            <div className="work__actions">
              {p.live && (
                <a className="btn" href={p.live} target="_blank" rel="noreferrer">
                  Open live site
                  <Goo />
                </a>
              )}
              <a className="btn btn--plain" href={`/work/${p.slug}`}>
                Read the case study
              </a>
            </div>
          )}
        </div>
        </div>
      </div>
    </section>
  );
}
