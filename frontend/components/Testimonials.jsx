import Link from 'next/link';
import { testimonials } from '@/backend/lib/content';
import Reveal from './Reveal';
export default function Testimonials() {
  return <section className="sec reviews"><div className="wrap"><div className="section-heading"><Reveal><p className="eyebrow">RELATIONSHIPS THAT MOVE US FORWARD</p><h2 className="h2">What they <span className="serif">say.</span></h2></Reveal><Link href="/client-stories" className="text-link">Client stories ↗</Link></div><div className="review-grid">{testimonials.map((t,i) => <Reveal key={t.name + i} delay={i*.07}><figure className="review-card"><span className="quote-mark">“</span><blockquote>{t.quote}</blockquote><figcaption><span className="review-avatar">{t.logo ? <img src={t.logo} alt="" style={{width:'100%',height:'100%',objectFit:'contain',padding:4}} /> : t.initials}</span><div>{t.name}<small>{t.role}</small></div></figcaption></figure></Reveal>)}</div></div></section>;
}
