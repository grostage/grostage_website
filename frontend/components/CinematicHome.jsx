'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { gsap, ScrollTrigger, useGSAP, ready } from '@/frontend/lib/gsap';
import Magnetic from './Magnetic';
import HeroVideo from './HeroVideo';

export function StageHero() {
  const root = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      let alive = true;
      const intro = gsap.timeline({ paused: true })
        .from('.stage-title > span > span', { yPercent: 110, rotate: 3, stagger: .12, duration: 1.2, ease: 'power4.out' })
        .from('.stage-meta,.stage-bottom', { opacity: 0, y: 16, duration: .8, stagger: .1 }, .45);
      ready().then(() => { if (alive) intro.play(); });
      gsap.to('.stage-title', { yPercent: 25, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 1 } });
      return () => { alive = false; };
    });
    mm.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const el = root.current, art = el.querySelector('.stage-art');
      const x = gsap.quickTo(art, 'x', { duration: 1.2, ease: 'power3.out' });
      const y = gsap.quickTo(art, 'y', { duration: 1.2, ease: 'power3.out' });
      const move = e => { const b = el.getBoundingClientRect(); x((e.clientX / b.width - .5) * 40); y(((e.clientY - b.top) / b.height - .5) * 35); };
      const leave = () => { x(0); y(0); };
      el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave);
      return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
    });
    return () => mm.revert();
  }, { scope: root });
  return <section className="stage-hero" data-nav-theme="dark" ref={root}>
    <HeroVideo />
    <div className="stage-meta"><span><i /> INDEPENDENT MINDS. CONNECTED THINKING.</span><span>STRATEGY / DESIGN / TECHNOLOGY</span></div>
    <h1 className="stage-title"><span><span>Ideas beyond</span></span><span className="stage-title-last"><span>the ordinary<span className="stage-period">.</span></span></span></h1>
    <div className="stage-bottom"><p>We turn ambition into digital experiences.<br />Thoughtfully designed. Intelligently built.</p><Magnetic><Link className="stage-pill" href="/work" data-cursor="Explore">Step into our work <span aria-hidden="true">↗</span></Link></Magnetic><a className="stage-scroll" href="#hx-about">SCROLL TO DISCOVER <span aria-hidden="true">↓</span></a></div>
    <span className="stage-side" aria-hidden="true">GROSTAGE — YOUR NEXT CHAPTER</span>
  </section>;
}

