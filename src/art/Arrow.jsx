// Hand-drawn annotation arrow. Points right by default; rotate/flip with CSS.
export function Arrow({ className = '' }) {
  return (
    <svg className={`arrow boil ${className}`} viewBox="0 0 120 60" aria-hidden="true" focusable="false">
      <path d="M6 44C26 14 62 8 104 22" fill="none" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M86 9L106 22L88 37" fill="none" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
