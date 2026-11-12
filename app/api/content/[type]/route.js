import { q } from '@/backend/lib/db';
import { isAdmin } from '@/backend/lib/auth';
import { ensureWorksTable, ensureProductsTable, getWorks, getProducts } from '@/backend/lib/content';
import { isSameOrigin, sanitizeHref, sanitizeImageSrc, slugifySafe } from '@/backend/lib/security';

const ok = t => ['posts', 'pages', 'works', 'products'].includes(t);
const structured = {
  works: { ensure: ensureWorksTable, list: getWorks },
  products: { ensure: ensureProductsTable, list: getProducts },
};

export async function GET(_, { params }) {
  const { type } = await params;
  if (!ok(type)) return Response.json({ error: 'Unknown content type' }, { status: 404 });
  if (!(await isAdmin())) return Response.json({}, { status: 401 });
  if (structured[type]) {
    return Response.json(await structured[type].list({ includeDrafts: true }));
  }
  try {
    return Response.json(await q(`SELECT * FROM ${type} ORDER BY created_at DESC`));
  } catch (error) {
    console.error('Content read failed', error);
    return Response.json({ error: 'Content is unavailable' }, { status: 503 });
  }
}

export async function POST(req, { params }) {
  const { type } = await params;
  if (!isSameOrigin(req)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  if (!ok(type) || !(await isAdmin())) return Response.json({}, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const title = String(b.title || '').trim();
  const slug = slugifySafe(b.slug || title);
  if (!title || !slug) return Response.json({ error: 'A valid title and slug are required' }, { status: 400 });

  const image = sanitizeImageSrc(b.image);
  if (image === null) return Response.json({ error: 'Provide a valid HTTPS image URL or /path (wait for upload to finish).' }, { status: 400 });

  const url = structured[type] ? sanitizeHref(b.url, { allowRelative: false, allowBareDomain: true }) : '';
  if (url === null) return Response.json({ error: 'Product website URL must use https:// or http://' }, { status: 400 });

  try {
    if (structured[type]) {
      await structured[type].ensure();
      const tags = Array.isArray(b.tags) ? b.tags.join(', ') : String(b.tags || '');
      const r = await q(
        `INSERT INTO ${type}(title,slug,category,excerpt,content,image,tags,url,published) VALUES($1,$2,$3,$4,$5,$6,$7,$8,true) RETURNING *`,
        [title, slug, String(b.category || ''), String(b.excerpt || ''), String(b.content || ''), image, tags, url]
      );
      return Response.json(r[0]);
    }
    const r = await q(
      `INSERT INTO ${type}(title,slug,excerpt,content,image,published) VALUES($1,$2,$3,$4,$5,true) RETURNING *`,
      [title, slug, String(b.excerpt || ''), String(b.content || ''), image]
    );
    return Response.json(r[0]);
  } catch (e) {
    console.error('Content create failed', e);
    return Response.json({ error: 'Content could not be saved. Check the database connection.' }, { status: 503 });
  }
}
