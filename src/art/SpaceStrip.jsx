import { blobPath, sparklePath } from '../lib/shapes.js';
import { rng } from '../lib/rng.js';

// Flat navy strip with flat stars and a wobbly ringed planet.
const W = 1200;
const H = 260;
const stars = (() => {
  const rand = rng(77);
  return Array.from({ length: 46 }, () => ({ x: rand() * W, y: rand() * H, r: 1 + rand() * 2.2, s: rand() < 0.16 }));
})();
const planet = blobPath({ cx: 930, cy: 130, rx: 70, ry: 66, jag: 0.035, points: 18, seed: 12 });
const shade = blobPath({ cx: 952, cy: 146, rx: 54, ry: 52, jag: 0.04, points: 16, seed: 13 });

export function SpaceStrip({ className = '' }) {
  return (
    <svg className={className} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMaxYMid slice" aria-hidden="true" focusable="false">
      <rect width={W} height={H} fill="var(--space)" />
      {stars.map((st, i) =>
        st.s ? (
          <path key={i} d={sparklePath(st.x, st.y, st.r * 4)} fill="var(--labcoat)" />
        ) : (
          <circle key={i} cx={st.x} cy={st.y} r={st.r} fill="var(--labcoat)" opacity={0.85} />
        ),
      )}
      <g className="boil">
        <Ring half="back" />
        <path d={planet} fill="var(--alien)" stroke="var(--ink)" strokeWidth="4" />
        <clipPath id="planet-clip"><path d={planet} /></clipPath>
        <g clipPath="url(#planet-clip)">
          <path d={shade} fill="#a24f91" transform="translate(18 16)" />
        </g>
        <Ring half="front" />
      </g>
    </svg>
  );
}

// Ring as two arcs so the planet sits between them.
function Ring({ half }) {
  const d = `M810 130A120 26 0 0 ${half === 'back' ? 1 : 0} 1050 130`;
  return (
    <g transform="rotate(-12 930 130)">
      <path d={d} fill="none" stroke="var(--ink)" strokeWidth="11" strokeLinecap="round" />
      <path d={d} fill="none" stroke="var(--mustard)" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}
