'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { gsap, useGSAP } from '@/frontend/lib/gsap';

export default function CinematicReel({ works }) {
  const root = useRef(null), position = useRef({ value: 0 }), trigger = useRef(null), tween = useRef(null);
  const [current, setCurrent] = useState(0);
  const swipe = useRef(null), moved = useRef(false);
  const total = works.length;
  const layout = () => {
    if (!root.current) return;
    const p = position.current.value;
    root.current.querySelectorAll('.reel-frame').forEach((frame, i) => {
      const offset = i - p, distance = Math.abs(offset);
      frame.classList.toggle('is-current', distance < .6);
      frame.style.setProperty('--offset', offset.toFixed(4));
      frame.style.setProperty('--dist', Math.min(1, distance).toFixed(4));
      frame.style.zIndex = Math.round(100 - distance * 10);
      frame.style.opacity = Math.max(0, 1 - Math.max(0, distance - 1) * .35);
      frame.style.pointerEvents = distance > 2.5 ? 'none' : 'auto';
      frame.tabIndex = distance < .5 ? 0 : -1;
    });
    setCurrent(Math.min(total - 1, Math.max(0, Math.round(p))));
  };
  const { contextSafe } = useGSAP(() => {
    if (!total) return;
    layout();
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.to('.reel-backdrop i', { x: 28, y: -18, scale: 1.12, duration: 9, stagger: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', toggleActions: 'play pause resume pause' } });
      gsap.to('.reel-light', { xPercent: 32, yPercent: -18, duration: 14, repeat: -1, yoyo: true, ease: 'sine.inOut', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', toggleActions: 'play pause resume pause' } });
    });
    mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      const animation = gsap.to(position.current, { value: total - 1, ease: 'none', onUpdate: layout,
        scrollTrigger: { trigger: root.current, start: 'top top', end: () => '+=' + innerHeight * Math.max(1, total - 1) * .55, pin: true, scrub: .85, invalidateOnRefresh: true } });
      trigger.current = animation.scrollTrigger;
      return () => { trigger.current = null; };
    });
    return () => { mm.revert(); tween.current?.kill(); };
  }, { scope: root });
  const go = dir => goTo(Math.round(position.current.value) + dir);
  const goTo = contextSafe(index => {
    const target = Math.max(0, Math.min(total - 1, index));
    if (trigger.current && total > 1) {
      const t = trigger.current, y = t.start + target / (total - 1) * (t.end - t.start);
      window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.15 }) : window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      tween.current?.kill();
      tween.current = gsap.to(position.current, { value: target, duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : .8, ease: 'power3.inOut', onUpdate: layout });
    }
  });
  if (!total) return null;
  return <section ref={root} data-nav-theme="dark" className="reel-section dimensional-reel" aria-label="Selected work film reel" tabIndex={0}
    onKeyDown={e => { if (['ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); go(e.key === 'ArrowRight' ? 1 : -1); } }}>
    <div className="reel-backdrop" aria-hidden="true"><span className="reel-light" /><i /><i /><i /></div>
    <div className="reel-heading"><p className="eyebrow">IDEAS MADE REAL / SELECTED WORK</p><h2>Another <span className="serif">dimension.</span></h2></div>
    <div className="reel-stage"
      onPointerDown={e => { swipe.current = e.pointerType === 'mouse' ? null : e.clientX; }}
      onPointerUp={e => { if (swipe.current == null) return; const dx = e.clientX - swipe.current; swipe.current = null; if (Math.abs(dx) > 40) { moved.current = true; go(dx < 0 ? 1 : -1); } }}>
      {works.map((w, i) => <Link href={'/work/' + w.slug} key={w.slug} className="reel-frame" style={{ '--offset': i, zIndex: total - i }} aria-label={i === current ? 'View ' + w.title : 'Show ' + w.title} tabIndex={i === 0 ? 0 : -1} draggable={false}
        data-cursor={i === current ? 'View' : 'Select'}
        onClick={e => { if (moved.current) { moved.current = false; e.preventDefault(); return; } if (i !== current) { e.preventDefault(); goTo(i); } }}>
        <img src={w.image || '/projects/work-placeholder.svg'} alt={w.imageAlt || w.title} draggable={false} /><span><small>{String(i + 1).padStart(2, '0')}</small>{w.title}<b aria-hidden="true">↗</b></span></Link>)}</div>
    <div className="reel-controls"><button onClick={() => go(-1)} disabled={current === 0} aria-label="Previous project">←</button><p aria-live="polite"><span className="reel-count">{String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span><span className="reel-name">{works[current].title}</span><span className="reel-category">{works[current].category}</span></p><button onClick={() => go(1)} disabled={current === total - 1} aria-label="Next project">→</button></div>
    <span className="reel-instruction">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></span>
  </section>;
}
