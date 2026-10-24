// Screenshots of the live projects, taken from the deployed apps on 2026-10-24.
// tv: cropped to the TV screen's shape · wide: desktop (1440×900) · tall: phone (390×844).
import syncTv from '../assets/shots/sync-or-solo-tv.webp';
import syncWide from '../assets/shots/sync-or-solo-wide.webp';
import syncTall from '../assets/shots/sync-or-solo-tall.webp';
import bugTv from '../assets/shots/bugloop-tv.webp';
import bugWide from '../assets/shots/bugloop-wide.webp';
import bugTall from '../assets/shots/bugloop-tall.webp';
import antiTv from '../assets/shots/anti-gravity-tv.webp';
import antiWide from '../assets/shots/anti-gravity-wide.webp';
import antiTall from '../assets/shots/anti-gravity-tall.webp';

const TV = { width: 800, height: 657 };
const WIDE = { width: 1440, height: 900 };
const TALL = { width: 600, height: 1298 };

export const shots = {
  'sync-or-solo': {
    tv: { src: syncTv, ...TV, alt: 'Sync or Solo home screen: "Think alike, or stand alone." with buttons to host or join a game' },
    wide: { src: syncWide, ...WIDE, alt: 'Sync or Solo on a laptop: the home screen with a Create a room button and a box for a 4-letter room code', caption: 'The home screen' },
    tall: { src: syncTall, ...TALL, alt: 'Sync or Solo on a phone: a freshly made room showing its 4-letter code and a name field', caption: 'A new room, on a phone' },
  },
  bugloop: {
    tv: { src: bugTv, ...TV, alt: 'BugLoop showing a diagnosis: the error and code on the left, observed facts and ranked hypotheses on the right' },
    wide: { src: bugWide, ...WIDE, alt: 'BugLoop on a laptop: a React error broken down into observed facts and hypotheses ranked by confidence', caption: 'A diagnosis, step by step' },
    tall: { src: bugTall, ...TALL, alt: 'BugLoop on a phone: the welcome card explaining how to start a diagnosis', caption: 'Getting started, on a phone' },
  },
  'anti-gravity': {
    tv: { src: antiTv, ...TV, alt: 'Anti Gravity: a 3D solar system with planets on their orbits around a glowing sun' },
    wide: { src: antiWide, ...WIDE, alt: 'Anti Gravity on a laptop: a planet is selected and a side panel shows the project it stands for', caption: 'Picking a planet opens its project' },
    tall: { src: antiTall, ...TALL, alt: 'Anti Gravity on a phone: the solar system seen from above', caption: 'The solar system, on a phone' },
  },
};
