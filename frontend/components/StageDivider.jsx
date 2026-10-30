'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/frontend/lib/gsap';

// A staircase of the next section's colour climbs over the outgoing one while a frame
// of the accent colour closes in around it, so the two read as one continuous surface.
export default function StageDivider({ from = '#060908', to = '#f0f3ef', accent = '#104850', flip = false, triggerRef, scrollStart, scrollEnd, scrollRefreshPriority = 0, onProgress, onTimelineProgress }) {
  const root = useRef(null);
  const cols = 6;

  useGSAP(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add({ phone: '(max-width: 900px)', motion: '(prefers-reduced-motion: no-preference)' }, ctx => {
      const { phone, motion } = ctx.conditions;
      const steps = [...el.querySelectorAll('.sd-col')].filter(c => getComputedStyle(c).display !== 'none');
      const frame = el.querySelector('.sd-frame');
      if (!motion) { gsap.set(el.querySelectorAll('.sd-block-wrap'), { y: 0, yPercent: 0 }); return; }
      const trigger = triggerRef?.current || el;
      const tl = gsap.timeline({
        onUpdate: function () { onTimelineProgress?.(this.progress()); },
        scrollTrigger: { trigger, start: scrollStart || (phone ? 'top bottom' : 'top bottom+=10%'), end: scrollEnd || (phone ? 'top 45%' : 'top 25%'), scrub: .35, refreshPriority: scrollRefreshPriority, invalidateOnRefresh: true,
        onUpdate: self => onProgress?.(self.progress),
        onRefresh: self => onProgress?.(self.progress),
      } });
      // The frame closes in first, then the stairs climb one after another.
      // Phones skip the frame: on a narrow screen it reads as a border around the page.
      if (!phone) tl.fromTo(frame, { '--sd-edge': '0px' }, { '--sd-edge': Math.round(Math.min(24, Math.max(14, innerWidth * .014))) + 'px', ease: 'none', duration: .45 }, 0);
      steps.forEach(col => {
        // The tallest step leads, so the staircase climbs toward its high side.
        const rank = steps.map(c => +c.style.getPropertyValue('--i')), i = +col.style.getPropertyValue('--i');
        const order = Math.max(...rank) - i;
        tl.fromTo(col.querySelector('.sd-block-wrap'), { y: 0, yPercent: 101 }, { y: 0, yPercent: 0, ease: 'power1.inOut', duration: .5 }, .12 + order * (.38 / steps.length));
      });
      onTimelineProgress?.(tl.progress());
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [flip, triggerRef, scrollStart, scrollEnd, scrollRefreshPriority, onProgress, onTimelineProgress] });

  return <div ref={root} className={`stage-divider${flip ? ' is-flipped' : ''}`} style={{ '--sd-from': from, '--sd-to': to, '--sd-accent': accent }} aria-hidden="true">
    <i className="sd-frame" />
    <div className="sd-cols">
      {Array.from({ length: cols }, (_, i) => <span className="sd-col" key={i} style={{ '--i': flip ? cols - 1 - i : i }}>
        <span className="sd-block-wrap"><i className="sd-accent" /><i className="sd-block" /></span>
      </span>)}
    </div>
  </div>;
}
