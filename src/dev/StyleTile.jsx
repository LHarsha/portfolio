import { useState } from 'react';
import '@fontsource/lilita-one/latin-400.css';
import '@fontsource/chango/latin-400.css';
import '@fontsource/rubik-wet-paint/latin-400.css';
import { Portal } from '../art/Portal.jsx';
import { Goo } from '../art/Goo.jsx';
import { Arrow } from '../art/Arrow.jsx';
import { SpaceStrip } from '../art/SpaceStrip.jsx';
import { blobPath } from '../lib/shapes.js';
import { person } from '../data/facts.js';
import { blip } from '../lib/sound.js';
import './style-tile.css';

// Section 0. Throwaway: delete once the look is approved and the real page exists.

const faces = [
  { id: 'A', family: 'Bagel Fat One', note: 'soft, bubbly, the friendliest' },
  { id: 'B', family: 'Lilita One', note: 'tall and punchy, reads like a title card' },
  { id: 'C', family: 'Chango', note: 'heavy and wide, the loudest' },
];

const swatches = [
  ['portal', '#97ce4c'],
  ['portal-dark', '#5a9a2a'],
  ['portal-light', '#d8f5a2'],
  ['labcoat', '#eef3f1'],
  ['sky', '#44b8c8'],
  ['mustard', '#f0d64a'],
  ['garage', '#a8875a'],
  ['alien', '#c86ab4'],
  ['space', '#1d2440'],
];

export default function StyleTile() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      blip(780);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${person.email}`;
    }
  }

  return (
    <main className="tile">
      <p className="tile__note hand">Section 0, the style tile. Pick a display face, then we build the real page.</p>

      <section className="tile__hero" aria-labelledby="faces">
        <div className="faces">
          <h2 id="faces" className="visually-hidden">Display face options</h2>
          {faces.map((f) => (
            <div className="face" key={f.id}>
              <p className="face__label hand">
                {f.id}. {f.family}: {f.note}
              </p>
              <p className="face__name" style={{ fontFamily: `'${f.family}'` }}>
                {person.name}
              </p>
            </div>
          ))}
        </div>

        <figure className="portal-demo">
          <Portal className="portal-demo__art" />
          <figcaption className="portal-demo__cap hand">
            <Arrow className="portal-demo__arrow" />
            flat bands, inked rim, no glow
          </figcaption>
        </figure>
      </section>

      <section className="swatches" aria-label="Palette">
        {swatches.map(([name, hex], i) => (
          <div className="swatch" key={name}>
            <svg viewBox="-60 -60 120 120" aria-hidden="true" className="swatch__blob boil">
              <path d={blobPath({ r: 46, jag: 0.14, points: 14, seed: 100 + i })} fill={hex} stroke="var(--ink)" strokeWidth="3.5" />
            </svg>
            <p className="swatch__name hand">{name}</p>
            <p className="swatch__hex">{hex}</p>
          </div>
        ))}
      </section>

      <section className="parts" aria-label="Components">
        <div className="parts__col">
          <p className="sticker">Open to internships</p>
          <p className="body-sample">
            BSc Computer Science student specialising in Cognitive Systems at Loyola Academy, Hyderabad. Two of his
            projects are live on the internet right now: a real-time multiplayer party game and an AI debugging
            workbench.
          </p>
          <div className="parts__buttons">
            <button type="button" className="btn" onClick={copyEmail}>
              {copied ? 'Email copied' : 'Copy email'}
              <Goo />
            </button>
            <a className="btn btn--plain" href={person.resume} target="_blank" rel="noreferrer">
              Open resume
            </a>
          </div>
          <p className="visually-hidden" aria-live="polite">{copied ? 'Email copied to clipboard' : ''}</p>
        </div>

        <div className="parts__col parts__col--notes">
          <div className="sticky">
            <span className="sticky__tape" aria-hidden="true" />
            <p className="hand">Facts only. The jokes go around them.</p>
          </div>
          <p className="drip-word" aria-label="Accent word: goo">goo</p>
          <p className="hand drip-word__note">Rubik Wet Paint: one word per page, max</p>
        </div>
      </section>

      <section className="space-demo" aria-label="Space strip">
        <SpaceStrip className="space-demo__art" />
        <p className="space-demo__text hand">space strips are section breaks, never the whole page</p>
      </section>
    </main>
  );
}
