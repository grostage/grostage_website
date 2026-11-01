# Grostage website (Next.js + PostgreSQL + Cloudinary)
1. `npm install`
2. Copy `.env.example` to `.env.local`, fill values (Postgres URL, admin password, JWT secret, Cloudinary keys)
3. `node --env-file=.env.local backend/scripts/init-db.mjs` (creates tables)
4. `npm run dev` → http://localhost:3000
- Admin: /adminportal (blog posts, content pages at /p/your-slug, footer editor, Cloudinary image upload)
- Logo: replace `public/logo.svg` with your exact logo file.
