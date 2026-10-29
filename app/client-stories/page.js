import PageIntro from '@/frontend/components/PageIntro';
import TestimonialDeck from '@/frontend/components/TestimonialDeck';
import StageDivider from '@/frontend/components/StageDivider';
import CTA from '@/frontend/components/CTA';
import VideoStories from '@/frontend/components/VideoStories';
import { getTestimonials } from '@/backend/lib/content';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Client Stories — Grostage',
  description: 'Hear from Samsung, Chanakya, Circuit India, Bright Bee and more. Real feedback from the businesses that built their next stage with Grostage.',
  openGraph: {
    title: 'Client Stories — Grostage',
    description: 'Real feedback from the businesses that built their next stage with Grostage.',
    url: 'https://grostage.com/client-stories',
    images: [{ url: '/projects/chanakya-erp.webp', width: 1200, height: 630, alt: 'Grostage client testimonials' }],
  },
  alternates: { canonical: 'https://grostage.com/client-stories' },
};

export default async function Stories() {
  const testimonials = await getTestimonials();
  return <main id="main-content">
    <PageIntro label="CLIENT STORIES" title="Built together." accent="Better together." description="Behind every digital solution is a business, a team and a shared ambition to move forward." />
    <TestimonialDeck items={testimonials} tone="dark" title="What they say" intro="The people behind the projects, on what it was like to build the next stage together." showLink={false} />
    <StageDivider from="#060908" to="#f0f3ef" />
    <section className="rx rx-light rx-videos">
      <div className="rx-head" data-rx><h2>Stories worth<br /><span className="rx-accent">sharing.</span></h2></div>
      <p className="rx-note">Video player preview · These are sample YouTube videos, not Grostage client endorsements. Client video links are pending.</p>
      <VideoStories />
    </section>
    <StageDivider from="#f0f3ef" to="#060908" flip />
    <CTA />
  </main>;
}
