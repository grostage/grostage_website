'use client';

import { Fragment, useCallback, useRef } from 'react';
import Link from 'next/link';
import { gsap, useGSAP } from '@/frontend/lib/gsap';
import StageDivider from './StageDivider';

// The first three images are approved design concepts, NOT verified client campaigns.
// Never present numbers printed inside the art as real campaign outcomes.
const outcomes = [
  {
    id: 'brand', title: 'Brand Building',
    description: 'Give your business a distinctive voice, identity and presence that people remember.',
    services: ['Brand Identity', 'Campaign Creative', 'Social Design'],
    image: '/images/marketing/brand-building.webp',
  },
  {
    id: 'leads', title: 'Lead Generation',
    description: 'Turn attention into enquiries with the right message, campaign and customer journey.',
    services: ['Meta Ads', 'Google Ads', 'Campaign Content'],
    image: '/images/marketing/lead-generation.webp',
  },
  {
    id: 'sales', title: 'Sales Growth',
    description: 'Connect creative storytelling and performance campaigns to stronger buying intent.',
    services: ['Performance Creative', 'Creative Testing', 'Conversion Campaigns'],
    image: '/images/marketing/sales-growth.webp',
  },
  {
    id: 'local', title: 'Local Visibility',
    description: 'Help nearby customers discover, understand and choose your business.',
    services: ['Google Business Profile', 'Local SEO', 'Local Campaigns'],
    image: '/images/marketing/local-visibility.webp',
  },
];

const FIRST_CARD_REVEAL_START = 0.76;
const FIRST_CARD_READY_PROGRESS = 0.9;

function RisingWords({ text }) {
  return text.split(/\s+/).map((word, index, all) => <Fragment key={index}>
    <span className="marketing-reveal-mask" aria-hidden="true"><span className="marketing-reveal-word">{word}</span></span>
    {index < all.length - 1 ? ' ' : null}
  </Fragment>);
}

// A bespoke visual for the fourth outcome until approved Local Visibility media exists.
// No claims of real rankings, traffic, ratings or conversions.
function OutcomeVisual() {
  return <div className="moc-art moc-art-local" aria-hidden="true">
    <div className="moc-art-top"><span>DISCOVERY / 04</span><span>SHOW UP WHERE IT MATTERS</span></div>
    <div className="moc-local-grid">
      <div className="moc-local-map"><span className="moc-local-road moc-road-one" /><span className="moc-local-road moc-road-two" /><span className="moc-local-road moc-road-three" /><b className="moc-pin moc-pin-one">●</b><b className="moc-pin moc-pin-two">●</b><b className="moc-pin moc-pin-three">●</b></div>
      <div className="moc-local-card"><small>LOCAL DISCOVERY</small><strong>BE THE<br />BUSINESS<br />THEY FIND.</strong><span>SEARCH → DISCOVER → VISIT</span></div>
    </div>
    <div className="moc-art-foot"><span>SEARCH → LOCAL PRESENCE → CONNECTION</span><b>↗</b></div>
  </div>;
}

