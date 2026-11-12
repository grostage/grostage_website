import { q } from '@/backend/lib/db';
import { isAdmin } from '@/backend/lib/auth';
import { ensureWorksTable, ensureProductsTable } from '@/backend/lib/content';
import { isSameOrigin, sanitizeHref, sanitizeImageSrc, slugifySafe } from '@/backend/lib/security';

const ok = t => ['posts', 'pages', 'works', 'products'].includes(t);
const ensureByType = { works: ensureWorksTable, products: ensureProductsTable };

export async function PUT(req, { params }) {
  const { type, id } = await params;
  if (!isSameOrigin(req)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  if (!ok(type) || !(await isAdmin())) return Response.json({}, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const title = String(b.title || '').trim();
  const slug = slugifySafe(b.slug || title);
  if (!title || !slug) return Response.json({ error: 'A valid title and slug are required' }, { status: 400 });

  const image = sanitizeImageSrc(b.image);
  if (image === null) return Response.json({ error: 'Provide a valid HTTPS image URL or /path (wait for upload to finish).' }, { status: 400 });

  const url = ensureByType[type] ? sanitizeHref(b.url, { allowRelative: false, allowBareDomain: true }) : '';
  if (url === null) return Response.json({ error: 'Product website URL must use https:// or http://' }, { status: 400 });

  try {
    if (ensureByType[type]) {
      await ensureByType[type]();
      const tags = Array.isArray(b.tags) ? b.tags.join(', ') : String(b.tags || '');
      const r = await q(
        `UPDATE ${type} SET title=$1,slug=$2,category=$3,excerpt=$4,content=$5,image=$6,tags=$7,url=$8,published=true WHERE id=$9 RETURNING *`,
        [title, slug, String(b.category || ''), String(b.excerpt || ''), String(b.content || ''), image, tags, url, id]
      );
      if (!r.length) return Response.json({ error: 'Item not found' }, { status: 404 });
      return Response.json(r[0]);
    }
    const r = await q(
      `UPDATE ${type} SET title=$1,slug=$2,excerpt=$3,content=$4,image=$5,published=true WHERE id=$6 RETURNING *`,
      [title, slug, String(b.excerpt || ''), String(b.content || ''), image, id]
    );
    if (!r.length) return Response.json({ error: 'Item not found' }, { status: 404 });
    return Response.json(r[0]);
  } catch (e) {
    console.error('Content update failed', e);
    return Response.json({ error: 'Content could not be saved. Check the database connection.' }, { status: 503 });
  }
}

export async function DELETE(req, { params }) {
  const { type, id } = await params;
  if (!isSameOrigin(req)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  if (!ok(type) || !(await isAdmin())) return Response.json({}, { status: 401 });
  try {
    if (ensureByType[type]) await ensureByType[type]();
    const rows = await q(`DELETE FROM ${type} WHERE id=$1 RETURNING id`, [id]);
    if (!rows.length) return Response.json({ error: 'Content not found' }, { status: 404 });
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Content delete failed', error);
    return Response.json({ error: 'Content could not be deleted. Check the database connection.' }, { status: 503 });
  }
}
