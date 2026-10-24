// A garage-built satellite dish on a wobbly tripod, beaming at whatever is up and to its left.
export function Dish({ className = '' }) {
  return (
    <svg className={`dish jitter ${className}`} viewBox="0 0 240 250" aria-hidden="true" focusable="false">
      <g className="dish__signal boil" fill="none" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round">
        <path d="M62 64C50 52 46 38 50 24" />
        <path d="M44 76C26 60 20 38 28 14" />
        <path d="M26 90C2 70 -4 40 8 8" />
      </g>
      <g>
        {/* tripod */}
        <path d="M138 150L102 236M140 150L146 240M142 150L190 230" fill="none" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" />
        <path d="M112 214L182 216" fill="none" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
        <path d="M120 138C126 128 150 126 158 138L154 156C146 162 128 162 122 156Z" fill="var(--garage)" stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round" />
        {/* the dish, tilted up-left, with one flat shadow tone */}
        <path d="M78 52C110 26 172 38 196 82C214 118 196 150 168 150C128 152 82 126 70 96C64 80 66 62 78 52Z" fill="var(--labcoat)" stroke="var(--ink)" strokeWidth="5" strokeLinejoin="round" />
        <path d="M168 150C196 150 214 118 196 82C204 108 194 132 170 136C140 138 104 124 82 104C98 132 136 152 168 150Z" fill="#c9d4cf" />
        {/* feed arm and emitter */}
        <path d="M136 98L96 70" fill="none" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
        <path d="M84 60C90 54 100 56 102 64C104 72 96 78 89 76C82 74 79 66 84 60Z" fill="var(--portal)" stroke="var(--ink)" strokeWidth="4" />
        <circle cx="136" cy="98" r="6" fill="var(--ink)" />
      </g>
    </svg>
  );
}
