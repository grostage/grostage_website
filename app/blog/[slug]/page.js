import Link from 'next/link';
import { notFound } from 'next/navigation';
import { q } from '@/backend/lib/db';
import { samplePosts } from '@/backend/lib/content';
import { chapters } from '@/frontend/lib/render';
import StageDivider from '@/frontend/components/StageDivider';
import CTA from '@/frontend/components/CTA';
import ReadingProgress from '@/frontend/components/ReadingProgress';
import { CaseGallery } from '@/frontend/components/CaseStudy';
export const dynamic = 'force-dynamic';
async function getPost(slug) { try { return (await q('SELECT * FROM posts WHERE slug=$1 AND published', [slug]))[0]; } catch { return samplePosts.find(p => p.slug === slug); } }
export async function generateMetadata({ params }) { const p = await getPost((await params).slug); return { title: p ? p.title + ' — Grostage' : 'Article not found — Grostage' }; }
export default async function Post({ params }) {
  const p = await getPost((await params).slug); if (!p) notFound();
  const { intro, list } = chapters(p.content);
  const minutes = Math.max(1, Math.round(String(p.content || '').split(/\s+/).length / 220));
  return <main id="main-content" className="cs">
    <ReadingProgress target=".ar-body" />
    <section className="ar-hero" data-nav-theme="dark">
      <Link href="/blog" className="cs-back"><span aria-hidden="true">←</span> Back to journal</Link>
      <p className="cs-label">{p.category || 'Insights'} · {new Date(p.created_at).toLocaleDateString('en-GB', { dateStyle: 'long', timeZone: 'UTC' })} · {minutes} min read</p>
      <h1 className="ar-title"><span className="rx-line"><span>{p.title}</span></span></h1>
      {p.excerpt && <p className="ar-lead">{p.excerpt}</p>}
      {p.sample && <p className="rx-note ar-note">Sample editorial · Adapted from the company profile</p>}
    </section>
    {p.image && <CaseGallery image={p.image} alt={p.title} />}
    <StageDivider from="#060908" to="#f0f3ef" />
    <article className="ar-body" data-nav-theme="light">
      {intro.map((t, i) => <p key={i} className={i === 0 ? 'ar-first' : ''} data-rx>{t}</p>)}
      {list.map(c => <section key={c.title}><h2 data-rx>{c.title}</h2>{c.body.map((t, n) => <p key={n} data-rx>{t}</p>)}</section>)}
    </article>
    <StageDivider from="#f0f3ef" to="#060908" flip />
    <CTA />
  </main>;
}
