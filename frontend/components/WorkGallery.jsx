'use client';
import { useLayoutEffect, useRef, useState } from 'react';
import ProjectCard from './ProjectCard';
import { gsap, Flip, ScrollTrigger } from '@/frontend/lib/gsap';

const categories = ['All work', 'Digital products', 'Business systems', 'Digital growth'];
const group = work => {
  const category = String(work.category || '').toLowerCase();
  if (/growth|marketing|campaign|social|seo|brand/.test(category)) return 'Digital growth';
  if (/system|erp|crm|automation|logistics|warehouse|operations/.test(category)) return 'Business systems';
  return 'Digital products';
};

export default function WorkGallery({ works }) {
  const [filter, setFilter] = useState('All work');
  const grid = useRef(null), flipState = useRef(null), touched = useRef(false);
  const count = c => c === 'All work' ? works.length : works.filter(w => group(w) === c).length;
  const filtered = works.filter(work => filter === 'All work' || group(work) === filter);
  const choose = c => {
    if (c === filter) return;
    touched.current = true;
    // Record where every card is now, so the new layout can animate from it.
    if (grid.current && !matchMedia('(prefers-reduced-motion: reduce)').matches) flipState.current = Flip.getState(grid.current.querySelectorAll('.project-card'));
    setFilter(c);
  };
  useLayoutEffect(() => {
    if (!touched.current) return;
    // Cards rendered by a filter change were never seen by the scroll reveal.
    grid.current?.querySelectorAll('.project-card').forEach(card => card.classList.add('is-in'));
    const state = flipState.current;
    if (!state) return;
    flipState.current = null;
    Flip.from(state, { targets: grid.current.querySelectorAll('.project-card'), duration: .7, ease: 'expo.out', scale: true, absolute: true, nested: true,
      onEnter: els => gsap.fromTo(els, { opacity: 0, scale: .94, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: .6, ease: 'expo.out', stagger: .05 }),
      onLeave: els => gsap.to(els, { opacity: 0, scale: .94, duration: .3, ease: 'power2.in' }),
      onComplete: () => ScrollTrigger.refresh() });
  }, [filter]);
  return <section className="sec wrap"><div className="filter-bar" role="group" aria-label="Filter projects">{categories.map(c => <button key={c} aria-pressed={filter === c} onClick={() => choose(c)}>{c}<sup aria-hidden="true">{count(c)}</sup><span className="sr-only"> ({count(c)} projects)</span></button>)}<span aria-live="polite">{String(filtered.length).padStart(2, '0')} PROJECTS</span></div><div className="work-grid" ref={grid}>{filtered.map(w => <ProjectCard work={w} key={w.slug} index={w.id - 1} />)}</div></section>;
}
