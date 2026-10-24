import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BoilDefs } from './art/BoilDefs.jsx';
import { Frame } from './shell/Frame.jsx';
import { Header } from './shell/Header.jsx';
import { ChapterDial } from './shell/ChapterDial.jsx';
import { Placeholder } from './sections/Placeholder.jsx';
import { Hero } from './sections/Hero.jsx';
import { Contact } from './sections/Contact.jsx';
import { About } from './sections/About.jsx';
import { Words } from './sections/Words.jsx';
import { Work } from './sections/Work.jsx';
import { CaseStudy } from './sections/CaseStudy.jsx';
import { LabLog } from './sections/LabLog.jsx';
import { chapters } from './data/chapters.js';
import { pauseBoilOffscreen, useReducedMotion } from './lib/motion.js';
import { useChapterScroll, jumpTo } from './lib/useChapterScroll.js';
import { blip, setSound, soundEnabled } from './lib/sound.js';
import StyleTile from './dev/StyleTile.jsx';
import './shell/shell.css';

const ids = chapters.map((c) => c.id);
// Page flow numbers from CLAUDE.md, used only by the placeholders.
const steps = { toolkit: 8, 'the-end': 9 };

function Site() {
  const reduced = useReducedMotion();
  const [sound, setSoundState] = useState(soundEnabled);
  // true once the hero's dive has filled the screen with space, so the header flips to light text
  const [diveDark, setDiveDark] = useState(false);
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

  const { current, underHeader, underDial, stops } = useChapterScroll(ids, onFrame);

  const onJump = useCallback(
    (id) => {
      blip(700, 70);
      jumpTo(id, reduced);
    },
    [reduced],
  );

  useEffect(() => pauseBoilOffscreen(), []);
  // Pins are measured with fallback fonts first; re-measure once the real ones are in. Then honour
  // a #chapter in the URL (e.g. "Back to the TV" from a case study), which the browser tried to
  // jump to before the pins existed.
  useEffect(() => {
    document.fonts?.ready.then(() => {
      ScrollTrigger.refresh();
      const id = window.location.hash.slice(1);
      if (id && document.getElementById(id)) requestAnimationFrame(() => jumpTo(id, true));
    });
  }, []);

  const inDive = underHeader === 0 && diveDark;
  const tone = inDive ? 'dark' : chapters[underHeader].tone;
  const headerBg = inDive ? 'var(--space)' : chapters[underHeader].bg;

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Frame tone={tone} />
      <Header
        tone={tone}
        bg={headerBg}
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
        <Hero onDarkChange={setDiveDark} />
        <Contact />
        <About />
        <Words />
        <Work />
        <LabLog />
        {chapters.slice(8).map((c) => (
          <Placeholder key={c.id} chapter={c} step={steps[c.id]} />
        ))}
      </main>
      <ChapterDial ref={marker} chapters={chapters} current={current} tapeColor={chapters[underDial].tape} stops={stops} onJump={onJump} />
    </>
  );
}

export default function App() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  const caseSlug = path.match(/^\/work\/([^/]+)\/?$/)?.[1];
  return (
    <>
      <BoilDefs />
      {path === '/style-tile' ? <StyleTile /> : caseSlug ? <CaseStudy slug={caseSlug} /> : <Site />}
    </>
  );
}
