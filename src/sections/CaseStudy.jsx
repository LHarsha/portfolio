import { useEffect } from 'react';
import { Frame } from '../shell/Frame.jsx';
import { LiveButton } from '../shell/LiveButton.jsx';
import { Tv } from '../art/Tv.jsx';
import { person, projects } from '../data/facts.js';
import { shots } from '../data/shots.js';
import './case.css';

// Projects that have something to show get a page; GroundRAG is "unpublished" and nothing more.
export const caseProjects = projects.filter((p) => p.stack.length > 0);

function Shot({ shot, className }) {
  return (
    <figure className={`case__shot ${className}`}>
      <div className="case__shot-frame">
        <img src={shot.src} width={shot.width} height={shot.height} alt={shot.alt} decoding="async" />
      </div>
      <figcaption>{shot.caption}</figcaption>
    </figure>
  );
}

// A plain, readable page per project: facts and screenshots of the live app.
export function CaseStudy({ slug }) {
  const i = caseProjects.findIndex((p) => p.slug === slug);
  const p = caseProjects[i];
  const next = caseProjects[(i + 1) % caseProjects.length];
  const shot = p && shots[p.slug];

  useEffect(() => {
    document.title = p ? `${p.name}, a project by ${person.name}` : `Not found, ${person.name}`;
    window.scrollTo(0, 0);
  }, [p]);

  if (!p) {
    return (
      <>
        <Frame />
        <main className="case case--missing">
          <Tv className="case__lost-tv" channel={0} />
          <h1 className="case__title">No signal on this channel.</h1>
          <p className="case__lead">That project page doesn't exist.</p>
          <a className="btn" href="/#work">Back to the TV</a>
        </main>
      </>
    );
  }

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Frame />
      <header className="case__bar">
        <a className="case__home" href="/">{person.name}</a>
        <nav aria-label="Case study">
          <a href="/#work">Back to the TV</a>
          <a href="/#contact">Contact</a>
        </nav>
      </header>

      <main id="main" className="case">
        <section className="case__top" aria-labelledby="case-title">
          <p className="case__kind">
            Channel {i + 1}: {p.kind}
          </p>
          <h1 id="case-title" className="case__title">{p.name}</h1>
          <p className="case__lead">{p.summary}</p>
          <div className="case__actions">
            {p.live && (
              <LiveButton href={p.live} />
            )}
            {p.repo && (
              <a className="btn btn--plain" href={p.repo} target="_blank" rel="noreferrer">
                View the code
              </a>
            )}
          </div>
        </section>

        <section className="case__shots" aria-label="Screenshots">
          <Shot shot={shot.wide} className="case__shot--wide" />
          <Shot shot={shot.tall} className="case__shot--tall" />
        </section>

        <div className={`case__body${p.details.length ? '' : ' case__body--parts-only'}`}>
          {p.details.length > 0 && (
            <section className="case__block" aria-labelledby="case-does">
              <h2 id="case-does" className="case__h2">What it does</h2>
              <ul className="case__list">
                {p.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </section>
          )}

          <aside className="case__parts" aria-labelledby="case-parts">
            <span className="case__tape" aria-hidden="true" />
            <h2 id="case-parts" className="case__parts-title">Parts list</h2>
            <ul>
              {p.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </aside>
        </div>

        <nav className="case__next" aria-label="Next project">
          <a href={`/work/${next.slug}`}>
            <span className="case__next-label">Next channel</span>
            <span className="case__next-name">{next.name}</span>
          </a>
        </nav>
      </main>
    </>
  );
}
