// Chapter order, dial labels and colours. tone: which text colour reads on the background.
// tape: the dial's fill while it sits over this chapter (mustard vanishes on mustard).
// Like Nesil's ruler, the hero is the start of the tape and has no label; contact comes once, at the end.
export const chapters = [
  { id: 'hero', label: null, bg: 'var(--labcoat)', tone: 'light' },
  { id: 'about', label: 'Hello', bg: 'var(--sky)', tone: 'light' },
  // the three statements are one chapter: they swap in place on the stage, or stack on phones
  { id: 'words', label: 'In my words', bg: 'var(--portal)', tone: 'light' },
  { id: 'hyderabad', label: 'Hyderabad', bg: 'var(--mustard)', tone: 'light', tape: 'labcoat' },
  { id: 'work', label: 'Work', bg: 'var(--garage)', tone: 'light' },
  { id: 'lab-log', label: 'Lab log', bg: 'var(--sky)', tone: 'light' },
  { id: 'toolkit', label: 'Toolkit', bg: 'var(--portal-light)', tone: 'light' },
  { id: 'contact', label: 'Contact', bg: 'var(--space)', tone: 'dark' },
];
