'use client';
import { useEffect, useRef } from 'react';

// Thin bar under the nav showing how far through the article the reader is.
export default function ReadingProgress({ target = 'main' }) {
  const bar = useRef(null);
  useEffect(() => {
    let frame = 0;
    const paint = () => {
      frame = 0;
      const el = document.querySelector(target);
      if (!el || !bar.current) return;
      const b = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -b.top / Math.max(1, b.height - innerHeight)));
      bar.current.style.transform = `scaleX(${p})`;
    };
    const update = () => { if (!frame) frame = requestAnimationFrame(paint); };
    paint();
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    return () => { removeEventListener('scroll', update); removeEventListener('resize', update); cancelAnimationFrame(frame); };
  }, [target]);
  return <div className="reading-progress" aria-hidden="true"><i ref={bar} /></div>;
}
