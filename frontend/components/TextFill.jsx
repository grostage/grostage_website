'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/frontend/lib/gsap';

// previews: { word: { image, label } } turns matching words into live words
// that float a small project preview beside the pointer.
export default function TextFill({ text, className = '', previews = {} }) {
  const ref = useRef(null), float = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const words = ref.current.querySelectorAll('.gs-word');
      gsap.fromTo(words, { opacity: 0.18 }, { opacity: 1, stagger: 0.1, ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top 85%', end: 'bottom 45%', scrub: true } });
    });
    mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const card = float.current;
      if (!card) return;
      const img = card.querySelector('img'), label = card.querySelector('span');
      gsap.set(card, { xPercent: -50, yPercent: -110, autoAlpha: 0, scale: .85, rotate: -4 });
      const x = gsap.quickTo(card, 'x', { duration: .5, ease: 'power3.out' });
      const y = gsap.quickTo(card, 'y', { duration: .5, ease: 'power3.out' });
      let current = null;
      const move = e => {
        const live = e.target.closest('.is-live');
        x(e.clientX); y(e.clientY);
        if (live === current) return;
        current = live;
        if (live) {
          img.src = live.dataset.image; label.textContent = live.dataset.label;
          gsap.to(card, { autoAlpha: 1, scale: 1, rotate: -2, duration: .45, ease: 'expo.out', overwrite: 'auto' });
        } else gsap.to(card, { autoAlpha: 0, scale: .85, rotate: -4, duration: .25, ease: 'power2.in', overwrite: 'auto' });
      };
      const leave = () => { current = null; gsap.to(card, { autoAlpha: 0, scale: .85, duration: .2, overwrite: 'auto' }); };
      const el = ref.current;
      el.addEventListener('pointermove', move, { passive: true });
      el.addEventListener('pointerleave', leave);
      return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
    });
    return () => mm.revert();
  }, { scope: ref });
  const hasPreviews = Object.keys(previews).length > 0;
  return <p ref={ref} className={'intro-fill ' + className}>{text.split(' ').map((w, i) => {
    const preview = previews[w.toLowerCase().replace(/[^\w]/g, '')];
    if (!preview) return <span className="gs-word" key={i}>{w} </span>;
    const clean = w.replace(/[^\w]+$/, ''), tail = w.slice(clean.length);
    return <span className="gs-word" key={i}><span className="is-live" data-image={preview.image} data-label={preview.label}>{clean}</span>{tail} </span>;
  })}{hasPreviews && <span ref={float} className="word-preview" aria-hidden="true"><img src={Object.values(previews)[0].image} alt="" /><span /></span>}</p>;
}
