const RATE_LIMIT_CLEANUP_THRESHOLD = 1000;

function getRateStore() {
  if (!globalThis.__gsRateLimits) {
    globalThis.__gsRateLimits = new Map();
  }
  return globalThis.__gsRateLimits;
}

/** Extracts the client IP from trusted proxy headers with a safe fallback. */
export function getClientIp(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0].trim();
    if (first) return first;
  }
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}

/** Fixed-window in-memory rate limiter returning remaining quota or retry delay. */
export function checkRateLimit({ namespace, key, limit, windowMs }) {
  const store = getRateStore();
  const now = Date.now();

  if (store.size > RATE_LIMIT_CLEANUP_THRESHOLD) {
    for (const [entryKey, entry] of store.entries()) {
      if (entry.resetAt <= now) store.delete(entryKey);
    }
  }

  const bucketKey = `${namespace}:${key}`;
  const current = store.get(bucketKey);

  if (!current || current.resetAt <= now) {
    store.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: Math.max(0, limit - 1) };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return { allowed: true, remaining: Math.max(0, limit - current.count) };
}

/** Verifies that state-changing requests originate from the same host/origin. */
export function isSameOrigin(req) {
  const secFetchSite = req.headers.get('sec-fetch-site');
  if (secFetchSite && secFetchSite !== 'same-origin' && secFetchSite !== 'none') {
    return false;
  }

  const origin = req.headers.get('origin');
  if (!origin) {
    return !secFetchSite || secFetchSite === 'same-origin' || secFetchSite === 'none';
  }

  const hostHeader = req.headers.get('x-forwarded-host') || req.headers.get('host');
  if (!hostHeader) return false;
  const expectedHost = hostHeader.split(',')[0].trim().toLowerCase();

  try {
    return new URL(origin).host.toLowerCase() === expectedHost;
  } catch {
    return false;
  }
}

/**
 * Validates and normalizes HTTP(S) or root-relative URLs; returns '' for blank input
 * and null for invalid or unsafe schemes (e.g. javascript:, data:, protocol-relative //).
 */
export function sanitizeHref(raw, { allowRelative = true, allowBareDomain = false } = {}) {
  const trimmed = String(raw || '').trim();
  if (!trimmed) return '';
  if (/[\u0000-\u001f\u007f]/.test(trimmed)) return null;

  if (allowRelative && trimmed.startsWith('/')) {
    if (trimmed.startsWith('//') || trimmed.startsWith('/\\')) return null;
    return trimmed;
  }

  const candidate = allowBareDomain && /^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(trimmed)
    ? `https://${trimmed}`
    : trimmed;

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

/** Validates image paths/URLs stored in CMS records; rejects unsaved blob: or unsafe schemes. */
export function sanitizeImageSrc(raw) {
  return sanitizeHref(raw, { allowRelative: true, allowBareDomain: false });
}

/** Validates uploaded document paths/URLs stored in CMS records; rejects blob: or unsafe schemes. */
export const sanitizeDocumentSrc = sanitizeImageSrc;

/** Validates plain contact email strings without query/header injection characters. */
export function sanitizeEmail(raw) {
  const email = String(raw || '').trim().toLowerCase();
  if (!email) return '';
  if (email.length > 254 || /[?\r\n<>]/.test(email)) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

/** Validates display/tel phone values, returning '' when empty or null when invalid. */
export function sanitizePhone(raw) {
  const phone = String(raw || '').trim();
  if (!phone) return '';
  return /^[+\d\s().-]{5,30}$/.test(phone) ? phone : null;
}

/** Generates URL-safe ASCII slugs, returning '' if no alphanumeric characters remain. */
export function slugifySafe(raw) {
  return String(raw || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

