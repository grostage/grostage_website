'use client';
import { useState } from 'react';
import Link from 'next/link';

const date = d => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });

export default function JournalGrid({ posts }) {
  const [featured, ...rest] = posts;
  const cats = ['All', ...new Set(rest.map(p => p.category || 'Insights'))];
  const [cat, setCat] = useState('All');
  const shown = rest.filter(p => cat === 'All' || (p.category || 'Insights') === cat);
  if (!featured) return <p className="rx-empty">New perspectives are on the way.</p>;
  return <>
    <section className="rx rx-light rx-journal">
      <Link href={'/blog/' + featured.slug} className="rx-feature" data-cursor="Read" data-rx>
        <div className="rx-feature-media">{featured.image && <img src={featured.image} alt="" />}</div>
        <div className="rx-feature-copy">
          <p className="rx-meta"><span>{featured.category || 'Insights'}</span><span>{date(featured.created_at)}</span></p>
          <h2>{featured.title}</h2><p>{featured.excerpt}</p>
          <span className="rx-read">Read the story <b aria-hidden="true">↗</b></span>
        </div>
      </Link>
      {rest.length > 0 && <>
        <div className="rx-chips" role="group" aria-label="Filter articles">{cats.map(c => <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}</div>
        <div className="rx-posts">{shown.map((p, i) => <Link key={p.slug} href={'/blog/' + p.slug} className="rx-post" data-cursor="Read" style={{ '--d': i }}>
          <div className="rx-post-media">{p.image && <img src={p.image} alt="" loading="lazy" />}<span aria-hidden="true">↗</span></div>
          <p className="rx-meta"><span>{p.category || 'Insights'}</span><span>{date(p.created_at)}</span></p>
          <h3>{p.title}</h3><p>{p.excerpt}</p>
        </Link>)}</div>
      </>}
    </section>
  </>;
}
