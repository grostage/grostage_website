import PageIntro from '@/frontend/components/PageIntro';
import ContactForm from '@/frontend/components/ContactForm';
import CopyEmail from '@/frontend/components/CopyEmail';
import ScheduleMeeting from '@/frontend/components/ScheduleMeeting';
import { defaultFooter, getFooter } from '@/backend/lib/footer';
import { sanitizeEmail } from '@/backend/lib/security';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Contact — Grostage',
  description: 'Start a conversation with Grostage. Tell us about your project and we\'ll help you plan the next stage of your digital journey.',
  openGraph: {
    title: 'Contact — Grostage',
    description: 'Start a conversation with Grostage. Tell us about your project and we\'ll help you plan the next stage of your digital journey.',
    url: 'https://grostage.com/contact',
    images: [{ url: '/projects/profile-13-0.jpeg', width: 1200, height: 630, alt: 'Contact Grostage' }],
  },
  alternates: { canonical: 'https://grostage.com/contact' },
};
export default async function Contact() {
  const footer = await getFooter();
  const email = sanitizeEmail(footer.email) || defaultFooter.email;
  const atIndex = email.indexOf('@');
  const emailLocal = atIndex > 0 ? email.slice(0, atIndex) : email;
  const emailDomain = atIndex > 0 ? email.slice(atIndex + 1) : '';

  return <main id="main-content">
    <PageIntro label="LET’S START SOMETHING" title="Your idea." accent="Our next conversation." description="Have a business problem, product idea or growth challenge? Let’s turn it into something practical." />
    <section className="rx rx-contact">
      <div className="rx-contact-side" data-nav-theme="dark">
        <p className="rx-kicker" data-rx>Say hello</p>
        <a className="rx-email" href={'mailto:' + email} data-rx>{emailLocal}@<br />{emailDomain} <span aria-hidden="true">↗</span></a>
        <CopyEmail email={email} />
        <p className="rx-contact-note" data-rx>Good work starts with understanding your business. Tell us where you are and where you want to go.</p>
        <div className="rx-socials" data-rx><a href="https://linkedin.com/company/grostage" target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a><a href="https://instagram.com/grostage_" target="_blank" rel="noreferrer">Instagram <span aria-hidden="true">↗</span></a></div>
      </div>
      <div className="rx-contact-form"><ContactForm /></div>
    </section>
    <ScheduleMeeting />
  </main>;
}
