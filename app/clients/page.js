import Link from 'next/link';
import '../clients.css';
import { clients } from '@/backend/lib/content';
import ClientWall from '@/frontend/components/ClientWall';
import CTA from '@/frontend/components/CTA';
export const metadata = {
  title: 'Our Clients — Grostage',
  description: 'From Samsung and Circuit India to Chanakya and Bright Bee — meet the businesses we have built digital products, systems and campaigns for.',
  openGraph: {
    title: 'Our Clients — Grostage',
    description: 'From Samsung and Circuit India to Chanakya and Bright Bee — meet the businesses we have built digital products, systems and campaigns for.',
    url: 'https://grostage.com/clients',
    images: [{ url: '/projects/profile-13-0.jpeg', width: 1200, height: 630, alt: 'Grostage clients' }],
  },
  alternates: { canonical: 'https://grostage.com/clients' },
};
export default function Clients() {
  return <main id="main-content" className="cl-page">
    <section className="cl-head" data-nav-theme="light">
      <h1>Our clients</h1>
      <p>We work as a true partner to every business we serve. Read our <Link href="/client-stories">client stories</Link> to see what that looks like in practice.</p>
    </section>
    <ClientWall clients={clients} />
    <CTA />
  </main>;
}
