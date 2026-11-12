import { q } from '@/backend/lib/db';
import { ensureContactsTable } from '@/backend/lib/contacts';

export async function POST(req) {
  try {
    const body = await req.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const title = String(body.title || '').trim();
    const message = String(body.message || '').trim();
    if (!name || !email || !title || !message) return Response.json({ error: 'All fields required' }, { status: 400 });
    if (name.length > 150 || email.length > 254 || title.length > 200 || message.length > 10000 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Please check the submitted details' }, { status: 400 });
    }
    await ensureContactsTable();
    await q('INSERT INTO contacts(name,email,title,message) VALUES($1,$2,$3,$4)', [name, email, title, message]);
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error('Contact submission failed', error);
    return Response.json({ error: 'Unable to save your message right now' }, { status: 503 });
  }
}
