// Hyderabad's Charminar as a wobbly cartoon line drawing: four minarets, the big arch, onion domes.
// Drawn by hand in this repo; flat labcoat fill with one shadow tone.
function Minaret({ x }) {
  return (
    <g>
      <path d={`M${x - 11} 252L${x - 9} 52L${x + 9} 51L${x + 11} 252Z`} fill="var(--labcoat)" stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round" />
      <path d={`M${x + 3} 52L${x + 9} 51L${x + 11} 252L${x + 4} 252Z`} fill="#c9d4cf" />
      {[132, 96, 64].map((y) => (
        <path key={y} d={`M${x - 16} ${y}C${x - 8} ${y - 6} ${x + 8} ${y - 6} ${x + 16} ${y}L${x + 14} ${y + 7}C${x + 6} ${y + 3} ${x - 6} ${y + 3} ${x - 14} ${y + 7}Z`} fill="var(--labcoat)" stroke="var(--ink)" strokeWidth="3.5" strokeLinejoin="round" />
      ))}
      <path d={`M${x - 10} 52C${x - 12} 36 ${x - 2} 30 ${x} 18C${x + 3} 30 ${x + 12} 36 ${x + 10} 52Z`} fill="var(--labcoat)" stroke="var(--ink)" strokeWidth="3.5" strokeLinejoin="round" />
      <path d={`M${x} 18L${x + 1} 8`} stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

export function Charminar({ className = '', ...rest }) {
  return (
    <svg className={`charminar jitter ${className}`} viewBox="0 0 300 262" aria-hidden="true" focusable="false" {...rest}>
      {/* main block with the big arch */}
      <path d="M58 252L60 124L242 122L244 252L194 252C194 212 182 176 151 168C120 176 108 212 107 252Z" fill="var(--labcoat)" stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round" />
      <path d="M194 252C194 212 182 176 151 168C170 180 178 210 178 252Z" fill="#c9d4cf" />
      {/* gallery of small arches across the top */}
      <path d="M60 124L61 104L241 102L242 122" fill="var(--labcoat)" stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round" />
      <path d="M72 122C72 112 84 112 84 122M96 122C96 112 108 112 108 122M120 122C120 112 132 112 132 122M144 122C144 112 156 112 156 122M168 122C168 112 180 112 180 122M192 122C192 112 204 112 204 122M216 122C216 112 228 112 228 122" fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
      <Minaret x={56} />
      <Minaret x={246} />
      {/* ground */}
      <path d="M8 252C70 249 140 254 196 251S270 250 294 252" fill="none" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
