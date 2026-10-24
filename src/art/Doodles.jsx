// Interest doodles: flat fills, ink outline, one shadow tone each.
export function Guitar({ className = '' }) {
  return (
    <svg className={`doodle jitter ${className}`} viewBox="0 0 120 200" aria-hidden="true" focusable="false">
      {/* neck and head */}
      <path d="M54 16L66 14L68 100L56 101Z" fill="var(--garage-dark)" stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round" />
      <path d="M50 6C56 2 66 2 72 6L70 22L52 23Z" fill="var(--garage-dark)" stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round" />
      {/* body: two lobes */}
      <path d="M60 88C40 84 26 98 30 116C32 126 22 132 20 150C18 176 40 194 62 192C86 192 104 176 100 150C98 132 88 126 90 116C94 98 80 84 60 88Z" fill="var(--alien)" stroke="var(--ink)" strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M100 150C104 176 86 192 62 192C82 186 94 170 90 148C88 134 82 128 84 118C88 128 98 134 100 150Z" fill="#a24f91" />
      <circle cx="61" cy="132" r="11" fill="var(--ink)" />
      <path d="M46 162L78 161" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
      {/* strings */}
      <path d="M58 22L59 161M62 22L62 161M65 22L66 161" stroke="var(--labcoat)" strokeWidth="1.2" opacity="0.9" />
    </svg>
  );
}

export function Dumbbell({ className = '' }) {
  return (
    <svg className={`doodle jitter ${className}`} viewBox="0 0 200 100" aria-hidden="true" focusable="false">
      <path d="M52 44L148 42L148 56L52 58Z" fill="var(--labcoat)" stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round" />
      {[
        'M18 30C18 22 24 20 32 20L46 20C52 20 54 24 54 30L54 72C54 78 50 80 44 80L30 80C22 80 18 76 18 70Z',
        'M146 28C146 22 150 18 156 18L170 18C178 18 182 22 182 30L182 70C182 78 178 82 170 82L156 82C150 82 146 78 146 72Z',
      ].map((d) => (
        <path key={d} d={d} fill="var(--ink)" stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round" />
      ))}
      <path d="M26 30L26 66M154 30L154 66" stroke="#4a4a4a" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
