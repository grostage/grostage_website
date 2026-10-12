'use client';
import { useEffect, useRef, useState } from 'react';

export default function QuoteStage({ items }) {
  const [i, setI] = useState(0), [paused, setPaused] = useState(false);
  const root = useRef(null), visible = useRef(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; });
    io.observe(root.current);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (paused || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => { if (visible.current && !document.hidden) setI(n => (n + 1) % items.length); else setI(n => n); }, 6000);
    return () => clearTimeout(t);
  }, [i, paused, items.length]);
  const q = items[i];
  return <section ref={root} className="rx rx-dark rx-quotes" data-nav-theme="dark" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
    <p className="rx-kicker">What they say <em>· Preview testimonials, pending client approval</em></p>
    <figure className="rx-quote" key={i} aria-live="polite">
      <blockquote>{q.quote.split(' ').map((w, n) => <span key={n}><span style={{ '--w': n }}>{w}</span>{' '}</span>)}</blockquote>
      <figcaption><b>{q.name}</b><span>{q.role} · Sample</span></figcaption>
    </figure>
    <div className="rx-quote-nav" role="tablist" aria-label="Choose a testimonial">{items.map((t, n) => <button key={n} type="button" role="tab" aria-selected={n === i} aria-label={`Testimonial ${n + 1}: ${t.name}`} onClick={() => { setI(n); setPaused(true); }} className={n === i ? 'is-active' : ''}>
      <span>{t.initials}</span><i style={{ animationPlayState: paused ? 'paused' : 'running' }} />
    </button>)}</div>
  </section>;
}
