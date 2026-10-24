// The only place facts live. Source: CLAUDE.md + the resume. Never add anything that isn't there.

export const person = {
  name: 'Harsha Lolewar',
  firstName: 'Harsha',
  city: 'Hyderabad',
  region: 'Telangana, India',
  email: 'harshawork002@gmail.com',
  linkedin: 'https://www.linkedin.com/in/harsha-lolewar',
  github: 'https://github.com/LHarsha',
  resume: '/Harsha_Lolewar_Resume.pdf',
  seeking: 'Internships in AI/ML, software development and related fields, plus freelance work',
  availability: 'Open to roles and freelance',
  interests: ['Guitar', 'Gym'],
  languages: ['English', 'Telugu', 'Hindi'],
};

export const education = {
  degree: 'BSc Computer Science',
  specialization: 'Cognitive Systems',
  school: 'Loyola Academy, Hyderabad',
  years: '2025–2028',
  cgpa: '8.1/10',
};

export const projects = [
  {
    slug: 'sync-or-solo',
    name: 'Sync or Solo',
    kind: 'Real-time multiplayer party game',
    live: 'https://sync-or-solo.harshalolewar002.workers.dev/',
    repo: null, // pending from Harsha
    summary:
      'A party game for 2–8 players on their phones. Everyone answers the same prompt, then bets on matching the crowd (Sync) or standing alone (Solo).',
    details: [
      'React + WebSockets for live, room-based play with 4-letter room codes',
      'Deployed on Cloudflare Workers',
      'No accounts or installs; idle rooms expire after 30 minutes',
    ],
    stack: ['React', 'WebSockets', 'Cloudflare Workers'],
  },
  {
    slug: 'bugloop',
    name: 'BugLoop',
    kind: 'AI debugging knowledge assistant',
    live: 'https://bugloop-ai-debugging-knowledge-assistant.ai.studio/',
    repo: null,
    summary:
      'An AI debugging workbench for student developers, vibe-coded in Google AI Studio for the Handshake AI Skill Studio mission.',
    details: [
      'Diagnoses errors step by step',
      'Saves confirmed fixes to a local knowledge base (IndexedDB)',
      'Turns repeated error patterns into reusable debugging rules',
    ],
    stack: ['Google AI Studio', 'IndexedDB'],
  },
  {
    slug: 'anti-gravity',
    name: 'Anti Gravity',
    kind: '3D project manager',
    live: null,
    repo: null,
    summary:
      'A web app where planets in a 3D solar system represent projects, controlled with hand gestures.',
    details: [],
    stack: ['React', 'Three.js (React Three Fiber)', 'MediaPipe Hands', 'Zustand', 'Tailwind'],
  },
  {
    slug: 'groundrag',
    name: 'GroundRAG',
    kind: 'Research paper, co-author',
    live: null,
    repo: null,
    summary: 'Co-author of a research paper. It’s unpublished.',
    details: [],
    stack: [],
  },
];

export const labLog = [
  { when: '2026', what: '1st Prize, Brain Rush & Technoverse', where: 'TECHXCELERATE, Loyola Academy' },
  {
    when: '2026',
    what: "SPEC'S Industry Hack 2026",
    where: "St. Peter's Engineering College",
    note: 'National-level 24-hr hackathon, team of 2, frontend + bug fixing',
  },
  { when: '8–9 Jan 2026', what: '2-day state-level hackathon', where: 'Loyola Academy' },
  {
    when: '2026',
    what: 'Handshake AI Skill Studio',
    where: 'Handshake',
    note: 'Built BugLoop, designed a Halloween-themed logo',
  },
  {
    when: 'From July 2025',
    what: 'AI & ML with Drone Tech program',
    where: 'TiHAN IIT Hyderabad × Masai',
  },
  { when: '2025–2028', what: 'BSc Computer Science, Cognitive Systems', where: 'Loyola Academy, Hyderabad', note: 'CGPA 8.1/10' },
  { when: 'First semester', what: 'Music Club member', where: 'Loyola Academy' },
];

export const toolkit = {
  Languages: ['Python', 'Java', 'C', 'SQL', 'JavaScript'],
  Web: ['React', 'WebSockets', 'Three.js', 'Cloudflare Workers'],
  'AI / ML': ['Prompt engineering', 'Google AI Studio'],
  Data: ['MySQL', 'IndexedDB'],
  Tools: ['Git', 'GitHub', 'VS Code'],
};

// Harsha's three statements, in his own words (headlines cut from his sentences, picked by him
// on 2026-10-24; follow-ups are his sentences, trimmed). Don't rewrite them.
export const statements = {
  working: {
    lead: 'I build a ',
    key: 'working',
    tail: ' version, then keep improving it.',
    more: 'I usually start by understanding the problem I want to solve, then research and break it into smaller parts. I like experimenting with different tools, including AI, but I also want to understand how things work rather than just rely on generated code.',
  },
  useful: {
    line1: ['AI can help you build ', 'faster', '.'],
    line2: ["That doesn't make it ", 'useful', '.'],
    more: 'People sometimes focus too much on using the newest AI tools and forget about the actual problem they’re trying to solve. Understanding the fundamentals, testing your work, and knowing why something works are just as important as using AI.',
  },
  easier: {
    lead: 'I want things to genuinely become ',
    key: 'easier',
    tail: '.',
    more: 'I want to build things that are practical, easy to use, and genuinely helpful to the people who use them.',
  },
};
