// Inked panel border around the viewport; the page scrolls inside it.
export function Frame({ tone }) {
  return <div className="frame" data-tone={tone} aria-hidden="true" />;
}
