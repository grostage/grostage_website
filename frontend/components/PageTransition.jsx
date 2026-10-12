'use client';
import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { gsap, ScrollTrigger } from '@/frontend/lib/gsap';

const HIDDEN = 'inset(100% 0% 0% 0%)';
export default function PageTransition() {
  const el = useRef(null);
  const path = usePathname();
  const router = useRouter();
  const busy = useRef(false);
  const first = useRef(true);
  const fallback = useRef(null);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onClick = e => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest('a');
      if (!a || a.target || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname || url.pathname.startsWith('/admin') || location.pathname.startsWith('/admin')) return;
      e.preventDefault();
      if (busy.current) return;
      busy.current = true;
      clearTimeout(fallback.current);
      fallback.current = setTimeout(() => { gsap.set(el.current, { clipPath: HIDDEN }); busy.current = false; }, 5000);
      gsap.fromTo(el.current, { clipPath: HIDDEN }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.45, ease: 'power4.inOut',
        onComplete: () => router.push(url.pathname + url.search + url.hash) });
    };
    document.addEventListener('click', onClick, true);
    return () => { document.removeEventListener('click', onClick, true); clearTimeout(fallback.current); gsap.killTweensOf(el.current); };
  }, [router]);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!location.hash) window.__lenis?.scrollTo(0, { immediate: true });
    if (!busy.current) { setTimeout(() => ScrollTrigger.refresh(), 100); return; }
    gsap.to(el.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.55, delay: 0.05, ease: 'power4.inOut',
      onComplete: () => { clearTimeout(fallback.current); busy.current = false; gsap.set(el.current, { clipPath: HIDDEN }); ScrollTrigger.refresh(); } });
  }, [path]);

  return <div ref={el} className="gs-curtain" aria-hidden="true" />;
}
