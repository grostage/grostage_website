'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { gsap, ScrollTrigger, useGSAP } from '@/frontend/lib/gsap';

// These six images are illustrative service compositions, not verified client case studies.
// Keep performance metrics out of the copy until real campaign data has been approved.
const SERVICES = [
  {
    id: 'branding',
    name: 'Branding & Identity',
    description: 'Build a recognizable brand through thoughtful strategy, identity design and consistent communication.',
    items: ['Logo Design', 'Brand Identity', 'Brand Guidelines', 'Rebranding'],
    image: '/images/marketing/services/brand-identity.webp',
    visualAlt: 'Illustrative identity presentation with branded stationery, palette and brand guidelines',
    visualTitle: 'A distinct identity for a lasting impression.',
    visualDetail: 'Logo systems, brand language and design standards that work together.',
    label: 'IDENTITY SYSTEM',
  },
  {
    id: 'production',
    name: 'Creative Production',
    description: 'Give your ideas a compelling visual form through filming, editing, motion design and campaign content.',
    items: ['Campaign Creatives', 'Reels & Video', 'Motion Graphics', 'AI Video'],
    image: '/images/marketing/services/creative-production.webp',
    visualAlt: 'Illustrative cinematic production set featuring camera equipment and studio lighting',
    visualTitle: 'Ideas, made visible.',
    visualDetail: 'Concept → Shoot → Edit → Deliver',
    label: 'PRODUCTION STUDIO',
  },
  {
    id: 'social',
    name: 'Social Media Marketing',
    description: 'Create a consistent voice across channels with planned content, creative storytelling and management.',
    items: ['Content Planning', 'Social Media Management', 'Social Creatives', 'Community Engagement'],
    image: '/images/marketing/services/social-media.webp',
    visualAlt: 'Illustrative social media campaign with mobile feed and multiple content formats',
    visualTitle: 'Stories worth following.',
    visualDetail: 'Editorial content, social design and purposeful publishing.',
    label: 'SOCIAL CONTENT',
  },
  {
    id: 'advertising',
    name: 'Performance Advertising',
    description: 'Bring the right message to the right audience with targeted campaigns and ongoing optimization.',
    items: ['Meta Ads', 'Google Ads', 'LinkedIn Ads', 'Creative Testing'],
    image: '/images/marketing/services/performance-ads.webp',
    visualAlt: 'Illustrative product advertisement with campaign graphics and shopping mockup',
    visualTitle: 'Creativity with a purpose.',
    visualDetail: 'Campaign planning → Creative testing → Optimization',
    label: 'PAID CAMPAIGNS',
  },
  {
    id: 'seo',
    name: 'SEO & Local Marketing',
    description: 'Improve discoverability in search and help nearby customers find, understand and choose your business.',
    items: ['SEO', 'Local SEO', 'Google Business Profile', 'Search Visibility'],
    image: '/images/marketing/services/seo-local.webp',
    visualAlt: 'Illustrative location search interface over a night-time map with business discovery results',
    visualTitle: 'Be found where it matters.',
    visualDetail: 'Search → Discover → Visit',
    label: 'SEARCH DISCOVERY',
  },
  {
    id: 'materials',
    name: 'Business & Brand Materials',
    description: 'Present your company clearly and professionally through documents designed to inform and persuade.',
    items: ['Company Profiles', 'Brochures', 'Pitch Decks', 'Brand Collateral'],
    image: '/images/marketing/services/brand-materials.webp',
    visualAlt: 'Illustrative premium company profile and printed brand presentation materials',
    visualTitle: 'Every detail tells your story.',
    visualDetail: 'Profiles, brochures and presentations built for the conversation.',
    label: 'BRAND COLLATERAL',
  },
];

