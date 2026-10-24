// Chapter order, dial labels and colours. tone: which text colour reads on the background.
// tape: the dial's fill while it sits over this chapter (mustard vanishes on mustard).
// Like Nesil's ruler, the hero is the start of the tape and has no label.
export const chapters = [
  { id: 'hero', label: null, bg: 'var(--labcoat)', tone: 'light' },
  { id: 'contact', label: 'Contact', bg: 'var(--mustard)', tone: 'light', tape: 'labcoat' },
  { id: 'about', label: 'Hello', bg: 'var(--sky)', tone: 'light' },
  { id: 'words', label: 'In my words', bg: 'var(--portal)', tone: 'light' },
  { id: 'work', label: 'Work', bg: 'var(--garage)', tone: 'light' },
  { id: 'lab-log', label: 'Lab log', bg: 'var(--sky)', tone: 'light' },
  { id: 'toolkit', label: 'Toolkit', bg: 'var(--portal-light)', tone: 'light' },
  { id: 'the-end', label: 'The end', bg: 'var(--space)', tone: 'dark' },
];
