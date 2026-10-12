import { notFound } from 'next/navigation';
import { q } from '@/backend/lib/db';
import { chapters } from '@/frontend/lib/render';
import ReadingProgress from '@/frontend/components/ReadingProgress';
import { CaseGallery } from '@/frontend/components/CaseStudy';
export const dynamic = 'force-dynamic';
export default async function Page({ params }) {
  const { slug } = await params; let p; try { p = (await q('SELECT * FROM pages WHERE slug=$1 AND published', [slug]))[0]; } catch {}
  if (!p) notFound();
  const { intro, list } = chapters(p.content);
  return <main id="main-content" className="cs">
    <ReadingProgress target=".ar-body" />
    <section className="ar-hero" data-nav-theme="dark"><h1 className="ar-title"><span className="rx-line"><span>{p.title}</span></span></h1></section>
    {p.image && <CaseGallery image={p.image} alt="" />}
    <article className="ar-body" data-nav-theme="light">
      {intro.map((t, i) => <p key={i} className={i === 0 ? 'ar-first' : ''} data-rx>{t}</p>)}
      {list.map(c => <section key={c.title}><h2 data-rx>{c.title}</h2>{c.body.map((t, n) => <p key={n} data-rx>{t}</p>)}</section>)}
    </article>
  </main>;
}
