import { useEffect, useState } from 'react';
import { person } from '../data/facts.js';
import { RadioPanel } from './RadioPanel.jsx';

const links = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

// Slides away while you scroll down so it never sits on top of a scene; comes back on any
// upward scroll (or keyboard focus) wearing a band of the chapter's colour.
function useHideOnScroll() {
  const [state, setState] = useState({ hidden: false, band: false });
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const dy = y - last;
      if (Math.abs(dy) < 4) return;
      last = y;
      const atTop = y < 80;
      setState((s) => {
        const next = { hidden: !atTop && dy > 0, band: !atTop };
        return next.hidden === s.hidden && next.band === s.band ? s : next;
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  const show = () => setState((s) => (s.hidden ? { ...s, hidden: false } : s));
  return [state, show];
}

export function Header({ tone, bg, onJump }) {
  const [{ hidden, band }, show] = useHideOnScroll();
  const go = (id) => (e) => {
    e.preventDefault();
    onJump(id);
  };

  return (
    <header
      className="hdr"
      data-tone={tone}
      data-hidden={hidden || undefined}
      data-band={band || undefined}
      style={{ '--hdr-bg': bg }}
      onFocus={show}
    >
      <div className="hdr__id">
        <a className="hdr__name" href="#hero" onClick={go('hero')}>
          {person.name}
        </a>
        <p className="hdr__sticker">{person.availability}</p>
      </div>
      <div className="hdr__right">
        <nav aria-label="Main">
          <ul className="hdr__nav">
            {links.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} onClick={go(l.id)}>
                  {l.label}
                  <svg className="hdr__squiggle" viewBox="0 0 60 8" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                    <path d="M2 5C10 1 16 7 24 4S38 1 45 4 55 6 58 3" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <RadioPanel />
      </div>
    </header>
  );
}
