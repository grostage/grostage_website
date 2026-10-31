import { unstable_noStore as noStore } from 'next/cache';
import { q } from '@/backend/lib/db';
import { marketingMediaItems, marketingMediaById, isValidCloudinaryImageUrl } from './marketing-media-config';

export { marketingMediaItems, marketingMediaById, isValidCloudinaryImageUrl };

function validOverrides(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([id, url]) =>
    Boolean(marketingMediaById[id]) && isValidCloudinaryImageUrl(url)));
}

export async function getMarketingMedia() {
  noStore();
  let overrides = {};
  try {
    const rows = await q("SELECT value FROM settings WHERE key='marketing_media'");
    overrides = validOverrides(rows[0]?.value);
  } catch {
    // Local defaults remain available if the settings table or database is unavailable.
  }
  return Object.fromEntries(marketingMediaItems.map(item => [item.id, overrides[item.id] || item.defaultUrl]));
}
