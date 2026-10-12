// Shared cinematic page header: oversized title that rises in line by line,
// a live label, and a drifting ticker of the studio's disciplines.
const ticker = ['Strategy', 'Design', 'Technology', 'AI & Data', 'Growth'];
export default function PageIntro({ label, title, accent, description }) {
  return <section className="page-intro rx-intro" data-nav-theme="dark">
    <div className="rx-intro-grid" aria-hidden="true" />
    <div className="wrap">
      <p className="rx-intro-label"><span className="status-dot" />{label}</p>
      <h1 className="rx-intro-title"><span className="rx-line"><span>{title}</span></span><span className="rx-line rx-accent"><span>{accent}</span></span></h1>
      {description && <div className="rx-intro-foot"><p className="lead">{description}</p><span className="rx-scroll" aria-hidden="true"><i /></span></div>}
    </div>
    <div className="rx-ticker" aria-hidden="true"><div>{[...ticker, ...ticker, ...ticker, ...ticker].map((t, i) => <span key={i}>{t}<i /></span>)}</div></div>
  </section>;
}