export function ProjectTheatre({ works }) {
  const root = useRef(null), story = useRef(null);
  const [current, setCurrent] = useState(0);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const el = root.current;
      const atmosphere = el.querySelector('.theatre-atmosphere');
      gsap.to(atmosphere, { yPercent: 12, xPercent: -4, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.4 } });
      // Ambient motion only runs while the section is on screen.
      const ambient = [
        gsap.to(el.querySelector('.theatre-orb-a'), { x: 90, y: -55, scale: 1.12, duration: 14, repeat: -1, yoyo: true, ease: 'sine.inOut', paused: true }),
        gsap.to(el.querySelector('.theatre-orb-b'), { x: -70, y: 70, scale: .86, duration: 17, repeat: -1, yoyo: true, ease: 'sine.inOut', paused: true }),
      ];
      ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom top', onToggle: self => { ambient.forEach(t => self.isActive ? t.play() : t.pause()); el.classList.toggle('is-onscreen', self.isActive); } });
      return () => gsap.killTweensOf([atmosphere, el.querySelector('.theatre-orb-a'), el.querySelector('.theatre-orb-b')]);
    });
    mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      const section = root.current;
      section.classList.add('theatre-enhanced');
      const panels = gsap.utils.toArray('.theatre-project', root.current);
      const images = panels.map(panel => panel.querySelector('img'));
      const pointerX = gsap.quickTo(root.current.querySelector('.theatre-atmosphere'), 'x', { duration: 1.4, ease: 'power3.out' });
      const pointerY = gsap.quickTo(root.current.querySelector('.theatre-atmosphere'), 'y', { duration: 1.4, ease: 'power3.out' });
      const imageX = images.map((image, i) => gsap.quickTo(image, 'x', { duration: .9 + i * .12, ease: 'power3.out' }));
      const imageY = images.map((image, i) => gsap.quickTo(image, 'y', { duration: 1 + i * .1, ease: 'power3.out' }));
      const move = event => {
        const bounds = root.current.getBoundingClientRect();
        const x = event.clientX / bounds.width - .5, y = (event.clientY - bounds.top) / bounds.height - .5;
        pointerX(x * 18); pointerY(y * 14);
        imageX.forEach((to, i) => { to(x * (8 + i * 4)); imageY[i](y * (5 + i * 3)); });
      };
      const leave = () => { pointerX(0); pointerY(0); imageX.forEach((to, i) => { to(0); imageY[i](0); }); };
      section.addEventListener('pointermove', move, { passive: true }); section.addEventListener('pointerleave', leave);
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: () => '+=' + innerHeight * (panels.length - 1) * .8, pin: true, scrub: .8, invalidateOnRefresh: true } });
      story.current = tl.scrollTrigger;
      panels.forEach((panel, i) => {
        if (!i) return;
        tl.fromTo(panel, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'none' }, i - 1)
          .fromTo(panel.querySelector('img'), { scale: 1.2, yPercent: 12 }, { scale: 1, yPercent: 0, duration: 1, ease: 'none' }, i - 1);
      });
      const update = () => {
        const current = Math.min(panels.length - 1, Math.round(tl.progress() * (panels.length - 1)));
        panels.forEach((panel, i) => {
          panel.inert = i !== current;
          panel.classList.toggle('is-current', i === current);
        });
        setCurrent(current);
        root.current.querySelector('.theatre-progress').style.transform = `scaleX(${(current + 1) / panels.length})`;
      };
      tl.eventCallback('onUpdate', update); update();
      return () => { section.classList.remove('theatre-enhanced'); section.removeEventListener('pointermove', move); section.removeEventListener('pointerleave', leave); story.current = null; panels.forEach(panel => { panel.inert = false; panel.classList.remove('is-current'); }); };
    });
    return () => mm.revert();
  }, { scope: root });
  const go = direction => {
    const t = story.current;
    if (!t) return;
    const index = Math.max(0, Math.min(works.slice(0, 4).length - 1, current + direction));
    const top = t.start + index / (Math.min(works.length, 4) - 1) * (t.end - t.start);
    window.__lenis ? window.__lenis.scrollTo(top, { duration: .9 }) : window.scrollTo({ top, behavior: 'smooth' });
  };
  return <section ref={root} className="project-theatre" data-nav-theme="dark" aria-label="Selected work">
    <div className="theatre-atmosphere" aria-hidden="true"><span className="theatre-orb theatre-orb-a" /><span className="theatre-orb theatre-orb-b" /><span className="theatre-haze" /><span className="theatre-grain" /><span className="theatre-particles" /></div>
    <div className="theatre-heading"><p>SELECTED WORK / IDEAS MADE REAL</p><Link href="/work">All projects <span aria-hidden="true">↗</span></Link></div>
    <div className="theatre-panels">{works.slice(0, 4).map((w, i) => <article className="theatre-project" key={w.slug} style={{ '--project-index': i }}>
      <div className="theatre-copy"><span className="theatre-index">0{i + 1} / 04</span><h2>{w.title}</h2><p>{w.category}</p><Link href={`/work/${w.slug}`} className="theatre-link">Explore the project <span aria-hidden="true">↗</span></Link></div>
      <Link href={`/work/${w.slug}`} className="theatre-image" data-cursor="View" aria-label={`View ${w.title}`}><img src={w.image || '/projects/work-placeholder.svg'} alt={w.imageAlt || w.title} loading="lazy" /><span aria-hidden="true">↗</span></Link>
      <span className="theatre-ghost" aria-hidden="true">0{i + 1}</span>
    </article>)}</div>
    <div className="theatre-track" aria-hidden="true"><span className="theatre-progress" /></div>
    <div className="theatre-foot"><span>REAL BUSINESSES. THOUGHTFUL SOLUTIONS.</span><div className="theatre-controls"><button onClick={() => go(-1)} disabled={current === 0} aria-label="Previous featured project">←</button><span aria-live="polite">0{current + 1} / 0{Math.min(works.length, 4)}</span><button onClick={() => go(1)} disabled={current === Math.min(works.length, 4) - 1} aria-label="Next featured project">→</button></div><a href="#capabilities">Continue to capabilities ↓</a></div>
  </section>;
}
