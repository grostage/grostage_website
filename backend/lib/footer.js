import { q } from '@/backend/lib/db';
import { unstable_noStore as noStore } from 'next/cache';
export const defaultFooter = {
  tagline: 'Digital products. Technology. Growth.', email: 'info@grostage.com', phone: '', address: '',
  links: [
    { label: 'About Us', value: '/about' }, { label: 'Services', value: '/services' },
    { label: 'Our Work', value: '/work' }, { label: 'Blog', value: '/blog' },
    { label: 'Client Stories', value: '/client-stories' }, { label: 'Clients', value: '/clients' }, { label: 'Contact', value: '/contact' },
  ],
  socials: [
    { label: 'LinkedIn', value: 'https://linkedin.com/company/grostage' },
    { label: 'Instagram', value: 'https://instagram.com/grostage_' },
  ],
  copyright: '© 2026 Grostage. All rights reserved.'
};
export async function getFooter() {
  noStore();
  try { const r = await q("SELECT value FROM settings WHERE key='footer'"); return { ...defaultFooter, ...(r[0]?.value || {}) }; } catch { return defaultFooter; }
}
export const parseLinks = (links = '') => {
  if (Array.isArray(links)) return links.map(({ label, value, href }) => ({ label: String(label || '').trim(), href: String(value || href || '').trim() })).filter(l => l.label && l.href);
  return String(links).split('\n').map(line => line.split('|')).filter(a => a[0] && a[1]).map(([label, href]) => ({ label: label.trim(), href: href.trim() }));
};
