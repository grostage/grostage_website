'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/frontend/lib/gsap';

// Logo wall: tiles rise in row by row; displays client logo, company name, and industry
export default function ClientWall({ clients }) {
  const root = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray('.cl-tile', root.current).forEach((tile, i) => {
        gsap.from(tile, {
          autoAlpha: 0,
          y: 28,
          duration: 0.8,
          delay: (i % 4) * 0.05,
          ease: 'expo.out',
          scrollTrigger: { trigger: tile, start: 'top 94%', once: true }
        });
      });
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section className="cl-wall" ref={root} data-nav-theme="light" aria-label="Client list">
      <ul>
        {clients.map(c => (
          <li key={c.name} className="cl-tile">
            <div className="cl-logo-wrap">
              {c.logo ? (
                <img src={c.logo} alt={`${c.name} logo`} loading="lazy" />
              ) : (
                <span className="cl-word">{c.name}</span>
              )}
            </div>
            <div className="cl-info">
              <span className="cl-name">{c.name}</span>
              {c.industry && <span className="cl-industry">{c.industry}</span>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
