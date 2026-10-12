'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ServiceIcon } from './ServiceIcon';

export default function ServiceCard({ service, index }) {
  const [spot, setSpot] = useState({ x: 50, y: 50 });
  return <Link href={'/services#' + service.slug} className="service-card" onPointerMove={e => { const r = e.currentTarget.getBoundingClientRect(); setSpot({ x: ((e.clientX-r.left)/r.width)*100, y: ((e.clientY-r.top)/r.height)*100 }); }} style={{ '--spot-x': `${spot.x}%`, '--spot-y': `${spot.y}%` }}>
    <div className="service-top"><span className="service-icon"><ServiceIcon slug={service.slug} /></span><small>0{index + 1}</small></div><h3>{service.title}</h3><p>{service.description}</p><div className="service-bottom"><span>Explore capability</span><span>↗</span></div>
  </Link>;
}
