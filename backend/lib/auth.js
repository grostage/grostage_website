import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import crypto from 'node:crypto';
import { q } from './db';

const TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function getRevokedMemorySet() {
  if (!globalThis.__gsRevokedJtis) {
    globalThis.__gsRevokedJtis = new Set();
  }
  return globalThis.__gsRevokedJtis;
}

const key = () => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured');
  return new TextEncoder().encode(process.env.JWT_SECRET);
};

/** Constant-time string equality comparison via SHA-256 digests. */
export function timingSafeStringEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

export const signToken = (payload = {}) =>
  new SignJWT({ ...payload, role: 'admin', jti: crypto.randomUUID() })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key());

/** Records a logged-out token's jti in settings (plus memory fallback) until expiry. */
export async function revokeToken(token) {
  if (!token) return;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ['HS256'] });
    if (!payload?.jti) return;
    getRevokedMemorySet().add(payload.jti);

    const now = Date.now();
    const expMs = typeof payload.exp === 'number' ? payload.exp * 1000 : now + TOKEN_MAX_AGE_MS;
    const rows = await q(`SELECT value FROM settings WHERE key = 'revoked_jtis'`);
    const existing = rows[0]?.value && typeof rows[0].value === 'object' && !Array.isArray(rows[0].value)
      ? rows[0].value
      : {};
    const pruned = Object.fromEntries(
      Object.entries(existing).filter(([, expiresAt]) => Number(expiresAt) > now)
    );
    pruned[payload.jti] = expMs;

    await q(
      `INSERT INTO settings(key, value) VALUES('revoked_jtis', $1::jsonb)
       ON CONFLICT(key) DO UPDATE SET value = EXCLUDED.value`,
      [JSON.stringify(pruned)]
    );
  } catch {
    // Ignore invalid/expired tokens or transient DB unavailability during logout.
  }
}

async function isTokenRevoked(jti) {
  if (!jti) return false;
  if (getRevokedMemorySet().has(jti)) return true;
  try {
    const rows = await q(`SELECT value FROM settings WHERE key = 'revoked_jtis'`);
    const map = rows[0]?.value;
    if (map && typeof map === 'object' && Number(map[jti]) > Date.now()) {
      getRevokedMemorySet().add(jti);
      return true;
    }
  } catch {
    // Fall back to memory check if settings table is not initialized yet.
  }
  return false;
}

export async function isAdmin() {
  try {
    const c = (await cookies()).get('gs_admin')?.value;
    if (!c) return false;
    const { payload } = await jwtVerify(c, key(), { algorithms: ['HS256'] });
    if (payload?.role !== 'admin' || typeof payload?.email !== 'string') return false;
    if (await isTokenRevoked(payload.jti)) return false;

    try {
      const countRows = await q(`SELECT count(*)::int AS cnt FROM admins`);
      if (countRows[0]?.cnt > 0) {
        const match = await q(`SELECT 1 FROM admins WHERE LOWER(email) = $1 LIMIT 1`, [payload.email.trim().toLowerCase()]);
        if (!match.length) return false;
      }
    } catch {
      // Allow env-authenticated sessions when admins table has not been initialized yet.
    }

    return true;
  } catch {
    return false;
  }
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedHash) {
  if (typeof storedHash !== 'string' || typeof password !== 'string' || !storedHash || !password) return false;
  if (!storedHash.includes(':')) return false;
  try {
    const [salt, keyHex] = storedHash.split(':');
    if (!salt || !keyHex) return false;
    const keyBuffer = Buffer.from(keyHex, 'hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);
    if (keyBuffer.length !== derivedKey.length) return false;
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}
