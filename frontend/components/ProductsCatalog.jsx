'use client';
import Link from 'next/link';
import Magnetic from './Magnetic';
import { chapters, safeProductUrl, formatUrlLabel } from '@/frontend/lib/render';

export default function ProductsCatalog({ products = [] }) {
  return (
    <section className="rx rx-light rx-products" data-nav-theme="light">
      <div className="rx-products-head">
        <div>
          <p className="rx-kicker" data-rx>In-House Platforms</p>
          <h2 data-rx style={{ '--d': 1 }}>
            Software built to<br />
            <span className="rx-accent">run real operations.</span>
          </h2>
        </div>
        <p className="rx-products-lead" data-rx style={{ '--d': 2 }}>
          Beyond client engagements, Grostage engineers proprietary back-office platforms and vertical software systems designed for reliability, auditability, and everyday speed.
        </p>
      </div>

      <div className="rx-products-list">
        {products.map((product, index) => {
          const num = String(index + 1).padStart(2, '0');
          const { list } = chapters(product.content);
          const externalUrl = safeProductUrl(product.url);

          return (
            <article
              key={product.slug || product.id}
              className={`rx-product-card${index % 2 === 1 ? ' is-reversed' : ''}`}
              data-rx
            >
              <Link href={`/products/${product.slug}`} className="rx-product-media" data-cursor="Explore">
                <img
                  src={product.image || '/projects/work-placeholder.svg'}
                  alt={product.imageAlt || `${product.title} interface showcase`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <span className="rx-product-badge">{num} / PRODUCT</span>
              </Link>

              <div className="rx-product-copy">
                {product.category && (
                  <p className="rx-product-cat">{product.category}</p>
                )}
                <h3>
                  <Link href={`/products/${product.slug}`}>{product.title}</Link>
                </h3>
                {product.excerpt && (
                  <p className="rx-product-excerpt">{product.excerpt}</p>
                )}

                {list.length > 0 && (
                  <div className="rx-product-modules">
                    <span className="rx-product-modules-label">Key modules</span>
                    <ul>
                      {list.slice(0, 5).map(ch => (
                        <li key={ch.title}>{ch.title}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.tags?.length > 0 && (
                  <ul className="rx-tags">
                    {product.tags.map(tag => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                )}

                <div className="rx-product-actions">
                  <Magnetic strength={0.2}>
                    <Link href={`/products/${product.slug}`} className="rx-product-btn">
                      Explore {product.title} <span aria-hidden="true">→</span>
                    </Link>
                  </Magnetic>
                  {externalUrl && (
                    <a
                      href={externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rx-product-demo"
                    >
                      Visit {formatUrlLabel(externalUrl)} <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}

        {!products.length && (
          <div className="rx-products-empty">
            <p>No published products yet. Add products from the admin portal to showcase them here.</p>
          </div>
        )}
      </div>
    </section>
  );
}

