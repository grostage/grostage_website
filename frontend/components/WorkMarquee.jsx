'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { gsap, ScrollTrigger, useGSAP } from '@/frontend/lib/gsap';

export default function WorkMarquee({ works }) {
  const root = useRef(null); //abc
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const rows = root.current.querySelectorAll('.gs-row');
      const tweens = [...rows].map((row, i) => gsap.fromTo(row, { xPercent: i ? -50 : 0 }, { xPercent: i ? 0 : -50, duration: 40, ease: 'none', repeat: -1 }));
      let boost = 0;
      const decay = () => { boost *= 0.92; tweens.forEach(t => t.timeScale(1 + boost)); };
      gsap.ticker.add(decay);
      ScrollTrigger.create({ trigger: root.current, start: 'top bottom', end: 'bottom top',
        onUpdate: self => { boost = Math.min(Math.abs(self.getVelocity()) / 350, 6); },
        onToggle: self => tweens.forEach(t => (self.isActive ? t.play() : t.pause())) });
      return () => gsap.ticker.remove(decay);
    });
  }, { scope: root });

  return <section ref={root} className="work-marquee" aria-label="Selected work">
    {[0, 1].map(index => <div className="marquee-drift" key={index}>
      <div className="marquee-row gs-row">
        {[0, 1].map(copy => <div className="marquee-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
          {works.map(w => <Link href={'/work/' + w.slug} tabIndex={copy === 1 ? -1 : 0} className="marquee-card" key={w.slug}><img src={w.image} alt="" loading="lazy" /><span>{w.title} ↗</span></Link>)}
        </div>)}
      </div>
    </div>)}
  </section>;
}
