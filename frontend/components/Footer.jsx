import Link from 'next/link';
import Logo from './Logo';
import { getFooter, parseLinks } from '@/backend/lib/footer';
import { sanitizeEmail, sanitizeHref, sanitizePhone } from '@/backend/lib/security';

function safeLinks(links) {
  return parseLinks(links)
    .map(link => ({ ...link, href: sanitizeHref(link.href, { allowRelative: true, allowBareDomain: false }) }))
    .filter(link => Boolean(link.href));
}

export default async function Footer() {
  const f = await getFooter();
  const safeEmail = sanitizeEmail(f.email);
  const safePhone = sanitizePhone(f.phone);
  return (
    <footer className="footer" data-nav-theme="dark"><div className="wrap">
      <div className="f-grid">
        <div><Logo size={34} /><p className="mut" style={{ marginTop: 16, maxWidth: 320 }}>{f.tagline}</p></div>
        <div><h4>Explore</h4>{safeLinks(f.links).map(l => <Link key={l.label} href={l.href}>{l.label}</Link>)}</div>
        <div><h4>Follow</h4>{safeLinks(f.socials).map(l => <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>)}</div>
        <div><h4>Contact</h4>{safeEmail && <a href={'mailto:' + safeEmail}>{safeEmail}</a>}{safePhone && <a href={'tel:' + safePhone}>{safePhone}</a>}{f.address && <span className="mut">{f.address}</span>}</div>
      </div>
      <span className="footer-wordmark" aria-hidden="true">{[...'grostage®'].map((c, i) => <span key={i} style={{ '--i': i }}>{c}</span>)}</span>
      <div className="f-bot"><span>{f.copyright}</span></div>
    </div></footer>
  );
}
