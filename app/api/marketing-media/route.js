import { isAdmin } from '@/backend/lib/auth';
import { q } from '@/backend/lib/db';
import { marketingMediaById, isValidCloudinaryImageUrl } from '@/backend/lib/marketing-media-config';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const rows = await q("SELECT value FROM settings WHERE key='marketing_media'");
    const stored = rows[0]?.value;
    const overrides = stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
    return Response.json(Object.fromEntries(Object.entries(marketingMediaById).map(([id, item]) => [id,
      isValidCloudinaryImageUrl(overrides[id]) ? overrides[id] : item.defaultUrl])));
  } catch {
    return Response.json({ error: 'Marketing media settings are unavailable.' }, { status: 503 });
  }
}

export async function PUT(request) {
  if (!(await isAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) return Response.json({ error: 'Invalid request data.' }, { status: 400 });
    const { id, url } = body;
    if (typeof id !== 'string' || !marketingMediaById[id]) return Response.json({ error: 'Unknown marketing image.' }, { status: 400 });
    if (!isValidCloudinaryImageUrl(url)) return Response.json({ error: 'Provide a valid Cloudinary HTTPS image URL.' }, { status: 400 });
    await q(`INSERT INTO settings(key, value) VALUES('marketing_media', jsonb_build_object($1::text, $2::text))
      ON CONFLICT(key) DO UPDATE SET value = CASE WHEN jsonb_typeof(settings.value) = 'object'
        THEN settings.value || EXCLUDED.value ELSE EXCLUDED.value END`, [id, url]);
    revalidatePath('/marketing-services');
    return Response.json({ ok: true, id, url });
  } catch {
    return Response.json({ error: 'Image reference could not be saved. Please try again.' }, { status: 503 });
  }
}

export async function DELETE(request) {
  if (!(await isAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const id = body?.id;
    if (typeof id !== 'string' || !marketingMediaById[id]) return Response.json({ error: 'Unknown marketing image.' }, { status: 400 });
    await q(`INSERT INTO settings(key, value) VALUES('marketing_media', '{}'::jsonb)
      ON CONFLICT(key) DO UPDATE SET value = CASE WHEN jsonb_typeof(settings.value) = 'object'
        THEN settings.value - $1::text ELSE '{}'::jsonb END`, [id]);
    revalidatePath('/marketing-services');
    return Response.json({ ok: true, id, url: marketingMediaById[id].defaultUrl });
  } catch {
    return Response.json({ error: 'Image could not be reset. Please try again.' }, { status: 503 });
  }
}
