'use client';
import { useEffect, useState } from 'react';

const MARKETING_SERVICES = new Set([
  'Branding & Identity',
  'Creative Production',
  'Social Media Marketing',
  'Performance Advertising',
  'SEO & Local Marketing',
  'Business & Brand Materials',
]);
export default function ContactForm() {
  const [s,setS] = useState({name:'',email:'',message:''});
  const [status,setStatus] = useState('');
  const [pending,setPending] = useState(false);
  // Marketing services use a validated `service` value. Keep the existing
  // `interest` query support for the Services page and its multi-select flow.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const service = params.get('service');
    const queryValue = MARKETING_SERVICES.has(service) ? service : params.get('interest');
    const interest = queryValue?.slice(0, 300).replace(/[\u0000-\u001f\u007f]/g, ' ').trim();
    if (interest) {
      setS(value => value.message ? value : {
        ...value,
        message: `I'm interested in: ${interest}.\n\n`,
      });
    }
  }, []);
  const send = async e => {
    e.preventDefault(); if(pending) return; setPending(true); setStatus('');
    try {
      const r = await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(s)});
      if(!r.ok) throw new Error('send');
      setStatus('Thank you. Your message is with us. We will be in touch soon.');
      setS({name:'',email:'',message:''});
    } catch {setStatus('Your message could not be sent. Please try again or email info@grostage.com.');}
    finally {setPending(false);}
  };
  return <form onSubmit={send} className="cform"><label htmlFor="contact-name" className="rx-field"><input id="contact-name" autoComplete="name" required maxLength={150} placeholder=" " value={s.name} onChange={e=>setS({...s,name:e.target.value})} /><span>Your name</span></label><label htmlFor="contact-email" className="rx-field"><input id="contact-email" type="email" autoComplete="email" required maxLength={254} placeholder=" " value={s.email} onChange={e=>setS({...s,email:e.target.value})} /><span>Email address</span></label><label htmlFor="contact-message" className="rx-field"><textarea id="contact-message" rows={5} required maxLength={10000} placeholder=" " value={s.message} onChange={e=>setS({...s,message:e.target.value})} /><span>What are you thinking?</span></label><button className="btn" disabled={pending}>{pending ? 'Sending…' : 'Let’s start a conversation'}<span>↗</span></button><p className={"form-status"+(status.startsWith("Thank")?" is-ok":status?" is-err":"")} role="status" aria-live="polite">{status}</p></form>;
}