export default function MarketingServicesExplorer() {
  const root = useRef(null);
  const card = useRef(null);
  const [active, setActive] = useState(0);
  const [previewIndex, setPreviewIndex] = useState(0);
  const current = SERVICES[previewIndex];
  const toggleService = index => {
    const closing = active === index;
    setActive(previous => previous === index ? null : index);
    if (!closing) setPreviewIndex(index);
  };

  // The service list enters in a restrained stagger, following the site's GSAP conventions.
  // Keep the eyebrow's existing entrance and give the heading and paragraph one
  // coordinated, scroll-linked reveal below.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    const outcomes = root.current.closest('.marketing-services-page')?.querySelector('#marketing-possibilities');
    const divider = outcomes?.querySelector(':scope > .stage-divider');
    const getDividerEnd = () => {
      const dividerTrigger = ScrollTrigger.getAll().find(trigger => trigger.trigger === divider);
      if (dividerTrigger) return dividerTrigger.end;
      if (!divider) return window.scrollY;
      const dividerTop = window.scrollY + divider.getBoundingClientRect().top;
      return dividerTop - window.innerHeight * (window.innerWidth <= 900 ? 0.45 : 0.25);
    };
    const synchronizedStart = (element, viewportRatio, minimumDelay) => () => {
      const viewportHeight = window.innerHeight;
      const elementTop = window.scrollY + element.getBoundingClientRect().top;
      const ratio = typeof viewportRatio === 'function' ? viewportRatio() : viewportRatio;
      const naturalStart = elementTop - viewportHeight * ratio;
      const afterDivider = getDividerEnd() + Math.max(24, Math.round(viewportHeight * minimumDelay));
      return Math.max(naturalStart, afterDivider);
    };
    const headingViewportRatio = () => window.innerWidth <= 600 ? 0.62 : window.innerWidth <= 900 ? 0.58 : 0.4;

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const heading = root.current.querySelector('.ms3-heading');
      const index = root.current.querySelector('.ms3-index');
      const grid = root.current.querySelector('.ms3-services-grid');
      const headingStart = synchronizedStart(heading, headingViewportRatio, 0.08);
      const gridStart = synchronizedStart(grid, 0.78, 0.18);

      // Keep the eyebrow's existing entrance; the heading and paragraph use the
      // coordinated horizontal scroll reveal below.
      gsap.fromTo(index, { autoAlpha: 0, y: 20 }, {
        autoAlpha: 1, y: 0, ease: 'none',
        scrollTrigger: {
          trigger: heading,
          start: headingStart,
          end: () => headingStart() + Math.round(window.innerHeight * 0.34),
          scrub: 0.65,
          invalidateOnRefresh: true,
        },
      });

      gsap.fromTo(gsap.utils.toArray('.ms3-service-item', root.current),
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1, y: 0, duration: 0.72, stagger: 0.075, ease: 'power3.out',
          scrollTrigger: {
            trigger: grid,
            start: gridStart,
            toggleActions: 'play reverse play reverse',
          },
        });
    });

    mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      const preview = root.current.querySelector('.ms3-preview-column');
      const grid = root.current.querySelector('.ms3-services-grid');
      const gridStart = synchronizedStart(grid, 0.78, 0.18);
      gsap.fromTo(preview, { autoAlpha: 0, x: 28, y: 12 }, {
        autoAlpha: 1, x: 0, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: {
          trigger: grid,
          start: gridStart,
          toggleActions: 'play reverse play reverse',
        },
      });
    });

    const addIntroReveal = (headingOffset, paragraphOffset) => {
      const intro = root.current.querySelector('.ms3-heading');
      const heading = root.current.querySelector('#marketing-services-title');
      const paragraph = root.current.querySelector('.ms3-intro');
      if (!intro || !heading || !paragraph) return undefined;
      const introStart = synchronizedStart(intro, headingViewportRatio, 0.08);

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: intro,
          start: introStart,
          end: () => introStart() + Math.round(window.innerHeight * 0.34),
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      timeline.fromTo(heading,
        { x: headingOffset, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.55, ease: 'none' },
        0,
      ).fromTo(paragraph,
        { x: paragraphOffset, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.45, ease: 'none' },
        0.14,
      );
      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    };

    mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => addIntroReveal(-100, -70));
    mm.add('(max-width: 900px) and (prefers-reduced-motion: no-preference)', () => addIntroReveal(-36, -28));

    mm.add('(min-width: 901px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const element = card.current;
      if (!element) return undefined;
      const turnX = gsap.quickTo(element, 'rotationX', { duration: 0.65, ease: 'power3.out' });
      const turnY = gsap.quickTo(element, 'rotationY', { duration: 0.65, ease: 'power3.out' });
      const move = event => {
        const bounds = element.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        turnY(x * 6);
        turnX(-y * 5);
        element.style.setProperty('--ms3-mx', `${event.clientX - bounds.left}px`);
        element.style.setProperty('--ms3-my', `${event.clientY - bounds.top}px`);
      };
      const leave = () => { turnX(0); turnY(0); };
      element.addEventListener('pointermove', move, { passive: true });
      element.addEventListener('pointerleave', leave);
      return () => {
        element.removeEventListener('pointermove', move);
        element.removeEventListener('pointerleave', leave);
        gsap.set(element, { clearProps: 'rotationX,rotationY' });
      };
    });
    return () => mm.revert();
  }, { scope: root });

  // Transition only the newly selected image mask, not the outer hover-tilt card.
  // Every layer stays mounted, so there's no layout jump when selecting a service.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const visual = root.current?.querySelector(`.ms3-scene[data-index="${previewIndex}"] .ms3-scene-image`);
      if (!visual) return undefined;
      gsap.fromTo(visual,
        { clipPath: 'inset(47% 0% 47% 0% round 19px)', y: 18, scale: 1.06 },
        { clipPath: 'inset(0% 0% 0% 0% round 19px)', y: 0, scale: 1, duration: 0.84, ease: 'power3.out', overwrite: true });
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [previewIndex], revertOnUpdate: true });

  return (
    <section className="marketing-service-explorer reveal" id="marketing-services-explorer" ref={root} data-nav-theme="light" aria-labelledby="marketing-services-title">
      <div className="ms3-shell">
        <header className="ms3-heading">
          <p className="ms3-index">03 / OUR MARKETING SERVICES</p>
          <h2 id="marketing-services-title">Everything your brand <span>needs to grow.</span></h2>
          <p className="ms3-intro">From strategy and content to performance and visibility, we bring every essential service together.</p>
        </header>

        <div className="ms3-services-grid">
          <div className="ms3-list" aria-label="Choose a marketing service">
            {SERVICES.map((service, index) => (
              <div className={`ms3-service-item${active === index ? ' is-active' : ''}`} key={service.id}>
                <button
                  type="button"
                  className="ms3-service-trigger"
                  aria-expanded={active === index}
                  aria-controls={`ms3-content-${service.id}`}
                  onClick={() => toggleService(index)}
                >
                  <span className="ms3-number">0{index + 1}</span>
                  <span className="ms3-name">{service.name}</span>
                  <span className="ms3-toggle" aria-hidden="true">
                    <span className={`ms3-toggle-symbol${active === index ? ' is-open' : ''}`}>
                      <span>+</span><span>−</span>
                    </span>
                  </span>
                </button>
                <div
                  id={`ms3-content-${service.id}`}
                  className={`ms3-service-disclosure${active === index ? ' is-open' : ''}`}
                  aria-hidden={active !== index}
                  inert={active !== index}
                >
                  <div className="ms3-service-disclosure-inner">
                    <div className="ms3-service-details">
                      <p>{service.description}</p>
                      <ul className="ms3-tags" aria-label={`${service.name} services`}>
                        {service.items.map(item => <li key={item}>{item}</li>)}
                      </ul>
                      <div className="ms3-mobile-visual">
                        <img src={service.image} alt={service.visualAlt} loading="lazy" decoding="async" />
                        <span>Illustrative service concept</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="ms3-preview-column">
            <div className="ms3-preview-card" ref={card} aria-label="Selected service creative preview">
              {SERVICES.map((service, index) => (
                <div key={service.id} data-index={index} className={`ms3-scene${previewIndex === index ? ' is-active' : ''}`} aria-hidden={previewIndex !== index}>
                  <div className="ms3-scene-image">
                    <img src={service.image} alt="" loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />
                  </div>
                  <div className="ms3-scene-shade" />
                  <div className="ms3-preview-top">
                    <span>SERVICE PREVIEW<br />0{index + 1} / 06</span>
                    <span>{service.label}</span>
                  </div>
                  <div className="ms3-preview-bottom">
                    <div>
                      <span className="ms3-preview-kicker">GROSTAGE / MARKETING</span>
                      <p className="ms3-preview-title">{service.visualTitle}</p>
                    </div>
                    <p className="ms3-preview-detail">{service.visualDetail}</p>
                  </div>
                </div>
              ))}
              <span className="ms3-preview-glare" aria-hidden="true" />
            </div>
            <div className="ms3-preview-foot">
              <span aria-live="polite">{current.name} </span>
              <Link href={`/contact?service=${encodeURIComponent(current.name)}`}>
                Discuss this service <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
