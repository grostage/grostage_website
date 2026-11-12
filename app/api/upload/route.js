import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import multer from 'multer';
import sharp from 'sharp';
import { isAdmin } from '@/backend/lib/auth';
import { isSameOrigin } from '@/backend/lib/security';
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_UPLOAD_BYTES,
  buildStoredFilename,
  ensureUploadsDir,
  hasAllowedImageSignature,
} from '@/backend/lib/uploads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function runMulterUpload(req, uploadsDir) {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, _file, cb) => cb(null, `.tmp-${crypto.randomUUID()}`),
  });

  const uploader = multer({
    storage,
    limits: { fileSize: MAX_UPLOAD_BYTES, files: 1, fields: 8 },
    fileFilter: (_req, file, cb) => {
      if (!ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype)) {
        const err = new Error('Upload a valid JPEG, PNG, or WebP image.');
        err.statusCode = 400;
        return cb(err);
      }
      cb(null, true);
    },
  }).single('file');

  return new Promise((resolve, reject) => {
    const nodeReq = Readable.fromWeb(req.body);
    nodeReq.headers = Object.fromEntries(req.headers.entries());
    nodeReq.method = req.method;
    nodeReq.url = req.url;

    uploader(nodeReq, {}, err => {
      if (err) {
        if (nodeReq.file?.path) {
          fs.unlink(nodeReq.file.path).catch(() => {});
        }
        return reject(err);
      }
      resolve(nodeReq.file || null);
    });
  });
}

export async function POST(req) {
  if (!isSameOrigin(req)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  if (!(await isAdmin())) return Response.json({}, { status: 401 });

  const contentLength = Number(req.headers.get('content-length') || 0);
  if (contentLength > MAX_UPLOAD_BYTES + 256 * 1024) {
    return Response.json({ error: 'Image must be 10 MB or smaller.' }, { status: 413 });
  }

  const contentType = req.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('multipart/form-data') || !req.body) {
    return Response.json({ error: 'Invalid image upload.' }, { status: 400 });
  }

  const uploadsDir = await ensureUploadsDir();
  let tempFile = null;

  try {
    tempFile = await runMulterUpload(req, uploadsDir);
    if (!tempFile) {
      return Response.json({ error: 'No image file was provided.' }, { status: 400 });
    }

    const rawBuffer = await fs.readFile(tempFile.path);
    if (rawBuffer.byteLength > MAX_UPLOAD_BYTES) {
      return Response.json({ error: 'Image must be 10 MB or smaller.' }, { status: 413 });
    }

    if (!hasAllowedImageSignature(rawBuffer, tempFile.mimetype)) {
      return Response.json({ error: 'Upload a valid JPEG, PNG, or WebP image.' }, { status: 400 });
    }

    const finalFilename = buildStoredFilename(tempFile.originalname);
    const finalPath = path.join(uploadsDir, finalFilename);

    await sharp(rawBuffer)
      .rotate()
      .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 84, effort: 4 })
      .toFile(finalPath);

    return Response.json({ url: `/uploads/${finalFilename}` });
  } catch (err) {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return Response.json({ error: 'Image must be 10 MB or smaller.' }, { status: 413 });
    }
    if (err instanceof multer.MulterError || err?.statusCode === 400) {
      return Response.json({ error: err.message || 'Upload a valid JPEG, PNG, or WebP image.' }, { status: 400 });
    }
    console.error('Server image upload failed:', err);
    return Response.json({ error: 'Image upload failed. Please try again.' }, { status: 500 });
  } finally {
    if (tempFile?.path) {
      await fs.unlink(tempFile.path).catch(() => {});
    }
  }
}
