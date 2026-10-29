import './globals.css';
import './motion.css';
import './gsap.css';
import './studio.css';
import './experience.css';
import './cinematic.css';
import './elevate.css';
import './redesign.css';
import './deck.css';
import { Inter, Michroma } from 'next/font/google';
import Nav from '@/frontend/components/Nav'; import Footer from '@/frontend/components/Footer';
import Preloader from '@/frontend/components/Preloader';
import SmoothScroll from '@/frontend/components/SmoothScroll';
import PageTransition from '@/frontend/components/PageTransition';
import CursorFX from '@/frontend/components/CursorFX';
import RxObserver from '@/frontend/components/RxObserver';
const inter = Inter({ subsets: ['latin'], variable: '--inter' });
const mich = Michroma({ subsets: ['latin'], weight: '400', variable: '--mich' });
const SITE_URL = 'https://grostage.com';
const SITE_NAME = 'Grostage';
const DEFAULT_TITLE = 'Grostage — Built for your next stage';
const DEFAULT_DESCRIPTION = 'AI-powered digital products, business technology and growth. Grostage brings strategy, design and technology together to move your business forward.';
const DEFAULT_OG_IMAGE = '/projects/profile-13-0.jpeg';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    'digital products', 'web development', 'custom software', 'ERP', 'CRM',
    'AI solutions', 'mobile apps', 'SEO', 'digital marketing', 'business technology',
    'Grostage', 'India', 'full-stack development', 'EdTech', 'e-commerce',
  ],
  authors: [{ name: 'Grostage', url: SITE_URL }],
  creator: 'Grostage',
  publisher: 'Grostage',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Grostage — Built for your next stage',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
    creator: '@grostage_',
    site: '@grostage_',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'manifest', url: '/site.webmanifest' },
    ],
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable + ' ' + mich.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <noscript><style>{'.gs-preloader,.gs-curtain,.gs-cursor{display:none!important}'}</style></noscript>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Preloader />
        <PageTransition />
        <SmoothScroll />
        <CursorFX />
        <RxObserver />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
