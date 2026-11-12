import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const MIME_BY_EXT = {
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
};

const MAGIC_SIGNATURES = {
  'image/jpeg': bytes => bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  'image/png': bytes => bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
  'image/webp': bytes => bytes.length >= 12 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP',
};

/** Resolves the persistent uploads directory inside the application root (e.g. /var/www/grostage_website/uploads). */
export function getUploadsDir() {
  if (process.env.UPLOAD_DIR) {
    return path.resolve(process.env.UPLOAD_DIR);
  }
  const cwd = process.cwd();
  const rootDir = path.basename(cwd) === 'standalone' && path.basename(path.dirname(cwd)) === '.next'
    ? path.resolve(cwd, '..', '..')
    : cwd;
  return path.join(rootDir, 'uploads');
}

export async function ensureUploadsDir() {
  const dir = getUploadsDir();
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

/** Validates stored upload filenames strictly to prevent path traversal or unsafe file types. */
export function isSafeUploadFilename(filename) {
  return typeof filename === 'string' && /^[a-z0-9][a-z0-9._-]{0,120}\.(?:webp|jpg|jpeg|png)$/i.test(filename);
}

/** Generates a collision-free safe WebP filename preserving a sanitized stem from the original filename. */
export function buildStoredFilename(originalName = 'image') {
  const stem = path.basename(String(originalName || 'image'), path.extname(String(originalName || '')))
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 48) || 'image';
  return `${stem}-${Date.now()}-${crypto.randomBytes(6).toString('hex')}.webp`;
}

export function hasAllowedImageSignature(bytes, mimeType) {
  const matcher = MAGIC_SIGNATURES[mimeType];
  return Boolean(matcher && Buffer.isBuffer(bytes) && matcher(bytes));
}

export function getContentTypeForFilename(filename) {
  if (!isSafeUploadFilename(filename)) return null;
  const ext = path.extname(filename).toLowerCase();
  return MIME_BY_EXT[ext] || null;
}

