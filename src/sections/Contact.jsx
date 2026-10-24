import { GooEdge } from '../art/GooEdge.jsx';
import { Dish } from '../art/Dish.jsx';
import { Arrow } from '../art/Arrow.jsx';
import { CopyEmailButton, ContactLinks } from '../shell/ContactBits.jsx';
import { person } from '../data/facts.js';
import './contact.css';

// Not pinned on purpose: someone reaching for the email shouldn't be held by a scroll scene.
// The chapter's one trick is the goo from the dive above stretching as the chapter arrives.
export function Contact() {
  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <GooEdge />
      <div className="contact__inner" data-exit>
        <h2 id="contact-title" className="contact__lead">
          Fastest way to reach me
          <Arrow className="contact__lead-arrow" variant="down-right" />
        </h2>

        <a className="contact__email" href={`mailto:${person.email}`}>
          {person.email}
        </a>

        <div className="contact__actions">
          <div className="contact__copy">
            <CopyEmailButton />
            <p className="contact__copy-note">it's long, just copy it</p>
          </div>

          <ContactLinks />
        </div>
      </div>

      <Dish className="contact__dish" data-depth />
    </section>
  );
}
