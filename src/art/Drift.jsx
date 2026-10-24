import { blobPath, sparklePath, spiralArm } from '../lib/shapes.js';
import { rng } from '../lib/rng.js';
import './drift.css';

// Background clutter: faint, hand-drawn sci-fi bits (original drawings, nothing from the show)
// floating behind a scene, and a faint distant portal. They always idle (each piece bobs and
// tilts on its own rhythm, the portal keeps turning), and on the stage they also tumble toward the
// portal as the story scrolls on (story.js). Each piece is its own small element, so both kinds of
// motion are plain transforms the compositor moves without repainting anything.
// Each icon is drawn in a 60×60 box.
const icons = {
  saucer: 'M8 34C8 28 52 28 52 34C52 40 8 40 8 34Z M20 30C20 19 40 19 40 30 M15 42L11 50 M30 42V52 M45 42L49 50 M19 34H21 M29 34H31 M39 34H41',
  planet: 'M30 17A13 13 0 1 1 29.9 17Z M5 37C9 28 52 22 55 29C58 36 15 46 7 42C3 41 3 39 5 37Z',
  eyeball: 'M30 10A20 20 0 1 1 29.9 10Z M30 21A9 9 0 1 1 29.9 21Z M30 27A3 3 0 1 1 29.9 27Z M12 22C15 25 18 22 21 25 M41 45C44 42 46 45 49 42 M14 41C17 39 19 42 22 40',
  tentacles: 'M20 44H40L37 56H23Z M26 44C24 34 14 30 16 20C17 15 22 16 21 21 M34 44C36 32 46 30 44 18C43 13 38 14 39 19 M30 44C30 34 31 26 28 14C27 9 32 8 32 13',
  flask: 'M24 6H36 M26 6V22L12 50C10 54 13 56 16 56H44C47 56 50 54 48 50L34 22V6 M17 42C24 39 36 45 43 42 M25 49A2 2 0 1 1 24.9 49Z M33 46A3 3 0 1 1 32.9 46Z M38 34A1.5 1.5 0 1 1 37.9 34Z',
  comet: 'M42 13A8 8 0 1 1 41.9 13Z M36 26L10 52 M41 30L20 54 M32 22L7 44',
  crystal: 'M30 6L43 22L30 54L17 22Z M17 22H43 M24 22L30 54 M36 22L30 54 M30 6L24 22 M30 6L36 22',
  rocket: 'M30 6C41 14 43 30 38 42H22C17 30 19 14 30 6Z M30 18A4.5 4.5 0 1 1 29.9 18Z M22 42L14 51L22 48 M38 42L46 51L38 48 M26 46L30 56L34 46',
  atom: 'M30 27A3 3 0 1 1 29.9 27Z M8 30C8 24 52 24 52 30C52 36 8 36 8 30Z M19 11C24 7 46 45 41 49C36 53 14 15 19 11Z M41 11C46 15 24 53 19 49C14 45 36 7 41 11Z',
  jar: 'M18 14H42V50C42 54 40 56 36 56H24C20 56 18 54 18 50Z M16 14H44 M22 35C20 29 26 25 30 28C34 25 40 29 38 35C40 41 32 45 30 41C26 45 20 41 22 35Z M30 28V41',
  tv: 'M10 22H50V50H10Z M15 27H40V45H15Z M45 30V31 M45 38V39 M24 22L18 9 M36 22L42 9 M14 50L12 55 M46 50L48 55',
  sparkle: sparklePath(30, 30, 18),
};
const names = Object.keys(icons);

// spots around the edges of a 1440×900 scene, where the clutter can sit without crowding the copy
const slots = [
  [80, 150], [70, 470], [110, 730], [330, 110], [720, 90], [1110, 120], [1370, 170],
  [1380, 470], [1340, 730], [990, 790], [540, 800], [240, 590], [1180, 330], [880, 250],
];
// where the faint distant portal sits
const corners = { tr: [1250, 210], br: [1240, 690], tl: [200, 220], bl: [210, 690] };

// the distant portal, drawn around its own centre
const far = {
  rim: blobPath({ r: 120, jag: 0.06, splash: 0.12, points: 26, seed: 11 }),
  arms: [0, 1, 2].map((i) => spiralArm({ r0: 14, r1: 104, turns: 0.85, offset: (i / 3) * Math.PI * 2 })),
  core: blobPath({ r: 22, jag: 0.12, points: 11, seed: 3 }),
};
const pct = (v, of) => `${((v / of) * 100).toFixed(2)}%`;

export function Drift({ seed = 1, tone = 'ink', corner = 'tr', count = 7 }) {
  const rand = rng(seed);
  const [px, py] = corners[corner];
  // a seeded pick of spots (away from the portal) and icons
  const spots = slots
    .map((s) => [s, rand()])
    .filter(([s]) => Math.hypot(s[0] - px, s[1] - py) > 220)
    .sort((a, b) => a[1] - b[1])
    .slice(0, count)
    .map(([s]) => s);
  const order = names.map((n) => [n, rand()]).sort((a, b) => a[1] - b[1]).map(([n]) => n);

  return (
    <div className={`drift drift--${tone}`} aria-hidden="true">
      <div className="drift__portal" style={{ left: pct(px, 1440), top: pct(py, 900) }}>
        <svg className="drift__spin" viewBox="-130 -130 260 260" focusable="false">
          <path d={far.rim} />
          {far.arms.map((d, i) => (
            <path key={i} d={d} />
          ))}
          <path d={far.core} />
        </svg>
      </div>
      {spots.map(([x, y], i) => {
        const s = 1.1 + rand() * 0.8;
        const r = Math.round((rand() - 0.5) * 50);
        // idle: each piece bobs and tilts on its own slow rhythm
        const idle = { '--d': `${(4.5 + rand() * 4).toFixed(1)}s`, '--delay': `${(-rand() * 8).toFixed(1)}s` };
        // scroll (stage only): how far it drifts toward the portal over the scene, as a share of
        // the screen, and how much it tumbles on the way
        const dx = (((px - x) * 0.3) / 1440).toFixed(3);
        const dy = (((py - y) * 0.3) / 900).toFixed(3);
        const rot = Math.round(60 + rand() * 120) * (i % 2 ? 1 : -1);
        return (
          <div key={i} className="drift__item" data-dx={dx} data-dy={dy} data-rot={rot} style={{ left: pct(x, 1440), top: pct(y, 900), '--s': s.toFixed(2) }}>
            <div className="drift__bob" data-bob={i % 4} style={idle}>
              <svg viewBox="0 0 60 60" focusable="false">
                <path d={icons[order[i % order.length]]} transform={`rotate(${r} 30 30)`} />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
