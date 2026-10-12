import { q } from '@/backend/lib/db';
import { samplePosts } from '@/backend/lib/content';
import PageIntro from '@/frontend/components/PageIntro';
import JournalGrid from '@/frontend/components/JournalGrid';
import CTA from '@/frontend/components/CTA';
export const dynamic = 'force-dynamic';
export const metadata = {title:'Journal — Grostage'};
export default async function Blog() {
  let posts;
  try {posts = await q('SELECT * FROM posts WHERE published ORDER BY created_at DESC');} catch {posts = samplePosts;}
  return <main id="main-content"><PageIntro label="THE GROSTAGE JOURNAL" title="Ideas for your" accent="next stage." description="Perspectives on digital products, practical technology and business growth." />{posts.some(p=>p.sample) && <p className="rx-note">Sample articles · Adapted from the Grostage company profile.</p>}<JournalGrid posts={posts} /><CTA /></main>;
}
