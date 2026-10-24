import { useId } from 'react';

// Harsha as a cartoon, drawn by hand from his guitar photo (the photo itself stays private):
// the big wavy hair, the earbud he always has in, a thin moustache, and a guitar neck across the front.
const SKIN = '#a8693f';
const SKIN_SHADE = '#8a522f';
const HAIR = '#1f1a17';
const blob = 'M130 12C196 10 248 60 248 132C250 206 200 262 128 262C58 264 10 210 12 134C12 62 62 14 130 12Z';

export function Avatar({ className = '' }) {
  const clip = useId();
  return (
    <svg className={`avatar jitter ${className}`} viewBox="0 0 260 270" role="img" aria-label="Cartoon drawing of Harsha with his guitar" focusable="false">
      <defs>
        <clipPath id={clip}>
          <path d={blob} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`} stroke="var(--ink)" strokeLinejoin="round" strokeLinecap="round">
        <rect width="260" height="270" fill="var(--mustard)" stroke="none" />
        <path d="M200 0L260 0L260 270L236 270C230 180 214 90 200 0Z" fill="#d9bd2f" stroke="none" />

        {/* back hair: a lumpy cloud of waves */}
        <path d="M80 172Q58 164 62 142Q46 126 58 106Q48 84 70 72Q68 48 94 46Q110 28 132 36Q154 26 170 44Q196 44 196 70Q214 84 204 106Q216 126 200 142Q204 164 182 172L174 104L88 104Z" fill={HAIR} strokeWidth="4" />

        {/* tee, neck */}
        <path d="M36 280C40 236 68 214 108 206C120 214 140 214 152 206C192 214 220 236 224 280Z" fill="#2c303b" strokeWidth="4.5" />
        <path d="M112 176L110 210C122 218 138 218 150 210L148 176Z" fill={SKIN} strokeWidth="4" />
        <path d="M111 186C124 196 138 196 149 186L149 200C138 206 122 206 111 200Z" fill={SKIN_SHADE} stroke="none" />
        <path d="M108 206C118 220 142 220 152 206" fill="none" strokeWidth="4" />

        {/* ears, face with one flat shadow, stubble */}
        <path d="M87 118C73 112 69 132 75 142C79 149 85 149 88 145Z" fill={SKIN} strokeWidth="4" />
        <path d="M173 118C187 112 191 132 185 142C181 149 175 149 172 145Z" fill={SKIN} strokeWidth="4" />
        <path d="M84 104C82 138 91 166 112 182C122 190 140 191 150 184C171 168 180 140 178 104C172 84 90 84 84 104Z" fill={SKIN} strokeWidth="4.5" />
        <path d="M85 106C83 140 92 164 112 181C102 164 97 140 98 110Z" fill={SKIN_SHADE} stroke="none" />
        <path d="M105 168C109 184 120 190 130 190C141 190 153 184 157 168C150 178 141 182 130 182C119 182 110 178 105 168Z" fill="#94593a" stroke="none" />

        {/* earbud */}
        <path d="M182 136L183 150" fill="none" strokeWidth="3.5" />
        <circle cx="181" cy="132" r="5" fill="var(--labcoat)" strokeWidth="3" />

        {/* front hair: waves from a loose middle part, falling onto the forehead */}
        <path d="M83 120Q73 98 89 86Q89 64 111 64Q127 50 145 62Q167 58 171 80Q189 92 181 118Q177 102 165 100Q161 110 149 106Q147 94 135 96Q127 108 117 101Q109 96 102 104Q92 106 83 120Z" fill={HAIR} strokeWidth="4" />
        <path d="M96 84Q104 74 116 78M130 60Q140 70 152 70M150 82Q160 80 166 90M70 98Q78 92 84 100M66 128Q70 138 80 138M196 98Q188 94 184 102M194 128Q190 140 182 140M110 46Q118 54 128 50" fill="none" stroke="#5a4b40" strokeWidth="3" />

        {/* brows, slightly heavy-lidded eyes */}
        <path d="M99 118C106 113 117 113 123 116M139 116C145 113 156 113 163 118" fill="none" strokeWidth="5.5" />
        <path d="M102 129C108 124 118 124 123 129C118 133 108 133 102 129Z" fill="var(--labcoat)" strokeWidth="2.5" />
        <path d="M139 129C144 124 154 124 160 129C154 133 144 133 139 129Z" fill="var(--labcoat)" strokeWidth="2.5" />
        <circle cx="113" cy="129.5" r="3.6" fill="#2a1a10" stroke="none" />
        <circle cx="150" cy="129.5" r="3.6" fill="#2a1a10" stroke="none" />
        <path d="M101 129C107 123 118 123 124 128M138 128C144 123 155 123 161 129" fill="none" strokeWidth="4" />

        {/* nose, moustache, a half smile */}
        <path d="M131 132C130 142 126 148 123 152C127 157 136 157 140 152" fill="none" strokeWidth="3.5" />
        <path d="M114 166Q130 159 146 166Q130 163.5 114 166Z" fill="#3a2c24" stroke="#3a2c24" strokeWidth="2" />
        <path d="M119 172C126 175.5 134 175 142 169.5" fill="none" strokeWidth="3.5" />

        {/* guitar */}
        <path d="M-4 196C36 190 68 204 74 238L76 280L-4 280Z" fill="#8b5a2b" strokeWidth="4.5" />
        <circle cx="12" cy="252" r="15" fill="#1d1410" strokeWidth="3.5" />
        <path d="M-10 252L270 224L270 250L-10 282Z" fill="#3a2a1e" strokeWidth="4.5" />
        <path d="M60 246L62 274M120 240L122 267M175 234L177 261M226 229L228 255" fill="none" stroke="#c9c2ae" strokeWidth="2.5" />
        <g fill="var(--labcoat)" stroke="none">
          <circle cx="92" cy="256" r="3.4" />
          <circle cx="149" cy="250" r="3.4" />
          <circle cx="202" cy="244" r="3.4" />
        </g>
      </g>
      <path d={blob} fill="none" stroke="var(--ink)" strokeWidth="5" />
    </svg>
  );
}
