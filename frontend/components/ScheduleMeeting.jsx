'use client';
import { useEffect } from 'react';
import Magnetic from './Magnetic';

const CAL_LINK = 'grostage-wumhoc/30min';
const CAL_NAMESPACE = '30min';
const CAL_CONFIG = JSON.stringify({
  layout: 'month_view',
  useSlotsViewOnSmallScreen: 'true',
});

/** Initializes the Cal.com 30-min element-click embed script once per session. */
function initCalEmbed() {
  if (typeof window === 'undefined') return;
  (function (C, A, L) {
    const p = function (a, ar) { a.q.push(ar); };
    const d = C.document;
    C.Cal = C.Cal || function () {
      const cal = C.Cal;
      const ar = arguments;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        const s = d.createElement('script');
        s.src = A;
        s.async = true;
        d.head.appendChild(s);
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api = function () { p(api, arguments); };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === 'string') {
          cal.ns[namespace] = cal.ns[namespace] || api;
          p(cal.ns[namespace], ar);
          p(cal, ['initNamespace', namespace]);
        } else {
          p(cal, ar);
        }
        return;
      }
      p(cal, ar);
    };
  })(window, 'https://app.cal.com/embed/embed.js', 'init');

  if (!window.__gsCal30MinInitialized) {
    window.Cal('init', CAL_NAMESPACE, { origin: 'https://app.cal.com' });
    window.Cal.config = window.Cal.config || {};
    window.Cal.config.forwardQueryParams = true;
    window.Cal.ns[CAL_NAMESPACE]('ui', {
      cssVarsPerTheme: {
        light: { 'cal-brand': '#104850' },
        dark: { 'cal-brand': '#104850' },
      },
      hideEventTypeDetails: false,
      layout: 'month_view',
    });
    window.__gsCal30MinInitialized = true;
  }
}

export default function ScheduleMeeting() {
  useEffect(() => {
    initCalEmbed();
  }, []);

  return (
    <section className="rx rx-dark rx-schedule" id="schedule-meeting" data-nav-theme="dark">
      <div className="rx-schedule-glow" aria-hidden="true" />
      <div className="rx-schedule-grid">
        <div className="rx-schedule-copy">
          <p className="rx-kicker" data-rx>Schedule a meeting</p>
          <h2 data-rx style={{ '--d': 1 }}>
            Book a 30-min<br />
            <span className="rx-accent">discovery call.</span>
          </h2>
        </div>
        <div className="rx-schedule-action" data-rx style={{ '--d': 2 }}>
          <p className="rx-schedule-desc">
            Prefer a live conversation? Pick a time that works for you and meet directly with our team to discuss your product, technology, or growth goals.
          </p>
          <div className="rx-schedule-meta" aria-label="Meeting details">
            <span>30 min</span>
            <i aria-hidden="true" />
            <span>Video call</span>
            <i aria-hidden="true" />
            <span>Direct with Grostage</span>
          </div>
          <Magnetic strength={0.25}>
            <button
              type="button"
              className="rx-pill rx-schedule-btn"
              data-cal-link={CAL_LINK}
              data-cal-namespace={CAL_NAMESPACE}
              data-cal-config={CAL_CONFIG}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Schedule a meeting
              <span aria-hidden="true">↗</span>
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

