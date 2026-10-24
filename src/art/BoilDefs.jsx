// Mount once at the app root. Three seeds, cycled by the .boil class.
export function BoilDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
      {[11, 23, 37].map((seed, i) => (
        <filter id={`boil-${i}`} key={seed} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed={seed} />
          <feDisplacementMap in="SourceGraphic" scale="2.5" />
        </filter>
      ))}
    </svg>
  );
}
