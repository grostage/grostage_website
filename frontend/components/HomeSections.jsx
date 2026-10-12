'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { gsap, SplitText, ScrollTrigger, useGSAP, ready } from '@/frontend/lib/gsap';
import Magnetic from './Magnetic';
import NeuralField from './NeuralField';

export function HomeHero({ works = [] }) {
  const root = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = s => root.current.querySelectorAll(s);
      const items = q('.hx-fade'), cards = q('.hx-float'), bobs = q('.hx-bob'), pars = q('.hx-par');
      gsap.set(items, { autoAlpha: 0, y: 30 });
      gsap.set(cards, { autoAlpha: 0 });
      gsap.set(bobs, { y: 140 });
      const split = SplitText.create(q('.hx-h1')[0], { type: 'lines', mask: 'lines', maskClass: 'gs-mask', autoSplit: true,
        onSplit(self) {
          const t = gsap.fromTo(self.lines, { yPercent: 115 }, { yPercent: 0, duration: 1.2, stagger: 0.14, ease: 'power4.out', paused: true });
          ready().then(() => t.play());
          return t;
        } });
      ready().then(() => {
        gsap.to(items, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.7 });
        gsap.to(cards, { autoAlpha: 1, duration: 1, stagger: 0.15, delay: 0.5 });
        gsap.to(bobs, { y: 0, duration: 1.6, stagger: 0.15, delay: 0.5, ease: 'power4.out',
          onComplete: () => bobs.forEach((el, i) => gsap.to(el, { y: i % 2 ? 16 : -16, duration: 3 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut' })) });
      });
      const stage = q('.hx-stage')[0];
      const moves = [...pars].map((el, i) => [gsap.quickTo(el, 'x', { duration: 1, ease: 'power3' }), gsap.quickTo(el, 'y', { duration: 1, ease: 'power3' }), 14 + i * 10]);
      const onMove = e => { const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5; moves.forEach(([x, y, d]) => { x(nx * d * 2); y(ny * d * 2); }); };
      root.current.addEventListener('pointermove', onMove);
      gsap.to(stage, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
      return () => { root.current?.removeEventListener('pointermove', onMove); split.revert(); };
    });
  }, { scope: root });
  const pose = [{ l: '4%', t: '6%', w: 250, r: -5 }, { l: '44%', t: '0%', w: 250, r: 4 }, { l: '20%', t: '34%', w: 330, r: -2 }, { l: '60%', t: '38%', w: 240, r: 6 }, { l: '38%', t: '70%', w: 250, r: -4 }];
  return <section className="hx hx-hero" ref={root}>
    <NeuralField />
    <div className="hx-hero-grid">
      <div className="hx-hero-copy">
        <p className="hx-tag hx-fade"><i /> AI-POWERED DIGITAL SYSTEMS</p>
        <h1 className="hx-h1">We build intelligent <span className="serif">digital systems</span> that grow businesses.</h1>
        <p className="hx-lead hx-fade">Strategy, design and technology under one roof, so your ideas, operations and data work together.</p>
        <div className="hx-actions hx-fade"><Magnetic><Link href="/contact" className="hx-btn">Start a project <span>↗</span></Link></Magnetic><Magnetic><Link href="/work" className="hx-btn ghost">See our work</Link></Magnetic></div>
      </div>
      <div className="hx-stage" aria-hidden="true">
        {works.slice(0, 5).map((w, i) => <div className="hx-float" key={w.slug} style={{ left: pose[i].l, top: pose[i].t, '--w': pose[i].w + 'px', '--r': pose[i].r + 'deg', zIndex: i === 2 ? 3 : 1 }}>
          <div className="hx-par"><div className="hx-bob"><img src={w.image} alt="" /><span>{w.title}</span></div></div></div>)}
      </div>
    </div>
    <div className="hx-hero-foot hx-fade"><p>STRATEGY · DESIGN · TECHNOLOGY · GROWTH</p><a href="#hx-about" className="hx-scroll">SCROLL ↓</a></div>
  </section>;
}

export function ServiceStack({ services }) {
  const root = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const items = gsap.utils.toArray('.hx-s,.hx-galaxy', root.current);
      gsap.set(items, { autoAlpha: 0, y: 60 });
      ScrollTrigger.batch(items, { start: 'top 92%', once: true, onEnter: b => gsap.to(b, { autoAlpha: 1, y: 0, stagger: 0.12, duration: 1, ease: 'power3.out' }) });
    });
  }, { scope: root });
  const spot = e => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mx', e.clientX - r.left + 'px'); e.currentTarget.style.setProperty('--my', e.clientY - r.top + 'px'); };
  return <section className="hx hx-stack" id="services" ref={root}>
    <div className="hx-svc-head">
      <div><p className="hx-tag"><i /> OUR SERVICES</p><h2>Everything your business needs <span className="serif">to grow smarter.</span></h2></div>
      <p className="hx-svc-intro">From the first idea to measurable growth, we design, build and run the digital pieces of your business, all with one team.</p>
    </div>
    <div className="hx-sgrid">
      {services.map((s, i) => <Link href={'/services#' + s.slug} className="hx-s" key={s.slug} onPointerMove={spot} data-cursor="Open">
        <div className="hx-s-top"><span className="hx-s-ic">{s.icon}</span><span className="hx-s-n">0{i + 1}</span></div>
        <div className="hx-s-body"><h3>{s.title}</h3><p>{s.description}</p>
          <ul>{s.items.map(it => <li key={it}>{it}</li>)}</ul>
          <span className="hx-s-go">Explore <b>↗</b></span></div>
      </Link>)}
    </div>
    <div className="hx-galaxy"><span className="hx-aurora a" aria-hidden="true" /><span className="hx-aurora b" aria-hidden="true" /><div className="hx-orbits" aria-hidden="true"><i /><i /><i /><b className="hx-planet" /></div><div className="hx-shoot" aria-hidden="true"><i style={{ "--t": "12%", "--l": "8%", "--dl": "0s" }} /><i style={{ "--t": "30%", "--l": "40%", "--dl": "2.4s" }} /><i style={{ "--t": "8%", "--l": "62%", "--dl": "4.6s" }} /></div><div><p className="hx-tag"><i /> NOT SURE WHERE TO START?</p><h3>Tell us where your business is going. <span className="serif">We’ll map the next stage.</span></h3></div><Magnetic><Link href="/contact" className="hx-btn light">Talk to us <span>↗</span></Link></Magnetic></div>
  </section>;
}

