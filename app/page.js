import Link from 'next/link';
import './home.css';
import TextFill from '@/frontend/components/TextFill';
import Magnetic from '@/frontend/components/Magnetic';
import { Process } from '@/frontend/components/HomeSections';
import { ExperienceServices } from '@/frontend/components/ExperienceHome';
import { StageHero } from '@/frontend/components/CinematicHome';
import CinematicReel from '@/frontend/components/CinematicReel';
import StageDivider from '@/frontend/components/StageDivider';
import TestimonialDeck from '@/frontend/components/TestimonialDeck';
import { services, getWorks, getTestimonials } from '@/backend/lib/content';

export const dynamic = 'force-dynamic';

const wordPreviews = {
  design: { image: '/projects/profile-11-2.jpeg', label: 'Chanakya Properties' },
  technology: { image: '/projects/profile-11-1.jpeg', label: 'Custom ERP' },
  ai: { image: '/projects/profile-8-0.jpeg', label: 'AI & Data' },
};

export default async function Home() {
  const [works, testimonials] = await Promise.all([
    getWorks(),
    getTestimonials()
  ]);
  return <main id="main-content" className="cinematic-home">
    <StageHero />
    <StageDivider from="#050a0b" to="#f0f3ef" />
    <section className="stage-manifesto" id="hx-about" data-nav-theme="light">
      <p className="stage-label">01 / A DIFFERENT PERSPECTIVE</p>
      <div><TextFill className="stage-statement" text="Great ideas deserve to be experienced. We connect design, technology and AI to move your business into its next stage." previews={wordPreviews} /><div className="manifesto-bottom"><p>From the first spark to the systems behind it.<br />One team, bringing the whole picture together.</p><Link className="stage-text-link" href="/about">Meet Grostage <span>↗</span></Link></div></div>
    </section>
    <StageDivider from="#f0f3ef" to="#060908" flip />
    <CinematicReel works={works.slice(0, 4)} more="/work" />
    <StageDivider from="#060908" to="#e8eeea" />
    <div id="capabilities" data-nav-theme="light"><ExperienceServices services={services} /></div>
    <StageDivider from="#e8eeea" to="#090f10" flip />
    <div data-nav-theme="dark"><Process /></div>
    <StageDivider from="#090f10" to="#f0f3ef" />
    <TestimonialDeck items={testimonials} />
    <StageDivider from="#f0f3ef" to="#104850" flip />
    <section className="stage-invitation" data-nav-theme="dark"><p className="stage-label">THE NEXT CHAPTER STARTS WITH A CONVERSATION</p><Link href="/contact" className="invitation-link"><span data-text="Make your">Make your</span><span data-text="next move">next move<span className="invitation-arrow" aria-hidden="true">↗</span></span></Link><div><p>Your ambition. Our collective imagination.</p><Magnetic><Link className="stage-pill" href="/contact">Let’s talk <span>↗</span></Link></Magnetic></div></section>
  </main>;
}
