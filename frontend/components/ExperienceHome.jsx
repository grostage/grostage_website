'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { gsap, useGSAP, ready } from '@/frontend/lib/gsap';
import { ServiceArt, ServiceIcon } from './ServiceIcon';

export function ExperienceHero({ works = [] }) {
  const root = useRef(null);
  const [selected, setSelected] = useState(0);
  const featured = works.slice(0, 3);
  const project = featured[selected];
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      let mounted = true;
      const title = gsap.from('.hero-copy > *,.hero-project', { y: 24, opacity: 0, stagger: .09, duration: .9, ease: 'power3.out', paused: true });
      ready().then(() => { if (mounted) title.play(); });
      gsap.to('.hero-halo', { xPercent: 15, yPercent: -8, scale: 1.12, duration: 12, repeat: -1, yoyo: true, ease: 'sine.inOut', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', toggleActions: 'play pause resume pause' } });
      return () => { mounted = false; };
    });
    return () => mm.revert();
  }, { scope: root });
  return <section ref={root} className="experience-hero">
    <div className="hero-halo" aria-hidden="true" />
    <div className="hero-main wrap"><div className="hero-copy">
      <p className="hero-kicker"><i /> YOUR DIGITAL GROWTH PARTNER</p>
      <h1>Good ideas deserve<br /><span>exceptional execution.</span></h1>
      <p className="hero-description">We bring design, technology and AI together to build digital experiences that move your business forward.</p>
      <div className="hero-actions"><Link href="/contact" className="hero-primary">Let’s build something <span>↗</span></Link><Link href="/work" className="hero-secondary">Explore our work <span>↗</span></Link></div>
      <div className="hero-disciplines"><span>STRATEGY</span><i /><span>DESIGN</span><i /><span>TECHNOLOGY</span><i /><span>GROWTH</span></div>
    </div>{project && <div className="hero-project">
      <div className="hero-project-top"><span><i /> SELECTED COLLABORATIONS</span><span>0{selected + 1} / 0{featured.length}</span></div>
      <Link href={`/work/${project.slug}`} className="hero-project-image" aria-label={`Explore ${project.title}`} data-cursor="View">{featured.map((w, i) => <img key={w.slug} src={w.image} alt={i === selected ? w.title : ''} aria-hidden={i !== selected} className={i === selected ? 'active' : ''} />)}<span className="hero-image-arrow" aria-hidden="true">↗</span></Link>
      <div className="hero-project-info"><div aria-live="polite"><h2>{project.title}</h2><p>{project.category}</p></div><div className="hero-project-dots" aria-label="Featured project">{featured.map((w, i) => <button key={w.slug} aria-label={`Show ${w.title}`} aria-pressed={i === selected} onClick={() => setSelected(i)} />)}</div></div>
    </div>}</div>
    <div className="hero-foot wrap"><p>Practical thinking. Thoughtful design. Lasting impact.</p><a href="#hx-about">Discover Grostage <span>↓</span></a></div>
  </section>;
}

export function ExperienceServices({ services }) {
  const [active, setActive] = useState(0);
  // The stage keeps showing the last opened capability when every row is collapsed.
  const [shown, setShown] = useState(0);
  const open = i => { setActive(i); if (i > -1) setShown(i); };
  const preview = i => { if (matchMedia('(hover: hover) and (pointer: fine)').matches && i !== active) open(i); };
  const s = services[shown];
  return <section className="experience-services">
    <div className="experience-section-heading"><p className="studio-label">01 / OUR CAPABILITIES</p><h2>Different disciplines.<br /><span className="serif">One shared ambition.</span></h2><p>From the first question to the next big opportunity. The right expertise, working together.</p>
      <Link href={`/services#${s.slug}`} className="capability-stage" aria-label={`Explore ${s.title}`} data-cursor="Explore">
        <div className="capability-stage-top"><span>0{shown + 1}</span><span>{s.title}</span></div>
        <ServiceArt key={s.slug} slug={s.slug} />
        <ul key={s.slug + '-items'}>{s.items.map((item, n) => <li key={item} style={{ '--n': n }}>{item}</li>)}</ul>
        <span className="capability-stage-meter" aria-hidden="true">{services.map((x, i) => <i key={x.slug} className={i === shown ? 'on' : ''} />)}</span>
      </Link>
    </div>
    <div className="capability-list">{services.map((s, i) => <article key={s.slug} className={`capability-row${active === i ? ' is-active' : ''}`} onPointerEnter={() => preview(i)}>
      <button className="capability-toggle" aria-expanded={active === i} aria-controls={`capability-${s.slug}`} onClick={() => open(active === i ? -1 : i)}><small>0{i + 1}</small><span>{s.title}</span><b aria-hidden="true"><i /><i /></b></button>
      <div id={`capability-${s.slug}`} className="capability-panel" inert={active !== i ? true : undefined}><div><ServiceIcon slug={s.slug} size={30} className="capability-symbol" /><p>{s.detail}</p><div><ul>{s.items.map(item => <li key={item}>{item}</li>)}</ul><Link href={`/services#${s.slug}`}>Explore the capability <span>↗</span></Link></div></div></div>
    </article>)}</div>
  </section>;
}

export function ExperienceWork({ works }) {
  const root = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray('.editorial-project', root.current).forEach(card => {
        gsap.fromTo(card.querySelector('img'), { scale: 1.07 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1 } });
      });
    });
    return () => mm.revert();
  }, { scope: root });
  return <section className="experience-work" ref={root}>
    <div className="experience-work-heading"><p className="studio-label">02 / SELECTED WORK</p><h2>Real businesses.<br /><span className="serif">Thoughtful solutions.</span></h2><Link href="/work" className="experience-cta">View all work <span>↗</span></Link></div>
    <div className="editorial-projects">{works.slice(0, 4).map((w, i) => <Link className={`editorial-project editorial-project-${i}`} href={`/work/${w.slug}`} key={w.slug} data-cursor="View">
      <div className="editorial-project-image"><img src={w.image} alt={w.imageAlt || w.title} loading="lazy" /><span className="editorial-open" aria-hidden="true">↗</span><span className="editorial-number">0{i + 1} / GROSTAGE</span></div>
      <div className="editorial-project-caption"><h3>{w.title}</h3><p>{w.category}</p></div>
    </Link>)}</div>
  </section>;
}
