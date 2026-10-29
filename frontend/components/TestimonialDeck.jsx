'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap, ScrollTrigger, useGSAP } from '@/frontend/lib/gsap';

// Testimonials as an interactive, auto-playing deck of cards.
const clientLogos = {
  'Samsung': '/clients/samsung.svg',
  'Chanakya': '/clients/chanakya.png',
  'Circuit India': '/clients/circuit%20india.png',
  'Floor Collections': '/clients/FLOOR_NEW_LOGO_24_page-0001-removebg-preview.webp',
  'Floor Collection': '/clients/FLOOR_NEW_LOGO_24_page-0001-removebg-preview.webp',
  'Bright Bee': '/clients/bright%20bee.webp',
  'WTD': '/clients/what%20the%20data.webp',
  'What The Data': '/clients/what%20the%20data.webp',
  'PK Doors': '/clients/pkdoorbg.webp',
  'PK Door': '/clients/pkdoorbg.webp',
  'Wetex': '/clients/WETEX%20LOGO%20(1).webp',
  'Woodlands': '/clients/wooodlands.webp',
  'Lead Networking': '/clients/leads%20logo.webp',
  'Leads': '/clients/leads%20logo.webp',
};
const skins = { light: ['td-teal', 'td-ink', 'td-sage'], dark: ['td-teal', 'td-paper', 'td-sage'] };
const slot = pos => ({ x: 0, y: pos * -22, scale: 1 - pos * .06, rotation: pos === 0 ? 0 : pos % 2 ? -3.5 : 3, opacity: pos > 2 ? 0 : 1 });
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function TestimonialDeck({ items, tone = 'light', title = 'In their words', intro = 'What working together feels like, from the people we build with.', showLink = true }) {
  const [order, setOrder] = useState(() => items.map((_, i) => i));
  const root = useRef(null), cards = useRef([]), dealt = useRef(false), busy = useRef(false);
  const userInteractedUntil = useRef(0);
  const drag = useRef(null);
  const front = order[0];

  // Place cards in slots with animation whenever order changes
  useLayoutEffect(() => {
    order.forEach((card, pos) => {
      const el = cards.current[card];
      if (!el) return;
      el.style.zIndex = String(items.length - pos);
      gsap.to(el, { ...slot(pos), duration: reduced() ? 0 : 0.75, ease: 'expo.out', overwrite: 'auto' });
    });
  }, [order, items.length]);

  useGSAP(() => {
    const els = cards.current.filter(Boolean);
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(root.current.querySelectorAll('.td-copy > *, .td-ctrl > *'), {
        autoAlpha: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 85%', once: true }
      });

      const deal = () => {
        if (dealt.current) return;
        dealt.current = true;
        [...order].reverse().forEach((card, k) => {
          const pos = order.length - 1 - k;
          if (cards.current[card]) {
            gsap.to(cards.current[card], { ...slot(pos), duration: 0.9, delay: k * 0.1, ease: 'back.out(1.4)' });
          }
        });
      };

      if (!dealt.current) {
        gsap.set(els, { y: 160, rotation: i => (i - 1) * 10, opacity: 0, scale: 0.9 });
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top 85%',
          once: true,
          onEnter: deal,
        });
        if (root.current && root.current.getBoundingClientRect().top < window.innerHeight * 0.85) {
          deal();
        }
      }
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      order.forEach((card, pos) => {
        if (cards.current[card]) gsap.set(cards.current[card], slot(pos));
      });
      dealt.current = true;
    });

    return () => mm.revert();
  }, { scope: root });

  const handleUserInteract = () => {
    userInteractedUntil.current = Date.now() + 6000;
  };

  // Throw front card toward dir (-1 left, 1 right), then send to back
  const toss = (dir = -1) => {
    if (busy.current) return;
    const el = cards.current[front];
    if (!el) {
      setOrder(o => [...o.slice(1), o[0]]);
      return;
    }
    busy.current = true;
    const done = () => {
      busy.current = false;
      setOrder(o => [...o.slice(1), o[0]]);
    };
    if (reduced()) {
      done();
      return;
    }
    const safety = setTimeout(done, 900);
    gsap.to(el, {
      x: dir * (el.offsetWidth * 1.15),
      y: -40,
      rotation: dir * 18,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        clearTimeout(safety);
        done();
      }
    });
  };

  const back = () => {
    if (busy.current) return;
    const last = order.at(-1), el = cards.current[last];
    if (!reduced() && el) gsap.set(el, { x: -el.offsetWidth * 1.15, y: -40, rotation: -18, opacity: 0 });
    setOrder(o => [o.at(-1), ...o.slice(0, -1)]);
  };

  const show = target => {
    if (target !== front && !busy.current) {
      setOrder(o => [target, ...o.filter(n => n !== target)]);
    }
  };

  // Drag or flick the front card
  const down = e => {
    if (busy.current || e.button > 0) return;
    drag.current = { x: e.clientX, id: e.pointerId, moved: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
    handleUserInteract();
  };
  const move = e => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x; d.moved = dx;
    gsap.to(e.currentTarget, { x: dx, rotation: dx / 18, duration: 0.3, ease: 'power3.out', overwrite: 'auto' });
  };
  const up = e => {
    const d = drag.current; drag.current = null;
    if (!d) return;
    if (Math.abs(d.moved) > 90) toss(Math.sign(d.moved));
    else gsap.to(e.currentTarget, { ...slot(0), duration: 0.6, ease: 'elastic.out(1, 0.6)' });
    handleUserInteract();
  };

  // Gentle 3D tilt toward pointer
  const tilt = e => {
    if (drag.current || busy.current || e.pointerType !== 'mouse' || reduced()) return;
    const r = e.currentTarget.getBoundingClientRect();
    gsap.to(e.currentTarget, { rotationY: ((e.clientX - r.left) / r.width - 0.5) * 10, rotationX: ((e.clientY - r.top) / r.height - 0.5) * -8, duration: 0.6, ease: 'power3.out', transformPerspective: 1200 });
  };
  const untilt = e => gsap.to(e.currentTarget, { rotationX: 0, rotationY: 0, duration: 0.8, ease: 'power3.out' });

  // Autoplay ticker: advances cards every 3.8 seconds when visible
  useEffect(() => {
    if (reduced()) return;
    const timer = setInterval(() => {
      if (document.hidden) return;
      if (Date.now() < userInteractedUntil.current) return;
      if (drag.current || busy.current) return;
      if (root.current) {
        const rect = root.current.getBoundingClientRect();
        if (rect.bottom < 100 || rect.top > window.innerHeight - 100) return;
      }
      toss(-1);
    }, 3800);

    return () => clearInterval(timer);
  }, [front]); // eslint-disable-line react-hooks/exhaustive-deps

  const q = items[front] || items[0];
  return <section className={`td td-${tone}`} ref={root} data-nav-theme={tone} aria-labelledby="td-title">
    <div className="td-copy">
      <h2 id="td-title">{title}</h2>
      <p>{intro}</p>
    </div>
    <div className="td-ctrl">
      <div className="td-controls">
        <button type="button" className="td-arrow" onClick={() => { handleUserInteract(); back(); }} aria-label="Previous quote"><span aria-hidden="true">←</span></button>
        <button type="button" className="td-arrow" onClick={() => { handleUserInteract(); toss(-1); }} aria-label="Next quote"><span aria-hidden="true">→</span></button>
        {showLink && <Link href="/client-stories" className="td-more">Client stories <span aria-hidden="true">↗</span></Link>}
      </div>
      <div className="td-names" role="group" aria-label="Choose a quote">
        {items.map((t, n) => <button key={n} type="button" aria-pressed={n === front} onClick={() => { handleUserInteract(); show(n); }}>{t.name}</button>)}
      </div>
    </div>
    <div className="td-deck">
      {items.map((t, n) => <figure key={n} ref={el => { cards.current[n] = el; }} className={`td-card ${skins[tone][n % 3]}${n === front ? ' is-front' : ''}`} aria-hidden={n !== front} inert={n !== front ? true : undefined}
        onPointerDown={n === front ? down : undefined} onPointerMove={n === front ? e => { move(e); tilt(e); } : undefined} onPointerUp={n === front ? up : undefined} onPointerCancel={n === front ? up : undefined} onPointerLeave={n === front ? untilt : undefined}>
        <blockquote>“{t.quote}”</blockquote>
        <figcaption>
          {t.logo || clientLogos[t.name] || clientLogos[t.company] ? (
            <span className="td-avatar td-avatar-has-logo" aria-hidden="true">
              <img src={t.logo || clientLogos[t.name] || clientLogos[t.company]} alt="" className="td-avatar-img" />
            </span>
          ) : (
            <span className="td-avatar" aria-hidden="true">{t.initials || t.name.split(' ').map(w => w[0]).join('')}</span>
          )}
          <span><b>{t.name}</b>{t.role}</span>
        </figcaption>
      </figure>)}
    </div>
    <p className="sr-only" aria-live="polite">{`“${q.quote}” ${q.name}, ${q.role}`}</p>
  </section>;
}
