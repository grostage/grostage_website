import Link from 'next/link';
import Magnetic from './Magnetic';
export default function CTA() {
  return <section className="rx-cta" data-nav-theme="dark">
    <p className="rx-kicker" data-rx>Good things start with a conversation</p>
    <Link href="/contact" className="rx-cta-link" data-cursor="Let’s talk">
      <span className="rx-cta-row" data-text="What’s your">What’s your</span>
      <span className="rx-cta-row rx-cta-accent" data-text="next big thing?">next big thing?</span>
    </Link>
    <div className="rx-cta-foot" data-rx><p>A business problem. A bold idea. Let’s build what comes next.</p><Magnetic strength={.25}><Link className="rx-pill" href="/contact">Start a project <span aria-hidden="true">↗</span></Link></Magnetic></div>
  </section>;
}
