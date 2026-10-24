import { useCallback, useEffect, useRef, useState } from 'react';
import { BoilDefs } from './art/BoilDefs.jsx';
import { Frame } from './shell/Frame.jsx';
import { Header } from './shell/Header.jsx';
import { ChapterDial } from './shell/ChapterDial.jsx';
import { Placeholder } from './sections/Placeholder.jsx';
import { chapters } from './data/chapters.js';
import { pauseBoilOffscreen, useReducedMotion } from './lib/motion.js';
import { useChapterScroll, jumpTo } from './lib/useChapterScroll.js';
import { blip, setSound, soundEnabled } from './lib/sound.js';
import StyleTile from './dev/StyleTile.jsx';
import './shell/shell.css';

const ids = chapters.map((c) => c.id);
// Page flow numbers from CLAUDE.md, used only by the placeholders.
const steps = { hero: 2, contact: 3, about: 4, words: 5, work: 6, 'lab-log': 7, toolkit: 8, 'the-end': 9 };

function Site() {
  const reduced = useReducedMotion();
  const [sound, setSoundState] = useState(soundEnabled);
  const marker = useRef(null);
  const settle = useRef(0);

  // Marker rides the tape; it squashes while scrolling fast and springs back when you stop.
  const onFrame = useCallback(
    (p, dy) => {
      const el = marker.current;
      if (!el) return;
      el.style.setProperty('--x', `${p * el.parentElement.clientWidth}px`);
      if (reduced) return;
      const s = Math.min(Math.abs(dy) / 60, 0.45);
      el.style.setProperty('--squash', s.toFixed(3));
      clearTimeout(settle.current);
      settle.current = setTimeout(() => el.style.setProperty('--squash', '0'), 110);
    },
    [reduced],
  );

  const { current, underHeader, stops } = useChapterScroll(ids, onFrame);

  const onJump = useCallback(
    (id) => {
      blip(700, 70);
      jumpTo(id, reduced);
    },
    [reduced],
  );

  useEffect(() => pauseBoilOffscreen(), []);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Frame />
      <Header
        tone={chapters[underHeader].tone}
        sound={sound}
        onToggleSound={() => {
          // read the live setting, not the render's copy, so fast double-clicks stay in sync
          const next = !soundEnabled();
          setSound(next);
          setSoundState(next);
        }}
        onJump={onJump}
      />
      <main id="main">
        {chapters.map((c) => (
          <Placeholder key={c.id} chapter={c} step={steps[c.id]} />
        ))}
      </main>
      <ChapterDial ref={marker} chapters={chapters} current={current} stops={stops} onJump={onJump} />
    </>
  );
}

export default function App() {
  const tile = typeof window !== 'undefined' && window.location.pathname === '/style-tile';
  return (
    <>
      <BoilDefs />
      {tile ? <StyleTile /> : <Site />}
    </>
  );
}
