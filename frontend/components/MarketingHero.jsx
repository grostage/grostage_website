'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap, useGSAP, ready } from '@/frontend/lib/gsap';
import Magnetic from './Magnetic';

const VIDEO_SRC = '/video/marketing-showreel-v1.mp4';

export default function MarketingHero() {
  const root = useRef(null);
  const video = useRef(null);
  const stoppedByUser = useRef(false);
  const [paused, setPaused] = useState(false);
  const [videoUnavailable, setVideoUnavailable] = useState(false);

  useGSAP(() => {
    const media = gsap.matchMedia();
    let alive = true;
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const hero = root.current;
      const timeline = gsap.timeline({ paused: true })
        .fromTo(hero.querySelector('.marketing-eyebrow'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power3.out' })
        .fromTo(hero.querySelectorAll('.marketing-title-line > span'), { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.12, ease: 'power4.out' }, 0.12)
        .fromTo(hero.querySelector('.marketing-description'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.62)
        .fromTo(hero.querySelector('.marketing-hero-actions'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.78);
      ready().then(() => { if (alive) timeline.play(); });

      // Mirror the homepage StageHero title movement. This is scroll-driven,
      // reversible, and independent of the nested headline entrance animation.
      gsap.to(hero.querySelector('.marketing-title'), {
        yPercent: 25,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      return () => timeline.kill();
    });
    return () => { alive = false; media.revert(); };
  }, { scope: root });

  useEffect(() => {
    const el = video.current;
    if (!el) return undefined;

    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const playIfAllowed = () => {
      if (!motion.matches && visible && !document.hidden && !stoppedByUser.current) {
        el.play().then(() => setPaused(false)).catch(() => setPaused(true));
      } else {
        el.pause();
        if (motion.matches) setPaused(true);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      playIfAllowed();
    }, { threshold: 0.05 });
    const onVisibility = () => playIfAllowed();
    const onMotionChange = () => playIfAllowed();

    el.muted = true;
    observer.observe(el);
    document.addEventListener('visibilitychange', onVisibility);
    motion.addEventListener('change', onMotionChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      motion.removeEventListener('change', onMotionChange);
      el.pause();
    };
  }, []);

  const togglePlayback = () => {
    const el = video.current;
    if (!el) return;
    const shouldPause = !el.paused;
    stoppedByUser.current = shouldPause;
    setPaused(shouldPause);
    if (shouldPause) el.pause();
    else el.play().catch(() => setPaused(true));
  };



  return (
    <section className="marketing-hero" data-nav-theme="dark" ref={root} aria-labelledby="marketing-title">
      <div className="marketing-video-layer" aria-hidden="true">
        <video
          ref={video}
          className="marketing-video"
          src={VIDEO_SRC}
          poster="/video/grostage-desktop-poster.jpg"
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          data-unavailable={videoUnavailable ? 'true' : undefined}
          onError={() => setVideoUnavailable(true)}
        />
        <div className="marketing-video-blend" />
      </div>

      <div className="marketing-hero-content">
        <p className="marketing-eyebrow"><i aria-hidden="true" /> MARKETING SERVICES</p>
        <h1 id="marketing-title" className="marketing-title">
          <span className="marketing-title-line"><span>Creative that</span></span>
          <span className="marketing-title-line marketing-title-accent"><span>drives growth.</span></span>
        </h1>
        <p className="marketing-description">We connect bold ideas, standout content and smart campaigns to meaningful business growth.</p>
      </div>

      <a className="stage-scroll" href="#marketing-possibilities">
        SCROLL TO DISCOVER <span aria-hidden="true">V</span>
      </a>

      <div className="marketing-hero-actions">
        <Magnetic>
          <Link className="stage-pill" href="/services" aria-label="Explore Grostage services">
            Explore Services <span aria-hidden="true">↗</span>
          </Link>
        </Magnetic>
      </div>

      {!videoUnavailable && <button
        type="button"
        className="marketing-video-toggle"
        onClick={togglePlayback}
        aria-label={paused ? 'Play background video' : 'Pause background video'}
        aria-pressed={paused}
      >
        <span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span>
      </button>}
    </section>
  );
}
