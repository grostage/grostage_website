import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

export const ALLOWED_DOCUMENT_MIME_TYPES = new Set([
  'application/pdf',
]);

const MIME_BY_EXT = {
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
};

const MAGIC_SIGNATURES = {
  'image/jpeg': bytes => bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  'image/png': bytes => bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
  'image/webp': bytes => bytes.length >= 12 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP',
  'application/pdf': bytes => bytes.length >= 5 && bytes.subarray(0, 5).toString('ascii') === '%PDF-',
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
  return typeof filename === 'string' && /^[a-z0-9][a-z0-9._-]{0,120}\.(?:webp|jpg|jpeg|png|pdf)$/i.test(filename);
}

/** Generates a collision-free safe filename preserving a sanitized stem and enforced extension. */
export function buildStoredFilename(originalName = 'upload', ext = 'webp') {
  const safeExt = /^[a-z0-9]+$/i.test(ext) ? ext.toLowerCase() : 'webp';
  const fallbackStem = safeExt === 'pdf' ? 'document' : 'image';
  const stem = path.basename(String(originalName || fallbackStem), path.extname(String(originalName || '')))
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 48) || fallbackStem;
  return `${stem}-${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${safeExt}`;
}

export function hasAllowedImageSignature(bytes, mimeType) {
  const matcher = MAGIC_SIGNATURES[mimeType];
  return Boolean(matcher && Buffer.isBuffer(bytes) && matcher(bytes));
}

export const hasAllowedUploadSignature = hasAllowedImageSignature;

export function getContentTypeForFilename(filename) {
  if (!isSafeUploadFilename(filename)) return null;
  const ext = path.extname(filename).toLowerCase();
  return MIME_BY_EXT[ext] || null;
}

