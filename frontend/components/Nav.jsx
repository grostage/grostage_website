'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap } from '@/frontend/lib/gsap';
import Logo from './Logo';
const navigation = [['Home', '/'], ['About Us', '/about'], ['Services', '/services'], ['Our Work', '/work'], ['Client Stories', '/client-stories']];
// The sidebar menu. On small screens the top links are hidden, so they join it there.
const sidebar = [['Blog', '/blog'], ['Clients', '/clients'], ['Contact us', '/contact']];
export default function Nav() {
  const [open, setOpen] = useState(false);
  const header = useRef(null), menu = useRef(null), toggle = useRef(null);
  const pathname = usePathname();
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, progress = Math.min(1, window.scrollY / 280);
    const paint = () => {
      const target = Math.min(1, Math.max(0, window.scrollY / 280));
      progress = media.matches ? target : progress + (target - progress) * .15;
      const nav = header.current;
      // Read layout before writing styles, so each frame costs one layout pass.
      if (nav) {
        const y = nav.getBoundingClientRect().bottom / 2 + 5;
        // Inspect explicit surfaces, not the fixed header itself.
        const sections = [...document.querySelectorAll('[data-nav-theme],main>section,.footer')];
        let theme = 'light';
        for (const section of sections) {
          const b = section.getBoundingClientRect();
          if (b.top <= y && b.bottom > y) {
            theme = section.dataset.navTheme || (section.matches('.page-intro,.reel-section,.cta-section,.footer') ? 'dark' : 'light');
          }
        }
        nav.dataset.theme = theme;
        nav.style.setProperty('--nav-p', progress.toFixed(5));
      }
      frame = Math.abs(target - progress) > .0001 ? requestAnimationFrame(paint) : 0;
    };
    const update = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const delayed = setTimeout(update, 150);
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { clearTimeout(delayed); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); cancelAnimationFrame(frame); };
  }, [pathname]);
  useEffect(() => {
    const el = menu.current;
    const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : .55;
    gsap.killTweensOf(el);
    el.inert = !open;
    const animation = gsap.to(el, { autoAlpha: open ? 1 : 0, clipPath: open ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)', duration, ease: 'power3.inOut' });
    if (!open) return () => animation.kill();
    const previousOverflow = document.body.style.overflow;
    const linksAnimation = gsap.fromTo(el.querySelectorAll('nav a,.studio-menu-aside'), { y: duration ? 28 : 0, opacity: duration ? 0 : 1 }, { y: 0, opacity: 1, duration: duration ? .6 : 0, stagger: duration ? .045 : 0, delay: duration ? .15 : 0, ease: 'power3.out' });
    document.body.style.overflow = 'hidden';
    window.__lenis?.stop();
    const main = document.querySelector('.page-motion'), footer = document.querySelector('.footer');
    const saved = [main, footer].map(node => [node, node?.inert]);
    saved.forEach(([node]) => { if (node) node.inert = true; });
    const focusTimer = setTimeout(() => el.querySelector('a')?.focus(), duration * 1000);
    const key = e => {
      if (e.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
      if (e.key !== 'Tab') return;
      const links = [...el.querySelectorAll('a[href]')], items = [toggle.current, ...links];
      const i = items.indexOf(document.activeElement);
      e.preventDefault();
      items[(i + (e.shiftKey ? -1 : 1) + items.length) % items.length]?.focus();
    };
    document.addEventListener('keydown', key);
    return () => {
      animation.kill(); linksAnimation.kill(); clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.__lenis?.start();
      saved.forEach(([node, was]) => { if (node) node.inert = was; });
      document.removeEventListener('keydown', key);
    };
  }, [open]);
  const dark = ['/', '/about', '/services', '/work', '/blog', '/clients', '/client-stories', '/contact'].includes(pathname);
  return <>
    <header ref={header} data-theme={dark ? 'dark' : 'light'} className={`nav studio-nav fluid-nav${open ? ' is-open' : ''}`}><div className="wrap nav-in"><Logo />
      <nav className="nav-links" aria-label="Main navigation">{navigation.map(([label, href]) => <Link key={href} href={href} aria-current={(href === '/' ? pathname === '/' : pathname.startsWith(href)) ? 'page' : undefined}>{label}</Link>)}</nav>
      <Link href="/contact" className="btn nav-contact">Let’s Connect <span>↗</span></Link>
      <button ref={toggle} className="burger" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="studio-navigation" onClick={() => setOpen(!open)}><i /><i /></button>
    </div></header>
    <div ref={menu} id="studio-navigation" className="studio-menu" data-lenis-prevent role="dialog" aria-modal={open ? true : undefined} aria-label="Explore Grostage" aria-hidden={!open}>
      <nav aria-label="Expanded navigation">{sidebar.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}{navigation.map(([label, href]) => <Link key={href} href={href} className="studio-menu-main" onClick={() => setOpen(false)}>{label}</Link>)}</nav>
      <div className="studio-menu-aside"><p>New perspectives.<br />Meaningful experiences.<br />Your next stage.</p><Link href="/contact" onClick={() => setOpen(false)}>Start a conversation ↗</Link><span>STRATEGY / DESIGN / TECHNOLOGY</span></div>
    </div>
  </>;
}
