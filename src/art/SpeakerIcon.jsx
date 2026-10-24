// Hand-drawn speaker. Waves when on, a little cross when off.
export function SpeakerIcon({ on }) {
  return (
    <svg className="speaker" viewBox="0 0 34 28" aria-hidden="true" focusable="false">
      <path d="M3.5 10.2L10 9.6L17.8 3.4L18.4 24.4L10.2 18.6L3.8 18.2Z" fill="var(--labcoat)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
      {on ? (
        <g fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round">
          <path d="M22.5 9.4C24.6 11.6 24.7 16.2 22.4 18.6" />
          <path d="M26.4 5.8C30.6 10 30.8 17.8 26.2 22.4" />
        </g>
      ) : (
        <g fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round">
          <path d="M23 10.2L30.6 17.6" />
          <path d="M30.2 10L23.4 17.8" />
        </g>
      )}
    </svg>
  );
}
