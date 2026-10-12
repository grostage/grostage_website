import PageIntro from '@/frontend/components/PageIntro';
import QuoteStage from '@/frontend/components/QuoteStage';
import CTA from '@/frontend/components/CTA';
import VideoStories from '@/frontend/components/VideoStories';
import { testimonials } from '@/backend/lib/content';
export const metadata = { title: 'Client Stories — Grostage' };
export default function Stories() {
  return <main id="main-content">
    <PageIntro label="CLIENT STORIES" title="Built together." accent="Better together." description="Behind every digital solution is a business, a team and a shared ambition to move forward." />
    <QuoteStage items={testimonials} />
    <section className="rx rx-light rx-videos">
      <div className="rx-head" data-rx><h2>Stories worth<br /><span className="rx-accent">sharing.</span></h2></div>
      <p className="rx-note">Video player preview · These are sample YouTube videos, not Grostage client endorsements. Client video links are pending.</p>
      <VideoStories />
    </section>
    <CTA />
  </main>;
}
