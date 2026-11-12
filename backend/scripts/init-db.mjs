import pg from 'pg'; import fs from 'fs'; import { getPgSslConfig } from '../lib/db.js';
// Next loads .env.local automatically, but this standalone script does not.
// Load it here so `npm run db:init` uses the same DATABASE_URL as the app.
for (const file of ['.env.local', '.env']) {
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)=(.*)\s*$/i);
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
}
const c = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: getPgSslConfig() });
await c.connect(); await c.query(fs.readFileSync('backend/sql/schema.sql','utf8')); await c.end(); console.log('Database ready');
