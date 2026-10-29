import '../work.css';
import { WorkHero, WorkFiles } from '@/frontend/components/WorkStage';
import StageDivider from '@/frontend/components/StageDivider';
import CTA from '@/frontend/components/CTA';
import { getWorks } from '@/backend/lib/content';
export const metadata = {
  title: 'Our Work — Grostage',
  description: 'Explore the digital products, software systems and growth campaigns we have built for businesses across industries.',
  openGraph: {
    title: 'Our Work — Grostage',
    description: 'Explore the digital products, software systems and growth campaigns we have built for businesses across industries.',
    url: 'https://grostage.com/work',
    images: [{ url: '/projects/circuit-india.webp', width: 1200, height: 630, alt: 'Grostage portfolio' }],
  },
  alternates: { canonical: 'https://grostage.com/work' },
};
export const dynamic = 'force-dynamic';
export default async function Work() {
  const works = await getWorks();
  return <main id="main-content" className="wk-page">
    <WorkHero works={works} count={works.length} />
    <StageDivider from="#060908" to="#f0f3ef" />
    <WorkFiles works={works} />
    <StageDivider from="#f0f3ef" to="#060908" flip />
    <CTA />
  </main>;
}
