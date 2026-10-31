export const marketingMediaItems = [
  { id: 'brand-building', group: 'Growth Studio', label: 'Brand Building', defaultUrl: '/images/marketing/brand-building.webp' },
  { id: 'lead-generation', group: 'Growth Studio', label: 'Lead Generation', defaultUrl: '/images/marketing/lead-generation.webp' },
  { id: 'sales-growth', group: 'Growth Studio', label: 'Sales Growth', defaultUrl: '/images/marketing/sales-growth.webp' },
  { id: 'local-visibility', group: 'Growth Studio', label: 'Local Visibility', defaultUrl: '/images/marketing/local-visibility.webp' },
  { id: 'branding-identity', group: 'Marketing Services', label: 'Branding & Identity', defaultUrl: '/images/marketing/services/brand-identity.webp' },
  { id: 'creative-production', group: 'Marketing Services', label: 'Creative Production', defaultUrl: '/images/marketing/services/creative-production.webp' },
  { id: 'social-media', group: 'Marketing Services', label: 'Social Media Marketing', defaultUrl: '/images/marketing/services/social-media.webp' },
  { id: 'performance-advertising', group: 'Marketing Services', label: 'Performance Advertising', defaultUrl: '/images/marketing/services/performance-ads.webp' },
  { id: 'seo-local', group: 'Marketing Services', label: 'SEO & Local Marketing', defaultUrl: '/images/marketing/services/seo-local.webp' },
  { id: 'brand-materials', group: 'Marketing Services', label: 'Business & Brand Materials', defaultUrl: '/images/marketing/services/brand-materials.webp' },
];

export const marketingMediaById = Object.fromEntries(marketingMediaItems.map(item => [item.id, item]));

export function isValidCloudinaryImageUrl(value) {
  if (typeof value !== 'string' || value.length > 2048) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'res.cloudinary.com' &&
      !url.username && !url.password && !url.port &&
      /^\/[^/]+\/image\/upload\/(?:[^?#]*\/)?[^/?#]+\.(?:jpe?g|png|webp)$/i.test(url.pathname);
  } catch {
    return false;
  }
}
