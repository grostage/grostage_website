import { q } from '@/backend/lib/db';
import { isAdmin } from '@/backend/lib/auth';
import { getFooter } from '@/backend/lib/footer';
import { isSameOrigin, sanitizeEmail, sanitizeHref, sanitizePhone } from '@/backend/lib/security';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json(await getFooter());
}

function sanitizeLinkList(value) {
  if (!Array.isArray(value)) return [];
  const items = [];
  for (const link of value) {
    const label = String(link?.label || '').trim().slice(0, 120);
    const rawHref = String(link?.value || '').trim();
    if (!label && !rawHref) continue;
    if (!label || !rawHref) return null;
    const safeUrl = sanitizeHref(rawHref, { allowRelative: true, allowBareDomain: false });
    if (!safeUrl) return null;
    items.push({ label, value: safeUrl });
  }
  return items;
}

export async function PUT(req) {
  if (!isSameOrigin(req)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  if (!(await isAdmin())) return Response.json({}, { status: 401 });
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return Response.json({ error: 'Invalid footer data.' }, { status: 400 });
    }

    const email = sanitizeEmail(body.email);
    if (email === null) return Response.json({ error: 'Enter a valid contact email address.' }, { status: 400 });
    const phone = sanitizePhone(body.phone);
    if (phone === null) return Response.json({ error: 'Enter a valid phone number.' }, { status: 400 });
    const links = sanitizeLinkList(body.links);
    if (!links) return Response.json({ error: 'Footer links must use https://, http://, or a /path.' }, { status: 400 });
    const socials = sanitizeLinkList(body.socials);
    if (!socials) return Response.json({ error: 'Social links must use https://, http://, or a /path.' }, { status: 400 });

    const cleaned = {
      tagline: String(body.tagline || '').trim().slice(0, 300),
      email,
      phone,
      address: String(body.address || '').trim().slice(0, 500),
      copyright: String(body.copyright || '').trim().slice(0, 300),
      links,
      socials,
    };

    await q(
      "INSERT INTO settings(key,value) VALUES('footer',$1::jsonb) ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value",
      [JSON.stringify(cleaned)]
    );
    revalidatePath('/', 'layout');
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Footer save failed', error);
    return Response.json({ error: 'Footer could not be saved. Check the database connection.' }, { status: 503 });
  }
}
