// Temporary stand-in for a chapter that hasn't been built yet. Delete as each section lands.
export function Placeholder({ chapter, step }) {
  return (
    <section id={chapter.id} className="chapter" data-tone={chapter.tone} style={{ background: chapter.bg }} aria-labelledby={`${chapter.id}-title`}>
      <div className="placeholder">
        <p className="placeholder__tag">Placeholder, section {step}</p>
        <h2 id={`${chapter.id}-title`} className="placeholder__title">{chapter.label ?? 'Hero'}</h2>
      </div>
    </section>
  );
}
