'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap, useGSAP } from '@/frontend/lib/gsap';
import { ServiceIcon, ServiceArt } from './ServiceIcon';

// Real Grostage work that shows each capability in practice.
const showcase = {
  'digital-products': { image: '/projects/profile-11-0.jpeg', work: 'FruitUp', href: '/work/fruitup' },
  'business-technology': { image: '/projects/profile-11-1.jpeg', work: 'Custom ERP', href: '/work/custom-erp' },
  // No AI case study yet: show studio artwork and invite the conversation instead.
  'ai-data': { image: '/projects/profile-8-0.jpeg', tag: 'Talk to us about AI', href: '/contact?interest=AI%20%26%20Data', alt: 'Technology artwork from the Grostage company profile' },
  'digital-growth': { image: '/projects/profile-13-0.jpeg', work: 'Samsung Exclusive Store', href: '/work/samsung-exclusive-store', alt: 'Grostage artwork representing the Samsung Exclusive Store campaign work' },
};

export default function ServicesExplorer({ services }) {
  const root = useRef(null);
  const [active, setActive] = useState(services[0]?.slug);
  const [picked, setPicked] = useState([]);

  // Tabs follow the service being read.
  useEffect(() => {
    const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }), { rootMargin: '-45% 0px -50% 0px' });
    root.current.querySelectorAll('.svx-service').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Photos rise into place as they scroll in; the pointer tilts them on desktop.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray('.svx-photo', root.current).forEach(photo => {
        gsap.fromTo(photo.querySelector('img'), { scale: 1.18, yPercent: 6 }, { scale: 1.04, yPercent: -4, ease: 'none', scrollTrigger: { trigger: photo, start: 'top bottom', end: 'bottom top', scrub: .6 } });
        gsap.fromTo(photo, { clipPath: 'inset(18% 10% 18% 10% round 14px)' }, { clipPath: 'inset(0% 0% 0% 0% round 14px)', duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: photo, start: 'top 85%', once: true } });
      });
    });
    mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const photos = gsap.utils.toArray('.svx-photo', root.current);
      const offs = photos.map(photo => {
        const rx = gsap.quickTo(photo, 'rotationX', { duration: .6, ease: 'power3.out' });
        const ry = gsap.quickTo(photo, 'rotationY', { duration: .6, ease: 'power3.out' });
        const move = e => { const b = photo.getBoundingClientRect(); ry(((e.clientX - b.left) / b.width - .5) * 10); rx(-((e.clientY - b.top) / b.height - .5) * 8); photo.style.setProperty('--gx', (e.clientX - b.left) + 'px'); photo.style.setProperty('--gy', (e.clientY - b.top) + 'px'); };
        const leave = () => { rx(0); ry(0); };
        photo.addEventListener('pointermove', move); photo.addEventListener('pointerleave', leave);
        return () => { photo.removeEventListener('pointermove', move); photo.removeEventListener('pointerleave', leave); };
      });
      return () => offs.forEach(off => off());
    });
    return () => mm.revert();
  }, { scope: root });

  const toggle = (item, e) => {
    // Ripple from the exact point of the click.
    const b = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--rx', (e.clientX ? e.clientX - b.left : b.width / 2) + 'px');
    e.currentTarget.style.setProperty('--ry', (e.clientY ? e.clientY - b.top : b.height / 2) + 'px');
    e.currentTarget.classList.remove('is-rippling'); void e.currentTarget.offsetWidth; e.currentTarget.classList.add('is-rippling');
    setPicked(list => list.includes(item) ? list.filter(x => x !== item) : [...list, item]);
  };
  const jump = slug => {
    const el = document.getElementById(slug);
    if (!el) return;
    const y = el.getBoundingClientRect().top + scrollY - 140;
    window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.1 }) : scrollTo({ top: y, behavior: 'smooth' });
  };
  const contactHref = '/contact?interest=' + encodeURIComponent(picked.join(', '));

  return <section className="svx wrap" ref={root}>
    <nav className="svx-tabs" aria-label="Capabilities">{services.map((s, i) => <button key={s.slug} type="button" className={active === s.slug ? 'is-active' : ''} aria-current={active === s.slug ? 'true' : undefined} onClick={() => jump(s.slug)}>
      <ServiceIcon slug={s.slug} size={16} /><span>{s.title}</span></button>)}</nav>

    {services.map((s, i) => {
      const show = showcase[s.slug];
      return <article className="svx-service" id={s.slug} key={s.slug}>
        <div className="svx-copy">
          <div className="svx-index"><span>0{i + 1}</span><ServiceIcon slug={s.slug} size={30} /></div>
          <h2>{s.title}</h2>
          <p className="svx-lead">{s.description}</p>
          <p>{s.detail}</p>
          <ServiceArt slug={s.slug} />
        </div>
        <div className="svx-side">
          {show && <Link href={show.href} className="svx-photo" data-cursor="View work">
            <img src={show.image} alt={show.alt || `${show.work}, a Grostage ${s.title.toLowerCase()} project`} loading="lazy" />
            <span className="svx-photo-glare" aria-hidden="true" />
            <span className="svx-photo-tag">{show.tag || `In practice · ${show.work}`}<b aria-hidden="true">↗</b></span>
          </Link>}
          <p className="svx-pick-label">Select what you need</p>
          <ul className="svx-items">{s.items.map(item => {
            const on = picked.includes(item);
            return <li key={item}><button type="button" className={on ? 'is-on' : ''} aria-pressed={on} onClick={e => toggle(item, e)}>
              <span className="svx-check" aria-hidden="true"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></span>
              {item}</button></li>;
          })}</ul>
        </div>
      </article>;
    })}

    <div className={'svx-tray' + (picked.length ? ' is-open' : '')} role="region" aria-label="Selected services" aria-hidden={!picked.length} inert={!picked.length ? true : undefined}>
      <span className="svx-tray-count">{picked.length}</span>
      <p><b>{picked.length === 1 ? '1 service selected' : `${picked.length} services selected`}</b><span>{picked.slice(-2).join(' · ')}{picked.length > 2 ? ' …' : ''}</span></p>
      <button type="button" className="svx-tray-clear" onClick={() => setPicked([])}>Clear</button>
      <Link href={contactHref} className="svx-tray-go">Start a conversation <span aria-hidden="true">↗</span></Link>
    </div>
  </section>;
}