export function WorkScroll({ works }) {
  const root = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width:768px) and (prefers-reduced-motion: no-preference)', () => {
      const track = root.current.querySelector('.hx-track'), bar = root.current.querySelector('.hx-bar i');
      const dist = () => track.scrollWidth - innerWidth;
      const tween = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true,
        onUpdate: s => { bar.style.transform = `scaleX(${s.progress})`; } } });
      gsap.utils.toArray('.hx-work-card img', root.current).forEach(img => {
        gsap.fromTo(img, { xPercent: -8 }, { xPercent: 8, ease: 'none', scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
      });
    });
  }, { scope: root });
  return <section className="hx hx-work" ref={root}>
    <div className="hx-track">
      <div className="hx-work-intro"><p className="hx-tag"><i /> SELECTED WORK</p><h2>Real businesses. <span className="serif">Thoughtful solutions.</span></h2><Link href="/work" className="hx-link">View all work <span>↗</span></Link></div>
      {works.map((w, i) => <Link href={'/work/' + w.slug} className="hx-work-card" key={w.slug} data-cursor="View"><img src={w.image} alt={w.title} loading="lazy" /><div><small>0{i + 1}</small><h3>{w.title}</h3></div></Link>)}
    </div>
    <div className="hx-bar" aria-hidden="true"><i /></div>
  </section>;
}

const steps = [['01', 'Discover', 'We learn your business, your users and where technology can make the biggest difference.'], ['02', 'Design', 'Clear structure, strong visuals and interactions that feel effortless to use.'], ['03', 'Build', 'Fast, secure, scalable products built with modern engineering and AI where it adds value.'], ['04', 'Grow', 'We measure, improve and support you as the business and its needs evolve.']];
export function Process() {
  const root = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Rows stay readable by default; the rail only dims what has not been reached yet.
      const section = root.current, list = section.querySelector('.process-rows');
      const rows = gsap.utils.toArray('.hx-row', section);
      section.classList.add('rail-ready');
      gsap.fromTo(section.querySelector('.process-rail i'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 60%', end: 'bottom 60%', scrub: .6 } });
      const triggers = rows.map(row => ScrollTrigger.create({ trigger: row, start: 'top 60%', end: 'bottom 60%', onToggle: self => row.classList.toggle('is-current', self.isActive), onEnter: () => row.classList.add('is-lit'), onLeaveBack: () => row.classList.remove('is-lit') }));
      return () => { section.classList.remove('rail-ready'); triggers.forEach(t => t.kill()); rows.forEach(row => row.classList.remove('is-lit', 'is-current')); };
    });
    return () => mm.revert();
  }, { scope: root });
  return <section className="hx hx-process" ref={root}>
    <div className="hx-head"><p className="hx-tag"><i /> HOW WE WORK</p><h2>From first idea <span className="serif">to continuous growth.</span></h2></div>
    <div className="process-rows"><span className="process-rail" aria-hidden="true"><i /></span>
      {steps.map(([n, t, d]) => <div className="hx-row" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}
    </div>
  </section>;
}
