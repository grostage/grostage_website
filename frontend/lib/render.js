export function Body({ text = '' }) {
  return text.split(/\n\s*\n/).map((b, i) => b.startsWith('## ') ? <h2 key={i}>{b.slice(3)}</h2> : <p key={i}>{b}</p>);
}

// Split "## Heading" text into an opening paragraph set and titled chapters.
export function chapters(text = '') {
  const blocks = text.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  const intro = [], list = [];
  for (const b of blocks) {
    if (b.startsWith('## ')) list.push({ title: b.slice(3), body: [] });
    else (list.length ? list[list.length - 1].body : intro).push(b);
  }
  return { intro, list };
}

/** Validates an external product URL and returns a safe https/http href or empty string. */
export function safeProductUrl(url = '') {
  const trimmed = String(url || '').trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(trimmed)) return `https://${trimmed}`;
  return '';
}

/** Strips scheme and trailing slash for concise external link labels (e.g. hallspot.in). */
export function formatUrlLabel(url = '') {
  return String(url || '').replace(/^https?:\/\//i, '').replace(/\/+$/, '');
}

/** Validates a stored document path or HTTPS/HTTP URL, returning '' if unsafe or empty. */
export function safeDocumentUrl(url = '') {
  const trimmed = String(url || '').trim();
  if (!trimmed || /[\u0000-\u001f\u007f]/.test(trimmed)) return '';
  if (trimmed.startsWith('/')) {
    return trimmed.startsWith('//') || trimmed.startsWith('/\\') ? '' : trimmed;
  }
  return /^https?:\/\//i.test(trimmed) ? trimmed : '';
}
