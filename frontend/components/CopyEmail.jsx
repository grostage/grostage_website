'use client';
import { useState } from 'react';

export default function CopyEmail({ email }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(email); setCopied(true); setTimeout(() => setCopied(false), 2200); }
    catch { location.href = 'mailto:' + email; }
  };
  return <><button type="button" className={'copy-email' + (copied ? ' is-copied' : '')} onClick={copy}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{copied ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8" /></>}</svg>{copied ? 'Copied to clipboard' : 'Copy address'}
  </button><span className="sr-only" role="status">{copied ? 'Email address copied' : ''}</span></>;
}
