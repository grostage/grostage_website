import { Pool } from 'pg';

export function getPgSslConfig() {
  if (process.env.PGSSL !== 'true') return undefined;
  if (process.env.PGSSL_CA) {
    return { ca: process.env.PGSSL_CA.replace(/\\n/g, '\n'), rejectUnauthorized: true };
  }
  return { rejectUnauthorized: process.env.PGSSL_REJECT_UNAUTHORIZED !== 'false' };
}

const g = globalThis;
export const pool = g.__pg || (g.__pg = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: getPgSslConfig(), max: 10, idleTimeoutMillis: 30000 })
  : null);
export const q = async (t, p) => {
  if (!pool) throw new Error('DATABASE_URL is not configured');
  return (await pool.query(t, p)).rows;
};
