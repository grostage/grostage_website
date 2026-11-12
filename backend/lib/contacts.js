import { q } from '@/backend/lib/db';

let contactsReady;

/** Ensures the contacts table exists with the expanded subject (title) column. */
export async function ensureContactsTable() {
  if (!contactsReady) {
    contactsReady = (async () => {
      await q(`CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT,
        title TEXT DEFAULT '',
        message TEXT,
        created_at TIMESTAMPTZ DEFAULT now()
      )`);
      await q(`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS title TEXT DEFAULT ''`);
    })().catch(error => {
      contactsReady = null;
      throw error;
    });
  }
  return contactsReady;
}