export default function MarketingOutcomes() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const headingRef = useRef(null);
  const statementRef = useRef(null);
  const counterRef = useRef(null);
  const progressRef = useRef(null);
  const dividerProgressRef = useRef(0);
  const firstCardRevealRef = useRef(null);
  const firstCardSlideRef = useRef(null);
  const syncFirstCardToDivider = useCallback(progress => {
    dividerProgressRef.current = progress;
    if (firstCardRevealRef.current) {
      // Hold until the divider's final 24%, then reveal with its existing trigger.
      firstCardRevealRef.current.progress(gsap.utils.clamp(0, 1, (progress - FIRST_CARD_REVEAL_START) / (1 - FIRST_CARD_REVEAL_START)));
    }
    if (firstCardSlideRef.current) firstCardSlideRef.current.inert = progress < FIRST_CARD_READY_PROGRESS;
  }, []);
  const syncThirdDivider = useCallback(progress => {
    const reveal = `${Math.round(progress * 10000) / 100}%`;
    const explorer = rootRef.current?.parentElement?.querySelector('#marketing-services-explorer');
    explorer?.style.setProperty('--marketing-handoff-reveal', reveal);
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Same scroll-linked word-reveal concept already used in Section 02.
      const revealWords = (element, start, end, stagger, opacity) => {
        if (!element) return;
        const words = element.querySelectorAll('.marketing-reveal-word');
        gsap.set(words, { yPercent: 118, opacity });
        gsap.to(words, {
          yPercent: 0, opacity: 1, stagger: { each: stagger }, ease: 'none',
          scrollTrigger: { trigger: element, start, end, scrub: 0.8, invalidateOnRefresh: true },
        });
      };
      revealWords(headingRef.current, 'top 88%', 'top 27%', 0.13, 0);
      revealWords(statementRef.current, 'top 89%', 'top 45%', 0.07, 0.14);
    });

    mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      const stage = stageRef.current;
      if (!stage) return undefined;
      const slides = gsap.utils.toArray('.marketing-outcome-row', stage);
      if (slides.length < 2) return undefined;

      const media = slides.map(slide => slide.querySelector('.marketing-outcome-media-wrap'));
      const artwork = slides.map(slide => slide.querySelector('.marketing-outcome-media-img, .moc-art'));
      const copy = slides.map(slide => slide.querySelector('.marketing-outcome-copy'));
      const items = slides.map(slide => gsap.utils.toArray('.marketing-outcome-kicker, .marketing-outcome-title, .marketing-outcome-description, .marketing-outcome-services-label, .marketing-outcome-services li, .marketing-outcome-work-link', slide));
      const strip = 'inset(49% 0% 49% 0% round 14px)'; // ~12px of a 600px frame
      const full = 'inset(0% 0% 0% 0% round 14px)';

      stage.classList.add('is-enhanced');
      gsap.set(slides, { autoAlpha: 0 });
      gsap.set(slides[0], { autoAlpha: 1 });
      firstCardSlideRef.current = slides[0];
      slides[0].inert = dividerProgressRef.current < FIRST_CARD_READY_PROGRESS;
      gsap.set(media[0], { clipPath: strip, y: 64, autoAlpha: 0 });
      gsap.set(items[0], { autoAlpha: 0, x: 60, y: 20 });
      slides.slice(1).forEach((slide, i) => {
        const index = i + 1;
        gsap.set(media[index], { clipPath: strip, x: index % 2 === 0 ? -48 : 48 });
        if (artwork[index]) gsap.set(artwork[index], { scale: 1.08, yPercent: 2 });
        gsap.set(items[index], { autoAlpha: 0, x: index % 2 === 0 ? 60 : -60, y: 28 });
      });

      let current = -1;
      const updateActive = time => {
        const index = Math.min(slides.length - 1, Math.max(0, Math.floor(Math.max(0, time - 0.5))));
        if (current !== index) {
          const changed = current !== index;
          current = index;
          slides.forEach((slide, i) => {
            slide.inert = i !== index || (i === 0 && dividerProgressRef.current < FIRST_CARD_READY_PROGRESS);
            slide.classList.toggle('is-current', i === index);
          });
          if (changed && counterRef.current) counterRef.current.textContent = `0${index + 1} / 0${slides.length}`;
        }
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${Math.max(0.005, Math.min(1, time / slides.length))})`;
      };
      updateActive(0);

      // Reveal the opening card first; each following timeline unit then advances
      // one card. The shared scrubbed timeline reverses in both directions.
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * slides.length * 0.9)}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: self => updateActive(self.progress * slides.length),
        },
      });

      // Card 01 overlaps the divider's final 24% of progress through the
      // divider's existing ScrollTrigger; it is already revealed at pin start.
      firstCardRevealRef.current = gsap.timeline({ paused: true });
      firstCardRevealRef.current
        .to(media[0], { clipPath: full, y: 0, autoAlpha: 1, duration: 0.78, ease: 'power2.out' }, 0)
        .to(items[0], { autoAlpha: 1, x: 0, y: 0, stagger: 0.015, duration: 0.55, ease: 'power3.out' }, 0.025);
      syncFirstCardToDivider(dividerProgressRef.current);

      for (let i = 1; i < slides.length; i++) {
        const at = i;
        // Collapse the old creative into a disappearing horizontal band.
        tl.to(copy[i - 1], { autoAlpha: 0, y: -26, duration: 0.32 }, at)
          .to(media[i - 1], { clipPath: strip, autoAlpha: 0, duration: 0.44 }, at)
          .to(artwork[i - 1], { scale: 1.08, yPercent: -2, duration: 0.44, ease: 'none' }, at)
          .to(slides[i - 1], { autoAlpha: 0, duration: 0.02 }, at + 0.46)
          .to(slides[i], { autoAlpha: 1, duration: 0.02 }, at + 0.38)
          // Expand a roughly 12px-tall image window, NEVER squash the source image.
          .to(media[i], { clipPath: full, x: 0, duration: 0.56, ease: 'power2.out' }, at + 0.4)
          .to(artwork[i], { scale: 1, yPercent: 0, duration: 0.72, ease: 'none' }, at + 0.38)
          // Alternate the direction of the text while keeping a small upward rise.
          .to(items[i], { autoAlpha: 1, x: 0, y: 0, stagger: 0.035, duration: 0.4, ease: 'power3.out' }, at + 0.48)
          .to({}, { duration: 0.04 }, at + 0.96);
      }

      return () => {
        firstCardRevealRef.current = null;
        firstCardSlideRef.current = null;
        stage.classList.remove('is-enhanced');
        slides.forEach(slide => { slide.inert = false; slide.classList.remove('is-current'); });
        if (counterRef.current) counterRef.current.textContent = '01 / 04';
        if (progressRef.current) progressRef.current.style.transform = '';
      };
    });

    // Mobile/tablet fallback: one near-viewport-height story per scroll without
    // pinning or scroll hijacking. Keep motion simple and content fully accessible.
    mm.add('(max-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray('.marketing-outcome-row', stageRef.current).forEach(row => {
        const media = row.querySelector('.marketing-outcome-media-wrap');
        const copy = row.querySelector('.marketing-outcome-copy');
        gsap.fromTo(media, { autoAlpha: 0, y: 34 }, {
          autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 85%', toggleActions: 'play reverse play reverse' },
        });
        gsap.fromTo(copy, { autoAlpha: 0, y: 28 }, {
          autoAlpha: 1, y: 0, duration: 0.8, delay: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 82%', toggleActions: 'play reverse play reverse' },
        });
      });
    });

    mm.add('(hover: hover) and (pointer: fine) and (min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      const figures = gsap.utils.toArray('.marketing-outcome-media', stageRef.current);
      const cleanups = figures.map(figure => {
        const tiltX = gsap.quickTo(figure, 'rotationX', { duration: 0.6, ease: 'power3.out' });
        const tiltY = gsap.quickTo(figure, 'rotationY', { duration: 0.6, ease: 'power3.out' });
        const move = event => {
          const bounds = figure.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width - 0.5;
          const y = (event.clientY - bounds.top) / bounds.height - 0.5;
          tiltY(x * 5); tiltX(-y * 4);
          figure.style.setProperty('--mx', `${event.clientX - bounds.left}px`);
          figure.style.setProperty('--my', `${event.clientY - bounds.top}px`);
        };
        const leave = () => { tiltX(0); tiltY(0); };
        figure.addEventListener('pointermove', move);
        figure.addEventListener('pointerleave', leave);
        return () => { figure.removeEventListener('pointermove', move); figure.removeEventListener('pointerleave', leave); };
      });
      return () => cleanups.forEach(cleanup => cleanup());
    });

    return () => {
      mm.revert();
    };
  }, { scope: rootRef });

  return <section className="marketing-possibilities" id="marketing-possibilities" data-nav-theme="light" aria-labelledby="marketing-possibilities-title" ref={rootRef}>
    <div className="marketing-possibilities-intro">
      <p className="marketing-possibilities-index reveal">02 / WHAT WE MAKE POSSIBLE</p>
      <div className="marketing-possibilities-intro-main reveal">
        <h2 id="marketing-possibilities-title" ref={headingRef} aria-label="Beyond visibility. Towards impact.">
          <span className="marketing-reveal-line"><RisingWords text="Beyond visibility." /></span>
          <span className="marketing-reveal-line marketing-reveal-line-accent"><RisingWords text="Towards impact." /></span>
        </h2>
        <p ref={statementRef} className="marketing-possibilities-statement" aria-label="We bring strategy, creativity and performance together to help brands move forward.">
          <RisingWords text="We bring strategy, creativity and performance together to help brands move forward." />
        </p>
      </div>
    </div>

    <div className="marketing-possibilities-rule"><span>CHOOSE WHAT YOU WANT TO GROW</span><span>01 — 04</span></div>

    <div className="marketing-outcomes-divider" aria-hidden="true">
      <StageDivider from="#f0f3ef" to="#090f10" accent="#104850" triggerRef={stageRef} scrollStart="top 70%" scrollEnd="top 10%" onProgress={syncFirstCardToDivider} />
    </div>

    <div className="marketing-outcomes-stage" ref={stageRef} data-nav-theme="dark" role="region" aria-label="Marketing objectives: scroll to explore four outcomes">
      <div className="marketing-outcomes-stage-header"><span>GROSTAGE / GROWTH STUDIO</span><span ref={counterRef} className="marketing-outcomes-counter">01 / 04</span></div>
      <div className="marketing-outcomes-window">
        {outcomes.map((item, index) => <article className="marketing-outcome-row" key={item.id} id={`marketing-outcome-${item.id}`} aria-labelledby={`marketing-outcome-title-${item.id}`}>
          <div className="marketing-outcome-media-wrap">
            <figure className="marketing-outcome-media" role="img" aria-label={`${item.title}: illustrative concept design, not verified client work or measured results`}>
              {item.image
                ? <img className="marketing-outcome-media-img" src={item.image} alt={`Illustrative ${item.title.toLowerCase()} creative composition, not actual client work`} loading="eager" decoding="async" />
                : <OutcomeVisual />}
              <span className="marketing-outcome-glare" aria-hidden="true" />
              {!item.image && <figcaption className="marketing-outcome-media-caption">Creative concept | Not actual client work or measured results</figcaption>}
            </figure>
          </div>
          <div className="marketing-outcome-copy reveal">
            <div className="marketing-outcome-kicker"><span>0{index + 1} / 04</span><span aria-hidden="true">↗</span></div>
            <h3 className="marketing-outcome-title" id={`marketing-outcome-title-${item.id}`}>{item.title}</h3>
            <p className="marketing-outcome-description">{item.description}</p>
            <p className="marketing-outcome-services-label">WHAT WE CAN DO</p>
            <ul className="marketing-outcome-services" aria-label={`${item.title} services`}>
              {item.services.map(service => <li key={service}>{service}</li>)}
            </ul>
            <Link className="marketing-outcome-work-link" href="/work">See selected work <span aria-hidden="true">↗</span></Link>
          </div>
        </article>)}
      </div>
      <div className="marketing-outcomes-stage-footer">
        <span>SCROLL TO EXPLORE <span aria-hidden="true">↓</span></span>
        <div className="marketing-outcomes-progress" aria-hidden="true"><span ref={progressRef} /></div>
        <span>CREATIVE / CAMPAIGNS / GROWTH</span>
      </div>
    </div>
    <StageDivider from="#090f10" to="#f0f3ef" accent="#104850" scrollStart="top bottom-=15px" scrollRefreshPriority={-1} onProgress={syncThirdDivider} />
  </section>;
}
