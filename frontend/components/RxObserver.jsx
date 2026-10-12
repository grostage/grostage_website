'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Adds .is-in to [data-rx] elements as they enter the viewport. Content is
// visible by default; the hidden start state only applies once .rx-ready is set.
export default function RxObserver() {
  const pathname = usePathname();
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const root = document.documentElement;
    const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
    const scan = () => document.querySelectorAll('[data-rx]:not(.is-in)').forEach(el => io.observe(el));
    root.classList.add('rx-ready');
    scan();
    const t = setTimeout(scan, 400);
    return () => { clearTimeout(t); io.disconnect(); };
  }, [pathname]);
  return null;
}
