import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BoilDefs } from './art/BoilDefs.jsx';
import { Frame } from './shell/Frame.jsx';
import { Header } from './shell/Header.jsx';
import { ChapterDial } from './shell/ChapterDial.jsx';
import { Hero } from './sections/Hero.jsx';
import { About } from './sections/About.jsx';
import { Words } from './sections/Words.jsx';
import { Hyderabad } from './sections/Hyderabad.jsx';
import { Work } from './sections/Work.jsx';
import { CaseStudy } from './sections/CaseStudy.jsx';
import { LabLog } from './sections/LabLog.jsx';
import { Toolkit } from './sections/Toolkit.jsx';
import { Footer, RewindOsd } from './sections/Footer.jsx';
import { chapters } from './data/chapters.js';
import { pauseBoilOffscreen, useReducedMotion } from './lib/motion.js';
import { useChapterScroll, jumpTo } from './lib/useChapterScroll.js';
import { startSmoothScroll } from './lib/smoothScroll.js';
import { Story, getStage } from './lib/story.js';
import { blip } from './lib/sound.js';
import './shell/shell.css';

const ids = chapters.map((c) => c.id);

function Site() {
  const reduced = useReducedMotion();
  // phones: true once the hero's dive has filled the screen with space, so the header flips to light text
  const [diveDark, setDiveDark] = useState(false);
  // desktop: which scene the stage is showing, and any tone/colour it asks the header for
  const [stageState, setStageState] = useState(null);
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
  useEffect(() => (reduced ? undefined : startSmoothScroll()), [reduced]);
  // Pins are measured with fallback fonts first; re-measure if the real ones land after the page has
  // loaded (ScrollTrigger already re-measures on load). Then honour a #chapter in the URL (e.g. "Back
  // to the TV" from a case study), once nothing is going to re-measure and reset the scroll after it.
  useEffect(() => {
    let alive = true;
    let fontsLate = false;
    const loaded = document.readyState === 'complete' ? Promise.resolve() : new Promise((r) => window.addEventListener('load', r, { once: true }));
    const fonts = (document.fonts?.ready ?? Promise.resolve()).then(() => (fontsLate = document.readyState === 'complete'));
    Promise.all([loaded, fonts]).then(() => {
      if (!alive) return;
      if (fontsLate) ScrollTrigger.refresh();
      const id = window.location.hash.slice(1);
      if (id && document.getElementById(id)) requestAnimationFrame(() => requestAnimationFrame(() => jumpTo(id, true)));
    });
    return () => {
      alive = false;
    };
  }, []);

  // on the stage one scene fills the screen, so header, frame and dial all follow it
  const staged = !!(stageState && getStage());
  const shown = staged ? stageState.current : underHeader;
  const inDive = !staged && underHeader === 0 && diveDark;
  const tone = inDive ? 'dark' : (staged && stageState.tone) || chapters[shown].tone;
  const headerBg = inDive ? 'var(--space)' : (staged && stageState.bg) || chapters[shown].bg;
  const dialAt = staged ? stageState.current : current;
  const tapeAt = staged ? stageState.current : underDial;

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Frame tone={tone} />
      <Header tone={tone} bg={headerBg} onJump={onJump} />
      <main id="main">
        <Story order={ids} onState={setStageState}>
          <Hero onDarkChange={setDiveDark} />
          <About />
          <Words />
          <Hyderabad />
          <Work />
          <LabLog />
          <Toolkit />
          <Footer reduced={reduced} />
        </Story>
      </main>
      <RewindOsd />
      <ChapterDial ref={marker} chapters={chapters} current={dialAt} tapeColor={chapters[tapeAt].tape} stops={stops} onJump={onJump} />
    </>
  );
}

export default function App() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  const caseSlug = path.match(/^\/work\/([^/]+)\/?$/)?.[1];
  return (
    <>
      <BoilDefs />
      {caseSlug ? <CaseStudy slug={caseSlug} /> : <Site />}
    </>
  );
}
