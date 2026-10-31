import { v2 as cloudinary } from 'cloudinary'; import { isAdmin } from '@/backend/lib/auth';
cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const signatures = {
  'image/jpeg': bytes => bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  'image/png': bytes => bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
  'image/webp': bytes => bytes.length >= 12 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP',
};

export async function POST(req) {
  if (!(await isAdmin())) return Response.json({}, { status: 401 });
  const contentLength = Number(req.headers.get('content-length') || 0);
  if (contentLength > MAX_IMAGE_BYTES + 64 * 1024) return Response.json({ error: 'Image must be 5 MB or smaller.' }, { status: 413 });
  let file;
  try { file = (await req.formData()).get('file'); } catch { return Response.json({ error: 'Invalid image upload.' }, { status: 400 }); }
  if (!file || typeof file.arrayBuffer !== 'function') return Response.json({ error: 'No image file was provided.' }, { status: 400 });
  if (file.size > MAX_IMAGE_BYTES) return Response.json({ error: 'Image must be 5 MB or smaller.' }, { status: 413 });
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) return Response.json({ error: 'Image uploads are not configured' }, { status: 503 });
  const buf = Buffer.from(await file.arrayBuffer());
  const signatureMatches = signatures[file.type];
  if (!signatureMatches || !signatureMatches(buf)) return Response.json({ error: 'Upload a valid JPEG, PNG, or WebP image.' }, { status: 400 });
  try {
    const url = await new Promise((res, rej) => cloudinary.uploader.upload_stream({ folder: 'grostage', resource_type: 'image', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], max_bytes: MAX_IMAGE_BYTES }, (e, r) => e ? rej(e) : res(r?.secure_url)).end(buf));
    if (!url) return Response.json({ error: 'Image upload failed. Please try again.' }, { status: 502 });
    return Response.json({ url });
  } catch {
    return Response.json({ error: 'Image upload failed. Please try again.' }, { status: 502 });
  }
}
