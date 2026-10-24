import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Smooths mouse-wheel and trackpad scrolling, so scrubbed scenes glide instead of jumping a notch
// at a time. Touch keeps the phone's own scrolling (Lenis leaves touch alone by default), and it
// never runs with reduced motion.
let lenis = null;

export function startSmoothScroll() {
  lenis = new Lenis({ lerp: 0.12, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  // one clock for both: Lenis steps on GSAP's ticker, so scroll and scrubbed tweens move in the same frame
  const tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
    lenis = null;
  };
}

// Programmatic scrolls go through Lenis while it runs, so the two never fight over the page.
// duration (seconds) and onComplete are honoured by Lenis; the browser fallback just goes there.
export function scrollToY(top, smooth, { duration = 1.2, onComplete } = {}) {
  if (lenis) {
    lenis.scrollTo(top, smooth ? { duration, onComplete } : { immediate: true, onComplete });
    return;
  }
  window.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' });
  onComplete?.();
}
