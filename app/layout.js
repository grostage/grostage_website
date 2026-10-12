import './globals.css';
import './motion.css';
import './gsap.css';
import './studio.css';
import './experience.css';
import './cinematic.css';
import './elevate.css';
import './redesign.css';
import { Inter, Michroma } from 'next/font/google';
import Nav from '@/frontend/components/Nav'; import Footer from '@/frontend/components/Footer';
import Preloader from '@/frontend/components/Preloader';
import SmoothScroll from '@/frontend/components/SmoothScroll';
import PageTransition from '@/frontend/components/PageTransition';
import CursorFX from '@/frontend/components/CursorFX';
import RxObserver from '@/frontend/components/RxObserver';
const inter = Inter({ subsets: ['latin'], variable: '--inter' });
const mich = Michroma({ subsets: ['latin'], weight: '400', variable: '--mich' });
export const metadata = { title: 'Grostage — Built for your next stage', description: 'AI-powered digital products, business technology and growth. Grostage brings strategy, design and technology together to move your business forward.' };
export default function RootLayout({ children }) {
  return <html lang="en" className={inter.variable + ' ' + mich.variable}><body><noscript><style>{'.gs-preloader,.gs-curtain,.gs-cursor{display:none!important}'}</style></noscript><a href="#main-content" className="skip-link">Skip to content</a><Preloader /><PageTransition /><SmoothScroll /><CursorFX /><RxObserver /><Nav />{children}<Footer /></body></html>;
}
