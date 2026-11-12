import fs from 'node:fs/promises';
import path from 'node:path';
import { getContentTypeForFilename, getUploadsDir, isSafeUploadFilename } from '@/backend/lib/uploads';

export const dynamic = 'force-dynamic';

export async function GET(_, { params }) {
  const { filename } = await params;
  if (!isSafeUploadFilename(filename)) {
    return new Response('Invalid filename', { status: 400 });
  }

  const contentType = getContentTypeForFilename(filename);
  if (!contentType) {
    return new Response('Unsupported media type', { status: 400 });
  }

  const uploadsDir = getUploadsDir();
  const resolved = path.resolve(uploadsDir, filename);
  if (!resolved.startsWith(`${uploadsDir}${path.sep}`)) {
    return new Response('Forbidden', { status: 403 });
  }

  try {
    const fileBuffer = await fs.readFile(resolved);
    const headers = {
      'Content-Type': contentType,
      'Content-Length': String(fileBuffer.byteLength),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    };
    if (contentType === 'application/pdf') {
      headers['Content-Disposition'] = 'inline';
    }
    return new Response(fileBuffer, { status: 200, headers });
  } catch (err) {
    if (err?.code === 'ENOENT') {
      return new Response('Not found', { status: 404 });
    }
    console.error('Failed to read uploaded file:', err);
    return new Response('Unable to read image', { status: 500 });
  }
}

