import { signToken, verifyPassword } from '@/backend/lib/auth';
import { q } from '@/backend/lib/db';
import { cookies } from 'next/headers';

export async function POST(req) {
  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password) {
    return Response.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  let authenticated = false;

  // 1. Check PostgreSQL `admins` table
  try {
    const rows = await q('SELECT * FROM admins WHERE LOWER(email) = $1 LIMIT 1', [cleanEmail]);
    if (rows && rows.length > 0) {
      if (verifyPassword(password, rows[0].password_hash)) {
        authenticated = true;
      }
    }
  } catch (err) {
    console.warn('Admins table check fallback to env:', err.message);
  }

  // 2. Fallback to process.env credentials
  if (!authenticated) {
    const envEmail = (process.env.ADMIN_EMAIL || 'grostage@gmail.com').trim().toLowerCase();
    const envPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
    if (cleanEmail === envEmail && password === envPassword) {
      authenticated = true;
    }
  }

  if (!authenticated) {
    return Response.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  (await cookies()).set('gs_admin', await signToken({ email: cleanEmail }), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 604800,
  });

  return Response.json({ ok: true });
}

export async function DELETE() {
  (await cookies()).delete('gs_admin');
  return Response.json({ ok: true });
}
