'use client';
import { useEffect, useRef, useState } from 'react';

export function VisionMission() {
  const [open, setOpen] = useState(0);
  const panels = [
    ['Vision', 'Built for lasting value.', 'To build Grostage into a globally recognized technology company, creating scalable SaaS products that solve real business problems and deliver lasting value across markets.'],
    ['Mission', 'Make business work better.', 'To simplify business operations through practical software, automation and subscription-based digital products that help businesses operate more efficiently, make better decisions and grow with confidence.'],
  ];
  return <section className="rx rx-dark rx-vm" data-nav-theme="dark">
    <div className="rx-vm-grid">{panels.map(([k, h, p], i) => <button type="button" key={k} className={'rx-vm-panel' + (open === i ? ' is-open' : '')} aria-expanded={open === i}
      onMouseEnter={() => matchMedia('(hover: hover)').matches && setOpen(i)} onFocus={() => setOpen(i)} onClick={() => setOpen(i)}>
      <span className="rx-vm-num">0{i + 1}</span><span className="rx-vm-key">{k}</span>
      <span className="rx-vm-title">{h}</span><span className="rx-vm-copy">{p}</span>
    </button>)}</div>
  </section>;
}

export function ProcessStepper({ steps }) {
  const [active, setActive] = useState(0), [auto, setAuto] = useState(true);
  const root = useRef(null);
  useEffect(() => {
    if (!auto || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(root.current);
    const t = setInterval(() => { if (visible && !document.hidden) setActive(a => (a + 1) % steps.length); }, 4200);
    return () => { clearInterval(t); io.disconnect(); };
  }, [auto, steps.length]);
  const pick = i => { setAuto(false); setActive(i); };
  return <section className="rx rx-light rx-process" ref={root}>
    <div className="rx-head" data-rx><h2>From business problem<br /><span className="rx-accent">to business outcome.</span></h2></div>
    <div className="rx-steps" role="tablist" aria-label="How we work">{steps.map(([t], i) => <button key={t} role="tab" type="button" aria-selected={active === i} className={active === i ? 'is-active' : ''}
      onClick={() => pick(i)} onMouseEnter={() => matchMedia('(hover: hover)').matches && pick(i)}>
      <span>0{i + 1}</span>{t}<i className="rx-step-bar" style={{ animationPlayState: auto ? 'running' : 'paused' }} />
    </button>)}</div>
    <div className="rx-step-stage" role="tabpanel" aria-live="polite">
      <span className="rx-step-big" key={'n' + active} aria-hidden="true">0{active + 1}</span>
      <div key={'c' + active} className="rx-step-copy"><h3>{steps[active][0]}</h3><p>{steps[active][1]}</p></div>
    </div>
  </section>;
}

export function Team({ people }) {
  const tilt = e => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const c = e.currentTarget, b = c.getBoundingClientRect();
    c.style.setProperty('--tx', ((e.clientX - b.left) / b.width - .5).toFixed(3));
    c.style.setProperty('--ty', ((e.clientY - b.top) / b.height - .5).toFixed(3));
  };
  const reset = e => { e.currentTarget.style.setProperty('--tx', 0); e.currentTarget.style.setProperty('--ty', 0); };
  return <section className="rx rx-dark rx-team" data-nav-theme="dark">
    <div className="rx-head" data-rx><h2>Shared purpose.<br /><span className="rx-accent">Different perspectives.</span></h2></div>
    <div className="rx-team-grid">{people.map(([name, role, desc], i) => <article key={name} className="rx-person" tabIndex={0} onPointerMove={tilt} onPointerLeave={reset} data-rx style={{ '--d': i }}>
      <span className="rx-mono" aria-hidden="true">{name.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
      <div className="rx-person-meta"><h3>{name}</h3><p className="rx-role">{role}</p><p className="rx-desc">{desc}</p></div>
    </article>)}</div>
  </section>;
}
