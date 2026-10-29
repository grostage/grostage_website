import { q } from '@/backend/lib/db';
import { samplePosts } from '@/backend/lib/content';
import PageIntro from '@/frontend/components/PageIntro';
import JournalGrid from '@/frontend/components/JournalGrid';
import StageDivider from '@/frontend/components/StageDivider';
import CTA from '@/frontend/components/CTA';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Journal — Grostage',
  description: 'Insights, perspectives and thinking from the Grostage team on digital products, technology, AI and business growth.',
  openGraph: {
    title: 'Journal — Grostage',
    description: 'Insights, perspectives and thinking from the Grostage team on digital products, technology, AI and business growth.',
    url: 'https://grostage.com/blog',
    images: [{ url: '/projects/profile-13-0.jpeg', width: 1200, height: 630, alt: 'Grostage Journal' }],
  },
  alternates: { canonical: 'https://grostage.com/blog' },
};
export default async function Blog() {
  let posts;
  try {posts = await q('SELECT * FROM posts WHERE published ORDER BY created_at DESC');} catch {posts = [];}
  if (!posts.length) posts = samplePosts;
  return <main id="main-content"><PageIntro label="THE GROSTAGE JOURNAL" title="Ideas for your" accent="next stage." description="Perspectives on digital products, practical technology and business growth." /><StageDivider from="#060908" to="#f0f3ef" /><JournalGrid posts={posts} />{posts.some(p=>p.sample) && <p className="rx-note">Placeholder articles · Replace them from the admin.</p>}<StageDivider from="#f0f3ef" to="#060908" flip /><CTA /></main>;
}
