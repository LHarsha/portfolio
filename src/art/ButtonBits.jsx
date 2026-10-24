import { blobPath, spiralArm } from '../lib/shapes.js';

// Small drawings that sit inside the slime buttons.

// A lab gadget's indicator light: on, with a soft ring pulsing out of it, for "this is live".
export function LiveLight() {
  return <span className="live-light" aria-hidden="true" />;
}

// A pocket portal: spins up when the button is hovered, as if you're about to step through.
const rim = blobPath({ r: 46, jag: 0.06, splash: 0.12, points: 18, seed: 4 });
const arms = [0, 1, 2].map((i) => spiralArm({ r0: 6, r1: 38, turns: 0.8, offset: (i / 3) * Math.PI * 2, steps: 18 }));
export function PocketPortal() {
  return (
    <svg className="btn__portal" viewBox="-56 -56 112 112" aria-hidden="true" focusable="false">
      <path d={rim} fill="var(--portal-light)" stroke="var(--ink)" strokeWidth="7" strokeLinejoin="round" />
      <circle r="34" fill="var(--portal-mid)" />
      {arms.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="var(--portal-ink)" strokeWidth="9" strokeLinecap="round" />
      ))}
      <circle r="9" fill="var(--space)" stroke="var(--portal-light)" strokeWidth="4" />
    </svg>
  );
}

// Clipboard, and the tick it turns into once the email is copied.
export function ClipboardIcon({ done }) {
  return (
    <svg className="btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {done ? (
        <path d="M4 13L9.5 18L20 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <>
          <path d="M8 4H6C5 4 4 5 4 6V20C4 21 5 22 6 22H18C19 22 20 21 20 20V6C20 5 19 4 18 4H16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M9 2.5H15V6.5H9Z" fill="var(--labcoat)" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M8 11H16M8 15H16M8 19H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

// A splat of slime that bursts out around the button when the copy lands.
const bits = [
  [-96, -30, 14], [-80, 34, 11], [-30, -50, 10], [36, -52, 12], [100, -18, 15], [88, 36, 11], [-4, 54, 9], [60, -44, 8],
];
export function Splat() {
  return (
    <span className="splat" aria-hidden="true">
      {bits.map(([x, y, s], i) => (
        <span key={i} className="splat__bit" style={{ '--x': `${x}px`, '--y': `${y}px`, width: s, height: s, animationDelay: `${i * 18}ms` }} />
      ))}
    </span>
  );
}
