// Small hand-drawn link icons, one stroke weight. Deliberately not brand logos.
const common = {
  viewBox: '0 0 28 28',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

// ID badge on a lanyard: the professional-profile one.
export function BadgeIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M5.2 8.4C5 7 6 6 7.4 6.1L20.8 5.8C22.1 5.8 23 6.7 22.9 8L22.6 21.3C22.6 22.6 21.6 23.4 20.3 23.4L7.6 23.6C6.2 23.6 5.3 22.7 5.4 21.4Z" />
      <path d="M11 6L12.4 2.6M17 6L15.7 2.5" />
      <circle cx="11" cy="13.2" r="2.4" />
      <path d="M7.9 19.4C8.5 17.6 9.6 16.8 11 16.8S13.5 17.6 14.1 19.3M16.6 12.4H20M16.6 16H19.4" />
    </svg>
  );
}

// Angle brackets around a slash: the code one.
export function CodeIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M9.4 7.6L3.6 14.2L9.6 20.4M18.6 7.4L24.4 14L18.4 20.6M15.8 5.4L12.2 22.8" />
    </svg>
  );
}

// Sheet of paper with a folded corner: the resume one.
export function SheetIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M7 3.6L16.8 3.4L22 8.8L21.8 24.2L7.2 24.5Z" />
      <path d="M16.6 3.6L16.7 9L21.8 8.9M10.6 13.4H18M10.4 17H18.2M10.6 20.6H15" />
    </svg>
  );
}
