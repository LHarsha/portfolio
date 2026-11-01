// Screenshots of the live projects, taken from the deployed apps on 2026-10-24 (Solar System and
// Raft Failure Lab on 2026-11-02).
// tv: cropped to the TV screen's shape · wide: desktop (1440×900) · tall: phone (390×844).
import syncTv from '../assets/shots/sync-or-solo-tv.webp';
import syncWide from '../assets/shots/sync-or-solo-wide.webp';
import syncTall from '../assets/shots/sync-or-solo-tall.webp';
import bugTv from '../assets/shots/bugloop-tv.webp';
import bugWide from '../assets/shots/bugloop-wide.webp';
import bugTall from '../assets/shots/bugloop-tall.webp';
import solarTv from '../assets/shots/solar-system-tv.webp';
import solarWide from '../assets/shots/solar-system-wide.webp';
import solarTall from '../assets/shots/solar-system-tall.webp';
import raftTv from '../assets/shots/raft-failure-lab-tv.webp';
import raftWide from '../assets/shots/raft-failure-lab-wide.webp';
import raftTall from '../assets/shots/raft-failure-lab-tall.webp';

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
  'solar-system': {
    tv: { src: solarTv, ...TV, alt: 'Solar System: the planets on their orbits around the Sun, each where it really is today' },
    wide: { src: solarWide, ...WIDE, alt: "Solar System on a laptop: the camera has flown to Saturn and its fact sheet is open beside the rings", caption: 'Flying to Saturn opens its fact sheet' },
    tall: { src: solarTall, ...TALL, alt: 'Solar System on a phone: the inner planets around the Sun with the date and time controls below', caption: 'The Solar System, on a phone' },
  },
  'raft-failure-lab': {
    tv: { src: raftTv, ...TV, alt: 'Raft Failure Lab replaying a leader crash: node n2 has won the election and the timeline shows each node’s term' },
    wide: { src: raftWide, ...WIDE, alt: 'Raft Failure Lab on a laptop: the leader-crash scenario marked Safe, the five-node cluster, the event log and the timeline', caption: 'Replaying a leader crash: all three guarantees held' },
    tall: { src: raftTall, ...TALL, alt: 'Raft Failure Lab on a phone: the cluster with n2 as the new leader and the event log below', caption: 'The replay, on a phone' },
  },
};
