// Voice Agent runs on Android phones, so there's no live site to screenshot: its TV channel and case
// page show this drawing instead. The orb is the app's listening bubble; the grey line is what it
// heard, the way the app shows it (the phrase is one of the README's examples).
export function VoiceOrb({ className = '', label }) {
  return (
    <svg
      className={`voice-orb ${className}`}
      viewBox="0 0 800 657"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label}
    >
      <rect width="800" height="657" fill="var(--space)" />
      {/* a few stars, so the dark screen reads as the lab's sky rather than a blank panel */}
      {[[92, 88, 3], [168, 520, 2.5], [690, 120, 3.5], [736, 470, 2.5], [612, 590, 2], [70, 330, 2], [250, 70, 2]].map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="var(--labcoat)" opacity="0.55" />
      ))}

      {/* the glow and the sound rings around the orb */}
      <circle cx="400" cy="300" r="215" fill="var(--sky)" opacity="0.08" />
      <circle cx="400" cy="300" r="168" fill="var(--sky)" opacity="0.14" />
      <circle cx="400" cy="300" r="138" fill="none" stroke="var(--portal-light)" strokeWidth="5" strokeLinecap="round" strokeDasharray="20 24" opacity="0.6" />

      {/* the orb: flat cel colours, a thick ink outline, a swirl and a shine */}
      <circle cx="400" cy="300" r="106" fill="var(--sky)" stroke="var(--ink)" strokeWidth="8" />
      <path d="M312 325C338 385 464 393 494 323C468 357 342 363 312 325Z" fill="var(--alien)" opacity="0.85" />
      <path
        d="M338 297C350 235 448 223 466 277C480 319 428 341 402 323C380 307 392 273 420 281"
        fill="none"
        stroke="var(--labcoat)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <ellipse cx="356" cy="243" rx="22" ry="13" transform="rotate(-32 356 243)" fill="var(--labcoat)" />
      <circle cx="400" cy="300" r="106" fill="none" stroke="var(--ink)" strokeWidth="8" />

      {/* what it heard, in grey, under the orb */}
      <text x="400" y="560" textAnchor="middle" fontFamily="var(--font-hand)" fontSize="52" fill="#a3abc2">
        “Wake me up at 6:30”
      </text>
    </svg>
  );
}
