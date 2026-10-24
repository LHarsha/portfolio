import { useEffect, useRef, useState } from 'react';
import { scrollToY } from './smoothScroll.js';

// Page position of an element. A pinned section sits inside GSAP's .pin-spacer and is shifted by
// its pin distance once the pin has ended, so measure the spacer instead.
function docTop(el) {
  const anchor = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el;
  return anchor.getBoundingClientRect().top + window.scrollY;
}

// Tracks which chapter is in view, which ones sit under the header and under the dial, and
// where each chapter lands as a fraction of the page. Per-frame progress goes to onFrame.
export function useChapterScroll(ids, onFrame, headerOffset = 64) {
  const [current, setCurrent] = useState(0);
  const [underHeader, setUnderHeader] = useState(0);
  const [underDial, setUnderDial] = useState(0);
  const [stops, setStops] = useState(() => ids.map((_, i) => i / ids.length));
  const frame = useRef(onFrame);
  frame.current = onFrame;

  useEffect(() => {
    let tops = [];
    let max = 1;
    let raf = 0;
    let measureRaf = 0;
    let lastStops = '';
    let lastY = window.scrollY;
    let cur = -1;
    let top = -1;
    let bottom = -1;

    const measure = () => {
      measureRaf = 0;
      max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      tops = ids.map((id) => {
        const el = document.getElementById(id);
        return el ? docTop(el) : 0;
      });
      const next = ids.map((id) => Math.min(1, landingTop(id) / max));
      const key = next.map((s) => s.toFixed(4)).join();
      if (key !== lastStops) {
        lastStops = key;
        setStops(next);
      }
      update();
    };
    // pins being created resize the body many times in a row; measure once per frame at most
    const requestMeasure = () => { if (!measureRaf) measureRaf = requestAnimationFrame(measure); };

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const at = (probe) => {
        let i = 0;
        while (i < tops.length - 1 && tops[i + 1] <= probe) i++;
        return i;
      };
      const i = at(y + window.innerHeight * 0.4);
      if (i !== cur) setCurrent((cur = i));
      const h = at(y + headerOffset);
      if (h !== top) setUnderHeader((top = h));
      const b = at(y + window.innerHeight - 70);
      if (b !== bottom) setUnderDial((bottom = b));
      frame.current?.(Math.min(1, y / max), y - lastY);
      lastY = y;
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const ro = new ResizeObserver(requestMeasure);
    ro.observe(document.body);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', requestMeasure);
    requestMeasure();
    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', requestMeasure);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(measureRaf);
    };
  }, [ids, headerOffset]);

  return { current, underHeader, underDial, stops };
}

// Where a chapter "lands": the scroll position at which it's readable. A scene marks that
// spot with a [data-landing] element (e.g. the end of its intro); otherwise it's the chapter top.
function landingTop(id) {
  const el = document.getElementById(id);
  if (!el) return 0;
  const land = el.querySelector('[data-landing]');
  return land ? land.getBoundingClientRect().top + window.scrollY : docTop(el);
}

export function jumpTo(id, reduced) {
  scrollToY(landingTop(id), !reduced);
}
