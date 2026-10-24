import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { rng } from '../lib/rng.js';
import { blobPath } from '../lib/shapes.js';

const marker = blobPath({ r: 11, jag: 0.12, splash: 0.12, points: 14, seed: 21 });
const markerCore = blobPath({ r: 5, jag: 0.15, points: 9, seed: 22 });

// Tick marks hanging from the top edge of the tape, like a real tape measure.
function ticksPath(width) {
  const rand = rng(5);
  let d = '';
  for (let i = 0, x = 6; x < width - 4; i++, x += 9) {
    const h = (i % 5 === 0 ? 11 : 6) + rand() * 1.6;
    const wob = (rand() - 0.5) * 0.8;
    d += `M${x.toFixed(1)} 0L${(x + wob).toFixed(1)} ${h.toFixed(1)}`;
  }
  return d;
}

export const ChapterDial = forwardRef(function ChapterDial({ chapters, current, tapeColor = 'mustard', stops, onJump }, markerRef) {
  const tape = useRef(null);
  const list = useRef(null);
  const [width, setWidth] = useState(0);
  // unlabelled chapters (a group's later scenes) keep showing the group's label; the hero shows none
  let shown = current;
  while (shown >= 0 && !chapters[shown].label) shown--;

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(tape.current);
    return () => ro.disconnect();
  }, []);

  // Labels centre on their landing point, but never overlap each other or leave the tape:
  // push right to clear the previous label, then pull back from the right end.
  useLayoutEffect(() => {
    const items = [...list.current.children];
    if (!width || !items.length) return;
    const gap = 10;
    const pad = 8;
    const ws = items.map((li) => li.offsetWidth);
    const inside = (x, w) => Math.min(Math.max(x, pad + w / 2), width - pad - w / 2);
    const xs = items.map((li, i) => inside(Number(li.dataset.stop) * width, ws[i]));
    for (let i = 1; i < xs.length; i++) xs[i] = Math.max(xs[i], xs[i - 1] + (ws[i - 1] + ws[i]) / 2 + gap);
    const last = xs.length - 1;
    xs[last] = inside(xs[last], ws[last]);
    for (let i = last - 1; i >= 0; i--) xs[i] = Math.min(xs[i], xs[i + 1] - (ws[i + 1] + ws[i]) / 2 - gap);
    items.forEach((li, i) => (li.style.left = `${xs[i]}px`));
  }, [stops, width]);

  return (
    <nav className="dial" data-tape={tapeColor} aria-label="Chapters">
      {shown >= 0 && (
        <p className="dial__now" aria-hidden="true">{chapters[shown].label}</p>
      )}
      <div className="dial__tape" ref={tape}>
        <svg className="dial__ticks" width={width} height="14" aria-hidden="true" focusable="false">
          <path d={ticksPath(width)} />
        </svg>
        <ol className="dial__labels" ref={list}>
          {chapters.map((c, i) => c.label && (
            <li key={c.id} data-stop={stops[i]}>
              <a
                href={`#${c.id}`}
                aria-current={i === shown ? 'location' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  onJump(c.id);
                }}
              >
                {c.label}
              </a>
            </li>
          ))}
        </ol>
        <span className="dial__marker" ref={markerRef} aria-hidden="true">
          <svg className="dial__blob" viewBox="-16 -16 32 32">
            <path d={marker} fill="var(--portal)" stroke="var(--ink)" strokeWidth="2.5" />
            <path d={markerCore} fill="var(--portal-dark)" />
          </svg>
        </span>
      </div>
    </nav>
  );
});
