import { person } from '../data/facts.js';
import { SpeakerIcon } from '../art/SpeakerIcon.jsx';

const links = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export function Header({ tone, sound, onToggleSound, onJump }) {
  const go = (id) => (e) => {
    e.preventDefault();
    onJump(id);
  };

  return (
    <header className="hdr" data-tone={tone}>
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
        <button type="button" className="hdr__sound" aria-pressed={sound} onClick={onToggleSound}>
          <SpeakerIcon on={sound} />
          <span className="hdr__sound-label">{sound ? 'Sound on' : 'Sound off'}</span>
        </button>
      </div>
    </header>
  );
}
