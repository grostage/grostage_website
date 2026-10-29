import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import crypto from 'node:crypto';

const key = () => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured');
  return new TextEncoder().encode(process.env.JWT_SECRET);
};

export const signToken = (payload = { a: 1 }) =>
  new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('7d').sign(key());

export async function isAdmin() {
  try {
    const c = (await cookies()).get('gs_admin')?.value;
    if (!c) return false;
    await jwtVerify(c, key());
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
  if (!storedHash || !password) return false;
  try {
    if (storedHash.includes(':')) {
      const [salt, keyHex] = storedHash.split(':');
      const keyBuffer = Buffer.from(keyHex, 'hex');
      const derivedKey = crypto.scryptSync(password, salt, 64);
      return crypto.timingSafeEqual(keyBuffer, derivedKey);
    }
  } catch {
    return false;
  }
  return password === storedHash;
}
