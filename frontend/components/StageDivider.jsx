'use client';
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/frontend/lib/gsap';

// Stepped block wipe that straddles the seam between two sections.
// The zone spans the empty space after the previous section's last content and
// before the next section's first content, so nothing is ever covered and no
// height is added. Inside it, the previous colour hangs down into the next
// section, then wide blocks of the next colour (led by a brand-colour band)
// climb through the zone, each at its own pace, joining the two sections.
const COLS = 5;
// Start offsets per column (0 = first to move); gives the staircase silhouette.
const LAG = [.18, 0, .32, .5, .66];
const CONTENT = 'h1,h2,h3,h4,p,a,button,img,video,figure,blockquote,li,dt,dd,input,textarea,label';

// Distance between a section edge and its nearest real content.
function emptySpace(node, side) {
  if (!node) return 0;
  const section = node.classList.contains('pin-spacer') ? node.firstElementChild : node;
  if (!section) return 0;
  const box = section.getBoundingClientRect();
  if (!box.height) return 0;
  let edge = side === 'bottom' ? box.top : box.bottom;
  for (const el of section.querySelectorAll(CONTENT)) {
    const hidden = el.closest('[aria-hidden="true"]');
    if (hidden && !hidden.classList.contains('rx-ticker')) continue; // decorative layers
    if (el.closest('[inert]')) continue; // collapsed panels
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height || (r.height > box.height * .85 && r.width > box.width * .9)) continue; // full-bleed backgrounds
    edge = side === 'bottom' ? Math.max(edge, r.bottom) : Math.min(edge, r.top);
  }
  const gap = side === 'bottom' ? box.bottom - edge : edge - box.top;
  return Math.round(Math.max(0, Math.min(gap - 24, innerHeight * .45)));
}

export default function StageDivider({ from = '#060908', to = '#f0f3ef', accent = '#104850', flip = false }) {
  const root = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const el = root.current;
      const measure = () => {
        el.style.setProperty('--sd-up', emptySpace(el.previousElementSibling, 'bottom') + 'px');
        el.style.setProperty('--sd-down', emptySpace(el.nextElementSibling, 'top') + 'px');
      };
      measure();
      el.classList.add('is-armed');
      ScrollTrigger.addEventListener('refreshInit', measure);
      const cols = el.querySelectorAll('.sd-col');
      const tl = gsap.timeline({ scrollTrigger: { trigger: cols[0], start: 'top 92%', end: 'bottom 40%', scrub: .4, invalidateOnRefresh: true } });
      cols.forEach((col, i) => {
        const lag = LAG[flip ? COLS - 1 - i : i];
        const [accentBlock, block] = col.children;
        tl.fromTo(accentBlock, { yPercent: 100 }, { yPercent: 0, ease: 'none', duration: 1 }, lag * .8)
          .fromTo(block, { yPercent: 100 }, { yPercent: 0, ease: 'none', duration: 1 }, lag * .8 + .24);
      });
      return () => { ScrollTrigger.removeEventListener('refreshInit', measure); el.classList.remove('is-armed'); };
    });
    return () => mm.revert();
  }, { scope: root });
  return <div ref={root} className="stage-divider" style={{ '--sd-from': from, '--sd-to': to, '--sd-accent': accent }} aria-hidden="true">
    {Array.from({ length: COLS }, (_, i) => <span className="sd-col" key={i}><i className="sd-accent" /><i className="sd-block" /></span>)}
  </div>;
}
