import { q } from '@/backend/lib/db';
import { isAdmin } from '@/backend/lib/auth';
import { ensureContactsTable } from '@/backend/lib/contacts';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await ensureContactsTable();
    return Response.json(await q('SELECT id,name,email,title,message,created_at FROM contacts ORDER BY created_at DESC'));
  } catch (error) {
    console.error('Contact list failed', error);
    return Response.json({ error: 'Contact submissions are unavailable' }, { status: 503 });
  }
}
