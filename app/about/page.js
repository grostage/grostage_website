import PageIntro from '@/frontend/components/PageIntro';
import StageDivider from '@/frontend/components/StageDivider';
import CTA from '@/frontend/components/CTA';
import { VisionMission, ProcessStepper, Team } from '@/frontend/components/AboutSections';
import { steps } from '@/backend/lib/content';
export const metadata = { title: 'About Us — Grostage' };
const people = [['Sanal P K', 'Founder & CEO', 'Business strategy, product direction and growth.'], ['Pranav', 'Chief Business Officer', 'Strategic relationships, partnerships and expansion.'], ['Vishnu', 'Head of Operations', 'Project coordination, delivery and client collaboration.'], ['Hari', 'Technical Officer', 'Software development, engineering and technical execution.']];
export default function About() {
  return <main id="main-content">
    <PageIntro label="WHO WE ARE" title="One team." accent="Your next stage." description="We are Grostage. A technology and digital growth company building what businesses need next." />
    <StageDivider from="#060908" to="#f0f3ef" />
    <section className="rx rx-light rx-story">
      <figure className="rx-story-media" data-rx><img src="/projects/profile-13-0.jpeg" alt="Flowing abstract ribbon from the Grostage company profile" /></figure>
      <div className="rx-story-copy">
        <h2 data-rx>Technology with a<br /><span className="rx-accent">business purpose.</span></h2>
        <p data-rx style={{ '--d': 1 }}>We help businesses turn ideas, operational challenges and growth opportunities into practical digital solutions.</p>
        <p data-rx style={{ '--d': 2 }}>From websites and e-commerce experiences to custom software, ERP systems, automation, AI solutions and digital marketing, we bring strategy, design, technology and execution together under one team.</p>
        <ul className="rx-tags" data-rx style={{ '--d': 3 }}>{['Strategy', 'Design', 'Technology', 'Growth'].map(t => <li key={t}>{t}</li>)}</ul>
      </div>
    </section>
    <StageDivider from="#f0f3ef" to="#060908" flip />
    <VisionMission />
    <StageDivider from="#060908" to="#f0f3ef" />
    <ProcessStepper steps={steps} />
    <StageDivider from="#f0f3ef" to="#060908" flip />
    <Team people={people} />
    <CTA />
  </main>;
}
