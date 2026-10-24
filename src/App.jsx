import { useEffect } from 'react';
import { BoilDefs } from './art/BoilDefs.jsx';
import { pauseBoilOffscreen } from './lib/motion.js';
import StyleTile from './dev/StyleTile.jsx';

// Temporary: the style tile stands in for the page until Harsha approves the look.
export default function App() {
  useEffect(() => pauseBoilOffscreen(), []);
  return (
    <>
      <BoilDefs />
      <StyleTile />
    </>
  );
}
