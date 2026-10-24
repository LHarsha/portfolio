import { Goo } from '../art/Goo.jsx';
import { LiveLight, PocketPortal } from '../art/ButtonBits.jsx';

// "Open live site": a slime button with an on-air light, and a pocket portal that spins up on hover.
export function LiveButton({ href }) {
  return (
    <a className="btn btn--slime btn--live" href={href} target="_blank" rel="noreferrer">
      <LiveLight />
      <span>Open live site</span>
      <span className="visually-hidden"> (opens in a new tab)</span>
      <PocketPortal />
      <Goo />
    </a>
  );
}
