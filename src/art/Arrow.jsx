// Hand-drawn annotation arrows. "right" curls up and points right; "down-right" swoops down into
// whatever sits below and to the right. Rotate/flip with CSS for anything else.
const shapes = {
  right: {
    viewBox: '0 0 120 60',
    shaft: 'M6 44C26 14 62 8 104 22',
    head: 'M86 9L106 22L88 37',
  },
  'down-right': {
    viewBox: '0 0 100 80',
    shaft: 'M8 8C44 2 76 18 84 66',
    head: 'M70 54L85 69L96 50',
  },
};

export function Arrow({ className = '', variant = 'right' }) {
  const s = shapes[variant];
  return (
    <svg className={`arrow boil ${className}`} viewBox={s.viewBox} aria-hidden="true" focusable="false">
      <path d={s.shaft} fill="none" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" />
      <path d={s.head} fill="none" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
