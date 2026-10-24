// A chunky cartoon CRT: teal body, wood bezel, rabbit-ear antenna, a channel knob and a speaker.
// The screen is left empty: the scene lays HTML (screenshots, static) over SCREEN.
export const SCREEN = { x: 92, y: 142, w: 336, h: 276, vw: 640, vh: 520 };

export function Tv({ channel = 0, channels = 4, className = '' }) {
  const turn = -60 + (120 / Math.max(1, channels - 1)) * channel;
  return (
    <svg className={`tv ${className}`} viewBox="0 0 640 520" aria-hidden="true" focusable="false">
      {/* antenna */}
      <g fill="none" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round">
        <path d="M300 96L206 14" />
        <path d="M318 94L428 22" />
      </g>
      <path d="M262 98C270 78 344 76 354 98Z" fill="var(--garage-dark)" stroke="var(--ink)" strokeWidth="4.5" strokeLinejoin="round" />
      <circle cx="204" cy="12" r="8" fill="var(--portal-light)" stroke="var(--ink)" strokeWidth="4" />
      <circle cx="430" cy="20" r="8" fill="var(--portal-light)" stroke="var(--ink)" strokeWidth="4" />

      {/* feet */}
      <path d="M96 462L84 506L150 506L144 462Z M500 462L494 506L560 506L548 462Z" fill="var(--garage-dark)" stroke="var(--ink)" strokeWidth="4.5" strokeLinejoin="round" />

      {/* body with one flat shadow tone */}
      <path d="M62 104C150 92 490 90 580 102C602 106 610 118 610 140L606 440C606 462 594 472 572 472C470 478 170 480 70 470C48 468 36 456 36 434L40 136C40 116 46 106 62 104Z" fill="var(--sky)" stroke="var(--ink)" strokeWidth="5.5" strokeLinejoin="round" />
      <path d="M606 300L604 440C604 460 592 470 572 470C470 476 170 478 70 468C120 470 470 466 560 458C582 456 590 446 590 426L594 300Z" fill="#2f8f9c" />

      {/* wood bezel and the screen hole */}
      <path d="M78 128C160 120 360 118 446 126C458 128 464 136 464 150L460 412C460 426 452 434 438 434C350 440 170 442 84 434C72 432 66 424 66 410L68 144C68 134 72 129 78 128Z" fill="var(--garage-dark)" stroke="var(--ink)" strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M96 140C180 134 340 134 424 140C432 142 434 148 434 156L430 404C430 412 426 418 416 418C340 424 180 424 102 418C94 418 90 412 90 404L92 154C92 146 92 141 96 140Z" fill="var(--space)" stroke="var(--ink)" strokeWidth="4" />
      {/* wood grain */}
      <path d="M74 200C76 260 72 330 76 392M454 180C452 250 456 330 452 400" fill="none" stroke="#5a4329" strokeWidth="2.5" strokeLinecap="round" />

      {/* channel knob: the pointer turns with the channel */}
      <path d="M520 160C544 158 560 176 560 198C560 222 542 238 520 238C496 238 480 220 482 198C482 176 498 160 520 160Z" fill="var(--labcoat)" stroke="var(--ink)" strokeWidth="4.5" />
      <g className="tv__pointer" style={{ transform: `rotate(${turn}deg)` }}>
        <path d="M520 199L520 168" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" />
      </g>
      <circle cx="520" cy="199" r="6" fill="var(--ink)" />
      {Array.from({ length: channels }, (_, i) => {
        const a = ((-60 + (120 / Math.max(1, channels - 1)) * i - 90) * Math.PI) / 180;
        return (
          <circle key={i} cx={520 + Math.cos(a) * 50} cy={199 + Math.sin(a) * 50} r={i === channel ? 5 : 3.5} fill={i === channel ? 'var(--mustard)' : 'var(--ink)'} stroke="var(--ink)" strokeWidth="2" />
        );
      })}

      {/* volume knob and speaker grille */}
      <path d="M520 272C536 272 546 284 546 298C546 314 534 324 520 324C504 324 494 312 494 298C494 284 506 272 520 272Z" fill="var(--labcoat)" stroke="var(--ink)" strokeWidth="4" />
      <path d="M520 298L532 286" stroke="var(--ink)" strokeWidth="4.5" strokeLinecap="round" />
      <g stroke="var(--ink)" strokeWidth="4" strokeLinecap="round">
        <path d="M490 352L552 351M490 370L553 370M490 388L552 389M491 406L551 406" />
      </g>
    </svg>
  );
}

// A wooden workbench plank for the TV to sit on.
export function Bench({ className = '' }) {
  return (
    <svg className={`bench ${className}`} viewBox="0 0 1200 90" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M0 14C300 8 900 10 1200 16L1200 52C900 48 300 50 0 54Z" fill="var(--garage-dark)" stroke="var(--ink)" strokeWidth="4" vectorEffect="non-scaling-stroke" />
      <path d="M40 32C240 28 520 34 760 30S1100 32 1170 30" fill="none" stroke="#5a4329" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
      <path d="M60 54L70 90M1140 54L1130 90" stroke="var(--ink)" strokeWidth="5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
