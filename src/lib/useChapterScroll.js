import { useEffect, useRef, useState } from 'react';

// Tracks which chapter is in view, which one sits under the header, and where each chapter
// lands as a fraction of the page. Per-frame progress goes to onFrame (no re-render).
export function useChapterScroll(ids, onFrame, headerOffset = 64) {
  const [current, setCurrent] = useState(0);
  const [underHeader, setUnderHeader] = useState(0);
  const [stops, setStops] = useState(() => ids.map((_, i) => i / ids.length));
  const frame = useRef(onFrame);
  frame.current = onFrame;

  useEffect(() => {
    let tops = [];
    let max = 1;
    let raf = 0;
    let lastY = window.scrollY;
    let cur = -1;
    let top = -1;

    const measure = () => {
      max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      tops = ids.map((id) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY : 0;
      });
      setStops(ids.map((id) => Math.min(1, landingTop(id) / max)));
      update();
    };

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
      frame.current?.(Math.min(1, y / max), y - lastY);
      lastY = y;
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    measure();
    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      cancelAnimationFrame(raf);
    };
  }, [ids, headerOffset]);

  return { current, underHeader, stops };
}

// Where a chapter "lands": the scroll position at which it's readable. A scene marks that
// spot with a [data-landing] element (e.g. the end of its intro); otherwise it's the chapter top.
function landingTop(id) {
  const el = document.getElementById(id);
  if (!el) return 0;
  const land = el.querySelector('[data-landing]') ?? el;
  return land.getBoundingClientRect().top + window.scrollY;
}

export function jumpTo(id, reduced) {
  window.scrollTo({ top: landingTop(id), behavior: reduced ? 'auto' : 'smooth' });
}
