import { fileURLToPath } from 'node:url';

export default phase => ({
  outputFileTracingRoot: fileURLToPath(new URL('.', import.meta.url)),
  // Vercel expects the standard Next.js production output directory.
  // Keep development isolated to avoid clashes with local production builds.
  distDir: phase === 'phase-development-server' ? '.next-dev' : '.next',
  serverExternalPackages: ['pg'],
  // Avoid worker creation failures on restricted Windows environments.
  experimental: { workerThreads: false, cpus: 1 },
  // Hero video files are versioned by name; let browsers and the CDN keep them.
  async headers() {
    return [{ source: '/video/:file*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] }];
  },
});
