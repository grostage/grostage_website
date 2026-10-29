import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getWork, getWorks } from '@/backend/lib/content';
import { chapters } from '@/frontend/lib/render';
import StageDivider from '@/frontend/components/StageDivider';
import CTA from '@/frontend/components/CTA';
import ReadingProgress from '@/frontend/components/ReadingProgress';
import TextFill from '@/frontend/components/TextFill';
import { CaseHero, CaseGallery } from '@/frontend/components/CaseStudy';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const work = await getWork(slug);
  if (!work) return { title: 'Project not found — Grostage' };
  return {
    title: `${work.title} — Grostage`,
    description: work.excerpt || `Discover how Grostage built ${work.title}: ${work.category}.`,
    openGraph: {
      title: `${work.title} — Grostage`,
      description: work.excerpt || `Discover how Grostage built ${work.title}: ${work.category}.`,
      url: `https://grostage.com/work/${slug}`,
      images: work.image ? [{ url: work.image, width: 1200, height: 630, alt: work.title }] : [],
    },
    alternates: { canonical: `https://grostage.com/work/${slug}` },
  };
}

export default async function WorkDetail({ params }) {
  const { slug } = await params;
  const works = await getWorks();
  const index = works.findIndex(work => work.slug === slug);
  if (index < 0) notFound();

  const work = works[index];
  const next = works[(index + 1) % works.length];
  const { intro, list } = chapters(work.content);
  const number = String(index + 1).padStart(2, '0');

  return <main id="main-content" className="cs">
    <ReadingProgress />
    <CaseHero image={work.image || '/projects/work-placeholder.svg'} alt={work.imageAlt || `${work.title} project`} contain={work.slug === 'custom-erp'}>
      <Link href="/work" className="cs-back"><span aria-hidden="true">←</span> All projects</Link>
      <p className="cs-label">Project {number} / {String(works.length).padStart(2, '0')} · {work.category}</p>
      <h1 className="cs-title"><span className="rx-line"><span>{work.title}</span></span></h1>
      <ul className="cs-tags">{work.tags.map((tag, i) => <li key={tag} style={{ '--d': i }}>{tag}</li>)}</ul>
    </CaseHero>

    <StageDivider from="#060908" to="#f0f3ef" />
    <section className="cs-overview" data-nav-theme="light">
      <p className="cs-kicker" data-rx>The idea</p>
      <TextFill className="cs-statement" text={work.excerpt || work.title} />
      <dl className="cs-facts">
        <div data-rx><dt>Category</dt><dd>{work.category}</dd></div>
        <div data-rx style={{ '--d': 1 }}><dt>What we did</dt><dd>{work.tags.join(', ')}</dd></div>
        <div data-rx style={{ '--d': 2 }}><dt>Project</dt><dd>{number} of {String(works.length).padStart(2, '0')}</dd></div>
      </dl>
      {work.representative && <p className="rx-note cs-note">Representative artwork from the company profile. Campaign imagery was not supplied.</p>}
    </section>

    <section className="cs-story" data-nav-theme="light">
      {intro.length > 0 && <div className="cs-intro" data-rx>{intro.map((p, i) => <p key={i}>{p}</p>)}</div>}
      {list.map((c, i) => <article className="cs-chapter" key={c.title}>
        <div className="cs-chapter-head"><span>{String(i + 1).padStart(2, '0')}</span><h2 data-rx>{c.title}</h2></div>
        <div className="cs-chapter-body">{c.body.map((p, n) => <p key={n} data-rx style={{ '--d': n + 1 }}>{p}</p>)}</div>
      </article>)}
    </section>

    <StageDivider from="#f0f3ef" to="#060908" flip />
    {work.gallery && <CaseGallery image={work.gallery} alt={`${work.title} project gallery`} />}

    <Link href={`/work/${next.slug}`} className="cs-next" data-nav-theme="dark" data-cursor="Next">
      <img src={next.image || '/projects/work-placeholder.svg'} alt="" aria-hidden="true" loading="lazy" />
      <span className="cs-next-label">Up next</span>
      <span className="cs-next-title">{next.title}</span>
      <span className="cs-next-cat">{next.category}</span>
      <span className="cs-next-arrow" aria-hidden="true">↗</span>
      <span className="cs-next-fill" aria-hidden="true" />
    </Link>
    <CTA />
  </main>;
}
