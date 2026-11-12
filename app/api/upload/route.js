import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import multer from 'multer';
import sharp from 'sharp';
import { isAdmin } from '@/backend/lib/auth';
import { isSameOrigin } from '@/backend/lib/security';
import {
  ALLOWED_DOCUMENT_MIME_TYPES,
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_UPLOAD_BYTES,
  buildStoredFilename,
  ensureUploadsDir,
  hasAllowedUploadSignature,
} from '@/backend/lib/uploads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UPLOAD_MODES = {
  image: {
    allowedMimes: ALLOWED_IMAGE_MIME_TYPES,
    sizeError: 'Image must be 10 MB or smaller.',
    typeError: 'Upload a valid JPEG, PNG, or WebP image.',
    missingError: 'No image file was provided.',
    failError: 'Image upload failed. Please try again.',
  },
  document: {
    allowedMimes: ALLOWED_DOCUMENT_MIME_TYPES,
    sizeError: 'Document must be 10 MB or smaller.',
    typeError: 'Upload a valid PDF document.',
    missingError: 'No PDF document was provided.',
    failError: 'Document upload failed. Please try again.',
  },
};

function runMulterUpload(req, uploadsDir, mode) {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, _file, cb) => cb(null, `.tmp-${crypto.randomUUID()}`),
  });

  const uploader = multer({
    storage,
    limits: { fileSize: MAX_UPLOAD_BYTES, files: 1, fields: 8 },
    fileFilter: (_req, file, cb) => {
      if (!mode.allowedMimes.has(file.mimetype)) {
        const err = new Error(mode.typeError);
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

  const isDocument = new URL(req.url).searchParams.get('kind') === 'document';
  const mode = isDocument ? UPLOAD_MODES.document : UPLOAD_MODES.image;

  const contentLength = Number(req.headers.get('content-length') || 0);
  if (contentLength > MAX_UPLOAD_BYTES + 256 * 1024) {
    return Response.json({ error: mode.sizeError }, { status: 413 });
  }

  const contentType = req.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('multipart/form-data') || !req.body) {
    return Response.json({ error: mode.typeError }, { status: 400 });
  }

  const uploadsDir = await ensureUploadsDir();
  let tempFile = null;

  try {
    tempFile = await runMulterUpload(req, uploadsDir, mode);
    if (!tempFile) {
      return Response.json({ error: mode.missingError }, { status: 400 });
    }

    const rawBuffer = await fs.readFile(tempFile.path);
    if (rawBuffer.byteLength > MAX_UPLOAD_BYTES) {
      return Response.json({ error: mode.sizeError }, { status: 413 });
    }

    if (!hasAllowedUploadSignature(rawBuffer, tempFile.mimetype)) {
      return Response.json({ error: mode.typeError }, { status: 400 });
    }

    const finalFilename = buildStoredFilename(tempFile.originalname, isDocument ? 'pdf' : 'webp');
    const finalPath = path.join(uploadsDir, finalFilename);

    if (isDocument) {
      await fs.writeFile(finalPath, rawBuffer);
    } else {
      await sharp(rawBuffer)
        .rotate()
        .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 84, effort: 4 })
        .toFile(finalPath);
    }

    return Response.json({ url: `/uploads/${finalFilename}` });
  } catch (err) {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return Response.json({ error: mode.sizeError }, { status: 413 });
    }
    if (err instanceof multer.MulterError || err?.statusCode === 400) {
      return Response.json({ error: err.message || mode.typeError }, { status: 400 });
    }
    console.error(`Server ${isDocument ? 'document' : 'image'} upload failed:`, err);
    return Response.json({ error: mode.failError }, { status: 500 });
  } finally {
    if (tempFile?.path) {
      await fs.unlink(tempFile.path).catch(() => {});
    }
  }
}
