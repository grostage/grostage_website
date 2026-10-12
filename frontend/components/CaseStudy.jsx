'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/frontend/lib/gsap';

// Full-bleed cover that opens from a framed window, then drifts as you scroll.
export function CaseHero({ image, alt, contain, children }) {
  const root = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const media = root.current.querySelector('.cs-hero-media');
      gsap.fromTo(media, { clipPath: 'inset(22% 18% 22% 18% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.6, ease: 'expo.out', delay: .15 });
      gsap.fromTo(media.querySelector('img'), { scale: 1.25 }, { scale: 1.02, duration: 2, ease: 'expo.out', delay: .15 });
      gsap.to(media.querySelector('img'), { yPercent: 12, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to(root.current.querySelector('.cs-hero-copy'), { yPercent: -30, opacity: .2, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
    });
    return () => mm.revert();
  }, { scope: root });
  return <section className="cs-hero" ref={root} data-nav-theme="dark">
    <div className={'cs-hero-media' + (contain ? ' is-contain' : '')}><img src={image} alt={alt} fetchPriority="high" /></div>
    <div className="cs-hero-shade" aria-hidden="true" />
    <div className="cs-hero-copy">{children}</div>
  </section>;
}

// Wide image that scales up from a card as it crosses the viewport.
export function CaseGallery({ image, alt }) {
  const root = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(root.current.querySelector('.cs-gallery-frame'), { clipPath: 'inset(8% 14% 8% 14% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 20px)', ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'center 55%', scrub: .6 } });
      gsap.fromTo(root.current.querySelector('img'), { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: .6 } });
    });
    return () => mm.revert();
  }, { scope: root });
  return <section className="cs-gallery" ref={root} data-nav-theme="dark"><div className="cs-gallery-frame"><img src={image} alt={alt} loading="lazy" /></div></section>;
}
