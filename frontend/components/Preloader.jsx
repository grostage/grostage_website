'use client';
import { useRef } from 'react';
import { gsap, useGSAP, markReady } from '@/frontend/lib/gsap';

// A plain black cover on first load that fades away once the page is ready.
export default function Preloader() {
  const root = useRef(null);
  useGSAP(() => {
    const el = root.current;
    const fallback = setTimeout(() => { el.style.display = 'none'; markReady(); }, 3000);
    let seen = false;
    try { seen = sessionStorage.getItem('gs-seen'); sessionStorage.setItem('gs-seen', '1'); } catch { /* Storage can be disabled in private contexts. */ }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || seen) { el.style.display = 'none'; markReady(); return () => clearTimeout(fallback); }
    gsap.to(el, { autoAlpha: 0, duration: .5, delay: .25, ease: 'power2.out', onStart: markReady, onComplete: () => { el.style.display = 'none'; } });
    return () => clearTimeout(fallback);
  }, []);
  return <div ref={root} className="gs-preloader" aria-hidden="true" />;
}
