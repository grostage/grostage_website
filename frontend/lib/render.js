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
