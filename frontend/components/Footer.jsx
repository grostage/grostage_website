import Link from 'next/link';
import Logo from './Logo';
import { getFooter, parseLinks } from '@/backend/lib/footer';
export default async function Footer() {
  const f = await getFooter();
  return (
    <footer className="footer" data-nav-theme="dark"><div className="wrap">
      <div className="f-grid">
        <div><Logo size={34} /><p className="mut" style={{ marginTop: 16, maxWidth: 320 }}>{f.tagline}</p></div>
        <div><h4>Explore</h4>{parseLinks(f.links).map(l => <Link key={l.label} href={l.href}>{l.label}</Link>)}</div>
        <div><h4>Follow</h4>{parseLinks(f.socials).map(l => <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>)}</div>
        <div><h4>Contact</h4>{f.email && <a href={'mailto:' + f.email}>{f.email}</a>}{f.phone && <a href={'tel:' + f.phone}>{f.phone}</a>}{f.address && <span className="mut">{f.address}</span>}</div>
      </div>
      <span className="footer-wordmark" aria-hidden="true">{[...'grostage®'].map((c, i) => <span key={i} style={{ '--i': i }}>{c}</span>)}</span>
      <div className="f-bot"><span>{f.copyright}</span><Link href="/admin">Admin</Link></div>
    </div></footer>
  );
}
