import { createContext, createElement, useContext, useLayoutEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { scrollToY } from './smoothScroll.js';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The stage: like Nesil's site, the screen stays put and scroll drives one long timeline in which
// every scene turns into the next. Each scene supplies its piece (an entry, its trick, an exit that
// plays under the next scene's entry); this file strings them together, pins the stage for the
// whole length, and decides which scenes are showing. 1 unit of timeline = 1 screen of scroll.
// Phones and reduced motion never get here: they see the same scenes as a normal stacked page.
export const STAGE = '(min-width: 768px) and (prefers-reduced-motion: no-preference)';

const StoryContext = createContext(null);

// Called by each scene: { id, inLen (how long its entry overlaps the scene before), z, build, toneAt }.
// build({ tl, q, el, exit }) adds the scene's tweens to tl and must leave `exit` units at the end
// for its exit (it may return a cleanup); toneAt(localTime) can override the header's tone/colour.
export function useScene(config) {
  const story = useContext(StoryContext);
  const ref = useRef(config);
  ref.current = config;
  useLayoutEffect(() => story?.add(config.id, ref), [story, config.id]);
}

// Pads a scene's timeline so it ends `exit` units after its content, and returns where the exit starts.
export function exitAt(tl, exit) {
  const at = tl.duration();
  if (exit) tl.to({}, { duration: exit }, at);
  return at;
}

// Points one scene measures for another, e.g. the full stop Hello zooms through, which In my words opens out of.
export const points = { zoom: { x: 0, y: 0 } };

// Set while the stage runs; read by the dial, the header and jumps.
let stage = null;
export const getStage = () => stage;
// dev only: lets the review scripts jump to exact moments in the story
if (import.meta.env.DEV) window.__stage = getStage;

// Scroll position of a moment in the story (scene id + a label in its timeline, or its settle point).
export function stageY(id, label = 'settle') {
  if (!stage) return null;
  const s = stage.spans.find((x) => x.id === id);
  if (!s) return null;
  const local = s.labels[label] ?? s.labels.settle ?? 0;
  return stage.yAt(s.start + local);
}

export function jumpToStage(id, label, smooth = true) {
  const y = stageY(id, label);
  if (y != null) scrollToY(y, smooth);
  return y != null;
}

export function Story({ order, onState, children }) {
  const root = useRef(null);
  const registry = useRef(new Map());
  const stateCb = useRef(onState);
  stateCb.current = onState;
  const api = useMemo(
    () => ({
      add(id, ref) {
        registry.current.set(id, ref);
        return () => registry.current.delete(id);
      },
    }),
    [],
  );

  useGSAP(
    () => {
      gsap.matchMedia().add(STAGE, () => {
        const el = root.current;
        el.classList.add('is-stage');
        const scenes = order
          .map((id) => ({ id, cfg: registry.current.get(id)?.current, el: document.getElementById(id) }))
          .filter((s) => s.cfg && s.el);

        const master = gsap.timeline({ defaults: { ease: 'none' } });
        const spans = [];
        const cleanups = [];
        let end = 0;
        scenes.forEach((s, i) => {
          const inLen = i === 0 ? 0 : (s.cfg.inLen ?? 0.4);
          const exit = scenes[i + 1] ? (scenes[i + 1].cfg.inLen ?? 0.4) : 0;
          const tl = gsap.timeline({ defaults: { ease: 'none' } });
          s.el.style.zIndex = s.cfg.z ?? i + 1;
          const off = s.cfg.build({ tl, q: gsap.utils.selector(s.el), el: s.el, exit });
          if (typeof off === 'function') cleanups.push(off);
          // the background clutter (Drift) tumbles toward its far portal for the scene's whole run
          const items = s.el.querySelectorAll('.drift__item');
          if (items.length) {
            const d = tl.duration();
            // drift distances are shares of the screen, so they're read again on every refresh
            tl.fromTo(items, { x: 0, y: 0, rotation: 0 }, { x: (i, t) => t.dataset.dx * window.innerWidth, y: (i, t) => t.dataset.dy * window.innerHeight, rotation: (i, t) => +t.dataset.rot, duration: d }, 0)
              .fromTo(s.el.querySelectorAll('.drift__portal'), { rotation: 0 }, { rotation: -150, duration: d }, 0);
          }
          const start = Math.max(0, end - inLen);
          master.add(tl, start);
          spans.push({ id: s.id, el: s.el, start, end: start + tl.duration(), inLen, labels: { ...tl.labels }, toneAt: s.cfg.toneAt, on: null });
          end = start + tl.duration();
        });
        const total = master.duration();

        // a scene shows from the start of its entry until the next one has fully covered it
        let current = -1;
        let tone = '';
        const apply = () => {
          const t = master.time();
          let cur = 0;
          spans.forEach((s, i) => {
            const on = i === 0 ? t <= s.end : t >= s.start - 1e-4 && (i === spans.length - 1 || t <= s.end);
            if (on !== s.on) {
              s.on = on;
              s.el.classList.toggle('is-on', on);
            }
            if (i > 0 && t >= s.start + s.inLen / 2) cur = i;
          });
          const s = spans[cur];
          const look = s.toneAt?.(t - s.start) ?? {};
          const key = `${cur}|${look.tone ?? ''}|${look.bg ?? ''}`;
          if (cur !== current || key !== tone) {
            current = cur;
            tone = key;
            stateCb.current?.({ current: cur, tone: look.tone, bg: look.bg });
          }
        };
        master.eventCallback('onUpdate', apply);

        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top top',
          end: () => `+=${Math.round(total * window.innerHeight)}`,
          pin: true,
          scrub: 0.6,
          animation: master,
          invalidateOnRefresh: true,
        });
        stage = { spans, total, st, yAt: (time) => st.start + (time / total) * (st.end - st.start) };
        apply();

        // keyboard focus landing in a scene that isn't showing jumps the story to it
        const onFocus = (e) => {
          const scene = e.target.closest?.('[data-scene]');
          const span = scene && spans.find((x) => x.el === scene);
          if (span && !span.on) jumpToStage(span.id, 'settle', false);
        };
        el.addEventListener('focusin', onFocus);

        return () => {
          cleanups.forEach((off) => off());
          el.removeEventListener('focusin', onFocus);
          el.classList.remove('is-stage');
          spans.forEach((s) => {
            s.el.classList.remove('is-on');
            s.el.style.zIndex = '';
          });
          stage = null;
          stateCb.current?.({ current: 0 });
        };
      });
    },
    { scope: root },
  );

  return createElement(StoryContext.Provider, { value: api }, createElement('div', { ref: root, className: 'story' }, children));
}
