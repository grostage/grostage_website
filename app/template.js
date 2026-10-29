'use client';
import { useRef } from 'react';
import { gsap, SplitText, ScrollTrigger, useGSAP } from '@/frontend/lib/gsap';

export default function Template({ children }) {
  const ref = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const root = ref.current;
      const headings = [...root.querySelectorAll('h1,h2')].filter(n => !n.closest('.wk-page,.td,.cinematic-home,.experience-hero,.reel-section,.studio-showcase,.adm,.rx-intro,.rx-cta,.rx,.cs'));
      const splits = headings.map(heading => SplitText.create(heading, {
        type: 'lines', mask: 'lines', linesClass: 'interactive-line', autoSplit: true,
        onSplit(self) { return gsap.from(self.lines, { yPercent: 105, opacity: .2, stagger: .07, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: heading, start: 'top 95%', once: true } }); }
      }));
      const els = [...root.querySelectorAll('h1,h2,h3,blockquote,main p,.about-feature>img,.work-cover,.article-cover')]
        .filter(n => !n.closest('.wk-page,.td,.cform,.cinematic-home,.adm,.hero,.reveal,.reel-section,.hx,.studio-showcase,.experience-hero,.svx,.rx,.rx-intro,.rx-cta,.cs') && !n.matches('h1,h2,.intro-fill'));
      gsap.set(els, { autoAlpha: 0, y: 24 });
      ScrollTrigger.batch(els, { start: 'top 92%', once: true,
        onEnter: b => gsap.to(b, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', overwrite: true }) });
      const refresh = setTimeout(() => ScrollTrigger.refresh(), 150);

      if (!matchMedia('(pointer:fine)').matches) return () => { clearTimeout(refresh); splits.forEach(s => s.revert()); };
      let tilted;
      const reset = () => { if (tilted) { tilted.style.removeProperty('transform'); tilted = null; } };
      const move = e => {
        // Light that follows the pointer across intros and cards.
        const lit = e.target.closest('.page-intro,.review-card,.team-card,.service-detail,.cform');
        if (lit) { const r = lit.getBoundingClientRect(); lit.style.setProperty('--mx', e.clientX - r.left + 'px'); lit.style.setProperty('--my', e.clientY - r.top + 'px'); }
        const card = e.target.closest('.service-card,.project-card,.review-card,.team-card,.blog-card');
        if (card !== tilted) reset();
        if (!card) return;
        tilted = card;
        const b = card.getBoundingClientRect();
        const x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
        card.style.transform = `perspective(1100px) rotateX(${-y * 5}deg) rotateY(${x * 6}deg) translateY(-3px)`;
      };
      root.addEventListener('pointermove', move, { passive: true });
      root.addEventListener('pointerleave', reset);
      return () => { clearTimeout(refresh); splits.forEach(s => s.revert()); root.removeEventListener('pointermove', move); root.removeEventListener('pointerleave', reset); reset(); };
    });
    return () => mm.revert();
  }, { scope: ref });
  return <div ref={ref} className="page-motion">{children}</div>;
}
