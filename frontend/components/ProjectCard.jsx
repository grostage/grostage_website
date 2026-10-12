import Link from 'next/link';
export default function ProjectCard({work, index = 0}) {
  return <Link href={'/work/' + work.slug} className="project-card" data-rx style={{ "--d": index % 2 }} data-cursor="View"><div className="project-image"><img src={work.image || '/projects/work-placeholder.svg'} alt={work.imageAlt || work.title + ' project from the Grostage company profile'} loading="lazy" /><span className="project-open" aria-hidden="true">↗</span>{work.representative && <span className="sample-label">Profile artwork</span>}</div><div className="project-caption"><div><p className="eyebrow">{work.category}</p><h3>{work.title}</h3></div><span className="project-index">/ {String(index + 1).padStart(2, '0')}</span></div></Link>;
}
