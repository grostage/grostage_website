import { q } from '@/backend/lib/db'; import { isAdmin } from '@/backend/lib/auth';
import { ensureWorksTable } from '@/backend/lib/content';
const ok = t => ['posts', 'pages', 'works'].includes(t);
const slugify = s => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
export async function PUT(req, { params }) {
  const { type, id } = await params; if (!ok(type) || !(await isAdmin())) return Response.json({}, { status: 401 });
  const b = await req.json().catch(() => ({}));
  if (!String(b.title || '').trim()) return Response.json({ error: 'Title is required' }, { status: 400 });
  try {
    if (type === 'works') {
      await ensureWorksTable();
      const tags = Array.isArray(b.tags) ? b.tags.join(', ') : String(b.tags || '');
      const r = await q(`UPDATE works SET title=$1,slug=$2,category=$3,excerpt=$4,content=$5,image=$6,tags=$7,published=true WHERE id=$8 RETURNING *`, [b.title, slugify(b.slug || b.title), b.category || '', b.excerpt || '', b.content || '', b.image || '', tags, id]);
      if (!r.length) return Response.json({ error: 'Work not found' }, { status: 404 });
      return Response.json(r[0]);
    }
    const r = await q(`UPDATE ${type} SET title=$1,slug=$2,excerpt=$3,content=$4,image=$5,published=true WHERE id=$6 RETURNING *`, [b.title, slugify(b.slug || b.title), b.excerpt || '', b.content || '', b.image || '', id]);
    return Response.json(r[0]);
  } catch (e) { console.error('Content update failed', e); return Response.json({ error: 'Content could not be saved. Check the database connection.' }, { status: 503 }); }
}
export async function DELETE(_, { params }) {
  const { type, id } = await params; if (!ok(type) || !(await isAdmin())) return Response.json({}, { status: 401 });
  try {
    if (type === 'works') await ensureWorksTable();
    const rows = await q(`DELETE FROM ${type} WHERE id=$1 RETURNING id`, [id]);
    if (!rows.length) return Response.json({ error: 'Content not found' }, { status: 404 });
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Content delete failed', error);
    return Response.json({ error: 'Content could not be deleted. Check the database connection.' }, { status: 503 });
  }
}
