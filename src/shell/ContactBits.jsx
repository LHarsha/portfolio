import { useState } from 'react';
import { Goo } from '../art/Goo.jsx';
import { ClipboardIcon, Splat } from '../art/ButtonBits.jsx';
import { BadgeIcon, CodeIcon, SheetIcon } from '../art/Icons.jsx';
import { blip } from '../lib/sound.js';
import { person } from '../data/facts.js';

// Shared by Contact and the footer so both behave the same.

export const contactLinks = [
  { label: 'LinkedIn', href: person.linkedin, Icon: BadgeIcon },
  { label: 'GitHub', href: person.github, Icon: CodeIcon },
  { label: 'Resume (PDF)', href: person.resume, Icon: SheetIcon },
];

export function CopyEmailButton({ className = '' }) {
  const [copied, setCopied] = useState(false);
  // a fresh key per copy, so the splat bursts again on every click
  const [shot, setShot] = useState(0);

  async function copy() {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      setShot((n) => n + 1);
      blip(780);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      window.location.href = `mailto:${person.email}`;
    }
  }

  return (
    <>
      <button type="button" className={`btn btn--slime copy-btn ${className}`} onClick={copy} data-copied={copied || undefined}>
        <ClipboardIcon done={copied} />
        <span>{copied ? 'Email copied' : 'Copy email'}</span>
        {copied && <Splat key={shot} />}
        <Goo />
      </button>
      <span className="visually-hidden" aria-live="polite">
        {copied ? 'Email address copied to clipboard' : ''}
      </span>
    </>
  );
}

export function ContactLinks({ className = '' }) {
  return (
    <ul className={`contact-links ${className}`}>
      {contactLinks.map(({ label, href, Icon }) => (
        <li key={label}>
          <a className="btn btn--plain contact-links__a" href={href} target="_blank" rel="noreferrer">
            <Icon className="contact-links__icon" />
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
