import Link from 'next/link';
import './home.css';
import TextFill from '@/frontend/components/TextFill';
import Magnetic from '@/frontend/components/Magnetic';
import { Process } from '@/frontend/components/HomeSections';
import { ExperienceServices } from '@/frontend/components/ExperienceHome';
import { StageHero, ProjectTheatre } from '@/frontend/components/CinematicHome';
import { services, getWorks } from '@/backend/lib/content';

export const dynamic = 'force-dynamic';

const wordPreviews = {
  design: { image: '/projects/profile-11-2.jpeg', label: 'Chanakya Properties' },
  technology: { image: '/projects/profile-11-1.jpeg', label: 'Custom ERP' },
  ai: { image: '/projects/profile-8-0.jpeg', label: 'AI & Data' },
};

export default async function Home() {
  const works = await getWorks();
  return <main id="main-content" className="cinematic-home">
    <StageHero />
    <section className="stage-manifesto" id="hx-about" data-nav-theme="light">
      <p className="stage-label">01 / A DIFFERENT PERSPECTIVE</p>
      <div><TextFill className="stage-statement" text="Great ideas deserve to be experienced. We connect design, technology and AI to move your business into its next stage." previews={wordPreviews} /><div className="manifesto-bottom"><p>From the first spark to the systems behind it.<br />One team, bringing the whole picture together.</p><Link className="stage-text-link" href="/about">Meet Grostage <span>↗</span></Link></div></div>
    </section>
    <ProjectTheatre works={works} />
    <div id="capabilities" data-nav-theme="light"><ExperienceServices services={services} /></div>
    <div data-nav-theme="dark"><Process /></div>
    <section className="stage-invitation" data-nav-theme="dark"><p className="stage-label">THE NEXT CHAPTER STARTS WITH A CONVERSATION</p><Link href="/contact" className="invitation-link"><span data-text="Make your">Make your</span><span data-text="next move">next move<span className="invitation-arrow" aria-hidden="true">↗</span></span></Link><div><p>Your ambition. Our collective imagination.</p><Magnetic><Link className="stage-pill" href="/contact">Let’s talk <span>↗</span></Link></Magnetic></div></section>
  </main>;
}
