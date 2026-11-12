import { signToken, verifyPassword, revokeToken, timingSafeStringEqual } from '@/backend/lib/auth';
import { q } from '@/backend/lib/db';
import { checkRateLimit, getClientIp, isSameOrigin } from '@/backend/lib/security';
import { cookies } from 'next/headers';

const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export async function POST(req) {
  if (!isSameOrigin(req)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { email, password } = await req.json().catch(() => ({}));
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    return Response.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const cleanEmail = email.trim().toLowerCase();
  const ip = getClientIp(req);
  const ipLimit = checkRateLimit({ namespace: 'login-ip', key: ip, limit: 30, windowMs: LOGIN_WINDOW_MS });
  const accountLimit = checkRateLimit({ namespace: 'login-acct', key: `${ip}:${cleanEmail}`, limit: 10, windowMs: LOGIN_WINDOW_MS });

  if (!ipLimit.allowed || !accountLimit.allowed) {
    const retryAfter = Math.max(ipLimit.retryAfterSeconds || 0, accountLimit.retryAfterSeconds || 0);
    return Response.json(
      { error: 'Too many login attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  let authenticated = false;
  let hasDbAdmins = false;

  // 1. Check PostgreSQL `admins` table; when seeded, disallow env fallback.
  try {
    const countRows = await q('SELECT count(*)::int AS cnt FROM admins');
    hasDbAdmins = (countRows[0]?.cnt || 0) > 0;
    if (hasDbAdmins) {
      const rows = await q('SELECT password_hash FROM admins WHERE LOWER(email) = $1 LIMIT 1', [cleanEmail]);
      if (rows.length > 0 && verifyPassword(password, rows[0].password_hash)) {
        authenticated = true;
      }
    }
  } catch (err) {
    console.warn('Admins table check failed:', err.message);
  }

  // 2. Fallback strictly for unseeded bootstrap environments when explicit env credentials exist.
  if (!authenticated && !hasDbAdmins && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const envEmail = process.env.ADMIN_EMAIL.trim().toLowerCase();
    const envPassword = process.env.ADMIN_PASSWORD;
    if (timingSafeStringEqual(cleanEmail, envEmail) && timingSafeStringEqual(password, envPassword)) {
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

export async function DELETE(req) {
  if (!isSameOrigin(req)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  const cookieStore = await cookies();
  await revokeToken(cookieStore.get('gs_admin')?.value);
  cookieStore.delete('gs_admin');
  return Response.json({ ok: true });
}
