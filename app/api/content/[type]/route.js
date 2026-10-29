import { q } from '@/backend/lib/db'; import { isAdmin } from '@/backend/lib/auth';
import { ensureWorksTable, getWorks } from '@/backend/lib/content';
const slugify = s => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const ok = t => ['posts', 'pages', 'works'].includes(t);
export async function GET(_, { params }) {
  const { type } = await params; if (!ok(type)) return Response.json({ error: 'Unknown content type' }, { status: 404 });
  if (type === 'works') {
    if (!(await isAdmin())) return Response.json({}, { status: 401 });
    return Response.json(await getWorks({ includeDrafts: true }));
  }
  try { return Response.json(await q(`SELECT * FROM ${type} ORDER BY created_at DESC`)); }
  catch (error) { console.error('Content read failed', error); return Response.json({ error: 'Content is unavailable' }, { status: 503 }); }
}
export async function POST(req, { params }) {
  const { type } = await params; if (!ok(type) || !(await isAdmin())) return Response.json({}, { status: 401 });
  const b = await req.json().catch(() => ({}));
  if (!String(b.title || '').trim()) return Response.json({ error: 'Title is required' }, { status: 400 });
  try {
    if (type === 'works') {
      await ensureWorksTable();
      const tags = Array.isArray(b.tags) ? b.tags.join(', ') : String(b.tags || '');
      const r = await q(`INSERT INTO works(title,slug,category,excerpt,content,image,tags,published) VALUES($1,$2,$3,$4,$5,$6,$7,true) RETURNING *`, [b.title, slugify(b.slug || b.title), b.category || '', b.excerpt || '', b.content || '', b.image || '', tags]);
      return Response.json(r[0]);
    }
    const r = await q(`INSERT INTO ${type}(title,slug,excerpt,content,image,published) VALUES($1,$2,$3,$4,$5,true) RETURNING *`, [b.title, slugify(b.slug || b.title), b.excerpt || '', b.content || '', b.image || '']);
    return Response.json(r[0]);
  } catch (e) { console.error('Content create failed', e); return Response.json({ error: 'Content could not be saved. Check the database connection.' }, { status: 503 }); }
}
