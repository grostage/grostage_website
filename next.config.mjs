import { fileURLToPath } from 'node:url';

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://app.cal.com https://*.cal.com",
  "style-src 'self' 'unsafe-inline' https://app.cal.com https://*.cal.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.emailjs.com https://app.cal.com https://*.cal.com",
  "frame-src 'self' https://app.cal.com https://*.cal.com https://www.youtube-nocookie.com",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const SECURITY_HEADERS = [
  { key: 'Content-Security-Policy', value: CONTENT_SECURITY_POLICY },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
];

export default phase => ({
  outputFileTracingRoot: fileURLToPath(new URL('.', import.meta.url)),
  // Vercel expects the standard Next.js production output directory.
  // Keep development isolated to avoid clashes with local production builds.
  distDir: phase === 'phase-development-server' ? '.next-dev' : '.next',
  // Self-contained server bundle for Node hosts such as Hostinger.
  output: 'standalone',
  serverExternalPackages: ['pg', 'multer', 'sharp'],
  // Avoid worker creation failures on restricted Windows environments.
  experimental: { workerThreads: false, cpus: 1 },
  async headers() {
    return [
      { source: '/(.*)', headers: SECURITY_HEADERS },
      // Hero video files are versioned by name; let browsers and the CDN keep them.
      { source: '/video/:file*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    ];
  },
});
