import { forwardRef, useEffect, useRef, useState } from 'react';
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

// Labels centre on their landing point; near the ends they tuck inside the tape.
const edge = (stop) => (stop < 0.06 ? 'is-start' : stop > 0.94 ? 'is-end' : undefined);

export const ChapterDial = forwardRef(function ChapterDial({ chapters, current, stops, onJump }, markerRef) {
  const tape = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(tape.current);
    return () => ro.disconnect();
  }, []);

  return (
    <nav className="dial" aria-label="Chapters">
      {chapters[current].label && (
        <p className="dial__now" aria-hidden="true">{chapters[current].label}</p>
      )}
      <div className="dial__tape" ref={tape}>
        <svg className="dial__ticks" width={width} height="14" aria-hidden="true" focusable="false">
          <path d={ticksPath(width)} />
        </svg>
        <ol className="dial__labels">
          {chapters.map((c, i) => c.label && (
            <li key={c.id} className={edge(stops[i])} style={{ left: `${stops[i] * 100}%` }}>
              <a
                href={`#${c.id}`}
                aria-current={i === current ? 'location' : undefined}
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
