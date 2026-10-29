'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { gsap, ScrollTrigger, useGSAP, ready } from '@/frontend/lib/gsap';
import Magnetic from './Magnetic';

const categories = ['All work', 'Digital products', 'Business systems', 'Digital growth'];
export const groupOf = work => {
  const category = String(work.category || '').toLowerCase();
  if (/growth|marketing|campaign|social|seo|brand/.test(category)) return 'Digital growth';
  if (/system|erp|crm|automation|logistics|warehouse|operations/.test(category)) return 'Business systems';
  return 'Digital products';
};

// One flat field per folder. Neighbours always differ in lightness as well as hue.
const fields = [
  { bg: '#104850', fg: '#edf3ef', tab: '#edf3ef', tabFg: '#104850', theme: 'dark' },
  { bg: '#d5e4de', fg: '#0b3036', tab: '#0b3036', tabFg: '#edf3ef', theme: 'light' },
  { bg: '#0a1416', fg: '#edf3ef', tab: '#9fc9c4', tabFg: '#0a1416', theme: 'dark' },
  { bg: '#9fc9c4', fg: '#072e33', tab: '#104850', tabFg: '#edf3ef', theme: 'light' },
  { bg: '#1b6b77', fg: '#f3f7f4', tab: '#0a1416', tabFg: '#edf3ef', theme: 'dark' },
  { bg: '#edf3ef', fg: '#104850', tab: '#1b6b77', tabFg: '#ffffff', theme: 'light' },
];

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollToEl = (el, offset = 0) => {
  if (!el) return;
  const y = el.getBoundingClientRect().top + scrollY - offset;
  window.__lenis?.scrollTo ? window.__lenis.scrollTo(y, { duration: 1.2 }) : scrollTo({ top: y, behavior: reduced() ? 'auto' : 'smooth' });
};
// Case-study content is Markdown: drop its heading lines and markup for the summary.
const plain = text => String(text || '').split('\n').filter(line => !/^\s*#/.test(line)).join(' ').replace(/[*_>`]/g, '');
const trimWords = (text, n) => { const w = plain(text).split(/\s+/).filter(Boolean); return w.length > n ? w.slice(0, n).join(' ') + '…' : w.join(' '); };

/* ---------- Hero: cinematic landing matching the rest of the site ---------- */
export function WorkHero({ works = [], count }) {
  const root = useRef(null);
  const totalCount = count || works.length || 8;
  const dpCount = works.filter(w => groupOf(w) === 'Digital products').length || 4;
  const bsCount = works.filter(w => groupOf(w) === 'Business systems').length || 2;
  const dgCount = works.filter(w => groupOf(w) === 'Digital growth').length || 2;

  const tickerList = works.length ? works : [
    { title: 'Circuit India', category: 'Resort Booking Platform & AI Chatbot' },
    { title: 'Chanakya ERP', category: 'Ground-Up Custom ERP & Voice AI' },
    { title: 'FruitUp', category: 'Brand-Led Commerce Platform' },
    { title: 'Warehouse App', category: 'Mobile Logistics & Dispatch' },
    { title: 'Chanakya Properties', category: 'Property Discovery Portal' },
    { title: 'Custom ERP', category: 'Multi-Device Operations System' },
    { title: 'Soorya Solar', category: 'Brand Growth & Digital Presence' },
    { title: 'Samsung Store', category: 'Campaign-Led Social & Retail' },
  ];
  const marqueeItems = [...tickerList, ...tickerList, ...tickerList];

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = s => root.current.querySelectorAll(s);
      const intro = gsap.timeline({ paused: true })
        .fromTo(q('.rx-intro-label, .wk-hero-tags'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, 0)
        .fromTo(q('.rx-line > span'), { yPercent: 110 }, { yPercent: 0, duration: 1.15, stagger: 0.1, ease: 'power4.out' }, 0.1)
        .fromTo(q('.wk-foot-left > *, .wk-foot-right > *'), { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.08, ease: 'power3.out' }, 0.45)
        .fromTo(q('.rx-ticker'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9, ease: 'power2.out' }, 0.7);
      ready().then(() => intro.play());
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section className="page-intro rx-intro wk-hero-intro" ref={root} data-nav-theme="dark">
      <div className="rx-intro-grid" aria-hidden="true" />
      <div className="wrap">
        <div className="wk-intro-meta">
          <p className="rx-intro-label">
            <span className="status-dot" />
            <span>OUR WORK</span>
            <span className="wk-meta-sep">/</span>
            <span className="wk-meta-count">{totalCount} CASE STUDIES</span>
          </p>
          <div className="wk-hero-tags" aria-hidden="true">
            <span>STRATEGY</span>
            <span className="wk-dot" />
            <span>DESIGN</span>
            <span className="wk-dot" />
            <span>TECHNOLOGY</span>
            <span className="wk-dot" />
            <span>AI</span>
          </div>
        </div>

        <h1 className="rx-intro-title">
          <span className="rx-line"><span>Every project.</span></span>
          <span className="rx-line rx-accent"><span>is a stage.</span></span>
        </h1>

        <div className="rx-intro-foot wk-hero-foot">
          <div className="wk-foot-left">
            <p className="lead">
              {totalCount} businesses, each moved to its next stage: digital products, connected operations and growth work built around a real need.
            </p>
            <div className="wk-hero-actions">
              <Magnetic strength={0.2}>
                <a
                  className="rx-pill wk-hero-pill"
                  href="#files"
                  onClick={e => {
                    e.preventDefault();
                    scrollToEl(document.getElementById('files'), 90);
                  }}
                >
                  Open the files <span aria-hidden="true">↓</span>
                </a>
              </Magnetic>
              <div className="wk-cat-chips" aria-label="Work categories breakdown">
                <span className="wk-chip"><b>{dpCount}</b> Digital Products</span>
                <span className="wk-chip"><b>{bsCount}</b> Business Systems</span>
                <span className="wk-chip"><b>{dgCount}</b> Digital Growth</span>
              </div>
            </div>
          </div>

          <div className="wk-foot-right" aria-hidden="true">
            <div className="wk-stat-badge">
              <div className="wk-stat-icon">◇</div>
              <div className="wk-stat-text">
                <strong>100% Bespoke</strong>
                <span>Built from the ground up</span>
              </div>
            </div>
            <span className="rx-scroll"><i /></span>
          </div>
        </div>
      </div>

      <div className="rx-ticker" aria-hidden="true">
        <div>
          {marqueeItems.map((item, idx) => (
            <span key={idx}>
              <strong>{item.title}</strong>
              <small className="wk-ticker-cat">{item.category}</small>
              <i />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- The files: projects as a drawer of colour folders, one open at a time ---------- */
export function WorkFiles({ works }) {
  const [filter, setFilter] = useState('All work');
  const shown = works.filter(w => filter === 'All work' || groupOf(w) === filter);
  const [open, setOpen] = useState(shown[0]?.slug);
  const root = useRef(null), touched = useRef(false);
  const count = c => c === 'All work' ? works.length : works.filter(w => groupOf(w) === c).length;

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const head = root.current.querySelectorAll('.wk-files-head > *');
      gsap.from(head, { autoAlpha: 0, y: 24, duration: .8, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 80%', once: true } });
    });
    return () => mm.revert();
  }, { scope: root });

  // When a folder opens, its photograph lifts like a shutter and the text follows.
  useGSAP(() => {
    const folder = root.current.querySelector('.wk-folder.is-open');
    if (!folder || reduced()) return;
    const shot = folder.querySelector('.wk-shot'), img = shot.querySelector('img'), copy = folder.querySelectorAll('.wk-copy > *');
    const tl = gsap.timeline({ paused: true })
      .fromTo(shot, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'expo.inOut' }, .1)
      .fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.4, ease: 'expo.out' }, .1)
      .fromTo(copy, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .7, stagger: .06, ease: 'power3.out' }, .35);
    if (touched.current) tl.play();
    else ScrollTrigger.create({ trigger: folder, start: 'top 80%', once: true, onEnter: () => tl.play() });
    const settle = setTimeout(() => ScrollTrigger.refresh(), 650);
    return () => { clearTimeout(settle); tl.progress(1).kill(); };
  }, { scope: root, dependencies: [open, filter], revertOnUpdate: true });

  // A gentle parallax inside the open photograph while the pointer is over it.
  const look = e => {
    if (reduced() || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect(), img = e.currentTarget.querySelector('img');
    gsap.to(img, { x: ((e.clientX - r.left) / r.width - .5) * -22, y: ((e.clientY - r.top) / r.height - .5) * -16, scale: 1.06, duration: .9, ease: 'power3.out' });
  };
  const rest = e => gsap.to(e.currentTarget.querySelector('img'), { x: 0, y: 0, scale: 1, duration: 1, ease: 'power3.out' });

  const choose = c => {
    if (c === filter) return;
    touched.current = true;
    setFilter(c);
    setOpen(works.find(w => c === 'All work' || groupOf(w) === c)?.slug);
  };
  const toggle = (slug, el) => {
    touched.current = true;
    const next = open === slug ? null : slug;
    setOpen(next);
    // Bring the opened folder's tab under the nav once the drawer has moved.
    if (next) setTimeout(() => { const top = el.getBoundingClientRect().top; if (top < 80 || top > innerHeight * .45) scrollToEl(el, 96); }, 380);
  };

  return <section className="wk-files" id="files" ref={root} data-nav-theme="light">
    <div className="wk-files-head">
      <h2>Selected work</h2>
      <div className="wk-filters" role="group" aria-label="Filter projects">
        {categories.map(c => <button key={c} type="button" aria-pressed={filter === c} onClick={() => choose(c)}>{c}<sup aria-hidden="true">{count(c)}</sup><span className="sr-only"> ({count(c)} projects)</span></button>)}
      </div>
      <p className="sr-only" aria-live="polite">{shown.length} projects shown</p>
    </div>
    <div className="wk-stack">
      {shown.map((w, i) => {
        const f = fields[i % fields.length], isOpen = open === w.slug;
        return <article className={`wk-folder${isOpen ? ' is-open' : ''}`} key={w.slug} data-nav-theme={f.theme} style={{ '--bg': f.bg, '--fg': f.fg, '--tab': f.tab, '--tab-fg': f.tabFg, '--i': i }}>
          <h3 className="wk-strip-h">
            <button type="button" className="wk-strip" aria-expanded={isOpen} aria-controls={`wk-body-${w.slug}`} onClick={e => toggle(w.slug, e.currentTarget.closest('.wk-folder'))}>
              <span className="wk-tab"><span>{w.title}</span></span>
              <span className="wk-cat">{w.category}</span>
              <svg className="wk-plus" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M5 12h14M12 5v14" fill="none" stroke="currentColor" strokeWidth="1.75" /></svg>
            </button>
          </h3>
          <div className="wk-drawer" id={`wk-body-${w.slug}`} role="region" aria-label={w.title} inert={!isOpen}>
            <div className="wk-drawer-in">
              <div className="wk-body">
                <Link href={`/work/${w.slug}`} className="wk-shot" onPointerMove={look} onPointerLeave={rest} tabIndex={-1} aria-hidden="true">
                  <img src={w.image} alt="" width="1600" height="1000" loading={i ? 'lazy' : 'eager'} />
                </Link>
                <div className="wk-copy">
                  <p className="wk-excerpt">{w.excerpt}</p>
                  <p className="wk-text">{trimWords(w.content, 70)}</p>
                  {w.tags?.length > 0 && <p className="wk-tags">{w.tags.join(' · ')}</p>}
                  <Link href={`/work/${w.slug}`} className="wk-open">Open the case study <span aria-hidden="true">→</span></Link>
                </div>
              </div>
            </div>
          </div>
        </article>;
      })}
      {!shown.length && <p className="wk-empty">No projects in this category yet. <button type="button" onClick={() => choose('All work')}>Show all work</button></p>}
    </div>
  </section>;
}

/* ---------- The close: one row of tiles, cropped from a longer board ---------- */
export function WorkClose({ image }) {
  const root = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tiles = root.current.querySelectorAll('.wk-tile');
      gsap.from(tiles, { yPercent: 16, autoAlpha: 0, duration: 1, stagger: { each: .09, from: 'center' }, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 80%', once: true } });
      gsap.from(root.current.querySelectorAll('.wk-tile-main > *'), { y: 24, autoAlpha: 0, duration: .8, stagger: .08, delay: .3, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 80%', once: true } });
    });
    return () => mm.revert();
  }, { scope: root });
  return <section className="wk-close" ref={root} data-nav-theme="dark">
    <div className="wk-tile wk-tile-photo" aria-hidden="true"><img src={image} alt="" loading="lazy" width="800" height="800" /></div>
    <div className="wk-tile wk-tile-main">
      <h2>Your business is next.</h2>
      <p>Bring the problem, the idea or the half-built system. We will find its next stage together.</p>
      <Magnetic strength={.2}><Link href="/contact" className="wk-btn wk-btn-light">Start a project <span aria-hidden="true">↗</span></Link></Magnetic>
    </div>
    <div className="wk-tile wk-tile-flat" aria-hidden="true" />
  </section>;
}
