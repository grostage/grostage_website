export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function canvasToBlob(canvas, type, quality) {
  return new Promise(resolve => canvas.toBlob(resolve, type, quality));
}

async function decodeImage(file) {
  if (typeof createImageBitmap === 'function') {
    const bitmap = await createImageBitmap(file);
    return {
      source: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      cleanup: () => bitmap.close?.(),
    };
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error('Could not read the selected image.'));
      element.src = url;
    });
    return {
      source: img,
      width: img.naturalWidth || img.width,
      height: img.naturalHeight || img.height,
      cleanup: () => URL.revokeObjectURL(url),
    };
  } catch (err) {
    URL.revokeObjectURL(url);
    throw err;
  }
}

/**
 * Validates the 10 MB limit and supported MIME types, then lightly resizes/compresses
 * the image in-browser before uploading so server bandwidth stays fast.
 */
export async function compressImageForUpload(file, { maxDimension = 1920, quality = 0.85 } = {}) {
  if (!file) throw new Error('No image file was provided.');
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error('Choose a valid JPEG, PNG, or WebP image.');
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('Image must be 10 MB or smaller.');
  }

  let decoded;
  try {
    decoded = await decodeImage(file);
    const { source, width, height } = decoded;
    if (!width || !height) return file;

    const longestSide = Math.max(width, height);
    const scale = longestSide > maxDimension ? maxDimension / longestSide : 1;
    const targetWidth = Math.max(1, Math.round(width * scale));
    const targetHeight = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;

    ctx.drawImage(source, 0, 0, targetWidth, targetHeight);
    const blob = await canvasToBlob(canvas, 'image/webp', quality);
    if (!blob) return file;

    // Keep the original file if re-encoding didn't shrink it and no resize happened.
    if (scale === 1 && blob.size >= file.size) {
      return file;
    }

    const baseName = (file.name || 'image').replace(/\.[^.]+$/, '') || 'image';
    return new File([blob], `${baseName}.webp`, { type: blob.type || 'image/webp' });
  } catch (err) {
    if (err instanceof Error && err.message.includes('10 MB')) throw err;
    return file;
  } finally {
    decoded?.cleanup?.();
  }
}

