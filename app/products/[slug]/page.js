import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/backend/lib/content';
import { chapters, safeDocumentUrl, safeProductUrl, formatUrlLabel } from '@/frontend/lib/render';
import StageDivider from '@/frontend/components/StageDivider';
import CTA from '@/frontend/components/CTA';
import ReadingProgress from '@/frontend/components/ReadingProgress';
import TextFill from '@/frontend/components/TextFill';
import { CaseHero, CaseGallery } from '@/frontend/components/CaseStudy';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: 'Product not found — Grostage' };
  return {
    title: `${product.title} — Our Products — Grostage`,
    description: product.excerpt || `${product.title}: ${product.category}.`,
    openGraph: {
      title: `${product.title} — Grostage`,
      description: product.excerpt || `${product.title}: ${product.category}.`,
      url: `https://grostage.com/products/${slug}`,
      images: product.image ? [{ url: product.image, width: 1200, height: 630, alt: product.title }] : [],
    },
    alternates: { canonical: `https://grostage.com/products/${slug}` },
  };
}

export default async function ProductDetail({ params }) {
  const { slug } = await params;
  const products = await getProducts();
  const index = products.findIndex(product => product.slug === slug);
  if (index < 0) notFound();

  const product = products[index];
  const next = products.length > 1 ? products[(index + 1) % products.length] : null;
  const { intro, list } = chapters(product.content);
  const number = String(index + 1).padStart(2, '0');
  const externalUrl = safeProductUrl(product.url);
  const documentUrl = safeDocumentUrl(product.document);

  return (
    <main id="main-content" className="cs">
      <ReadingProgress />
      <CaseHero image={product.image || '/projects/work-placeholder.svg'} alt={product.imageAlt || `${product.title} platform`}>
        <Link href="/products" className="cs-back"><span aria-hidden="true">←</span> All products</Link>
        <p className="cs-label">Product {number} / {String(products.length).padStart(2, '0')} · {product.category}</p>
        <h1 className="cs-title"><span className="rx-line"><span>{product.title}</span></span></h1>
        <ul className="cs-tags">{product.tags.map((tag, i) => <li key={tag} style={{ '--d': i }}>{tag}</li>)}</ul>
      </CaseHero>

      <StageDivider from="#060908" to="#f0f3ef" />
      <section className="cs-overview cs-product-overview" data-nav-theme="light">
        <p className="cs-kicker" data-rx>The platform</p>
        <TextFill className="cs-statement" text={product.excerpt || product.title} />
        <dl className="cs-facts">
          <div data-rx><dt>Category</dt><dd>{product.category}</dd></div>
          <div data-rx style={{ '--d': 1 }}><dt>Core capabilities</dt><dd>{product.tags.join(', ')}</dd></div>
          <div data-rx style={{ '--d': 2 }}><dt>Product</dt><dd>{number} of {String(products.length).padStart(2, '0')} · Built by Grostage</dd></div>
        </dl>
        {(externalUrl || documentUrl) && (
          <div className="cs-product-cta" data-rx style={{ '--d': 3 }}>
            {externalUrl && (
              <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="rx-product-btn">
                Visit {formatUrlLabel(externalUrl)} <span aria-hidden="true">↗</span>
              </a>
            )}
            {documentUrl && (
              <>
                <a href={documentUrl} target="_blank" rel="noopener noreferrer" className="rx-product-btn rx-product-btn-ghost">
                  Product Brochure (PDF) <span aria-hidden="true">↗</span>
                </a>
                <a href={documentUrl} download className="rx-product-demo">
                  Download PDF <span aria-hidden="true">↓</span>
                </a>
              </>
            )}
          </div>
        )}
      </section>

      <section className="cs-story" data-nav-theme="light">
        {intro.length > 0 && <div className="cs-intro" data-rx>{intro.map((p, i) => <p key={i}>{p}</p>)}</div>}
        {list.map((c, i) => (
          <article className="cs-chapter" key={c.title}>
            <div className="cs-chapter-head"><span>{String(i + 1).padStart(2, '0')}</span><h2 data-rx>{c.title}</h2></div>
            <div className="cs-chapter-body">{c.body.map((p, n) => <p key={n} data-rx style={{ '--d': n + 1 }}>{p}</p>)}</div>
          </article>
        ))}
      </section>

      <StageDivider from="#f0f3ef" to="#060908" flip />
      {product.gallery && <CaseGallery image={product.gallery} alt={`${product.title} gallery`} />}

      {next && (
        <Link href={`/products/${next.slug}`} className="cs-next" data-nav-theme="dark" data-cursor="Next">
          <img src={next.image || '/projects/work-placeholder.svg'} alt="" aria-hidden="true" loading="lazy" />
          <span className="cs-next-label">Next product</span>
          <span className="cs-next-title">{next.title}</span>
          <span className="cs-next-cat">{next.category}</span>
          <span className="cs-next-arrow" aria-hidden="true">↗</span>
          <span className="cs-next-fill" aria-hidden="true" />
        </Link>
      )}
      <CTA />
    </main>
  );
}

