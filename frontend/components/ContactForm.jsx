'use client';
import { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';

const MARKETING_SERVICES = new Set([
  'Branding & Identity',
  'Creative Production',
  'Social Media Marketing',
  'Performance Advertising',
  'SEO & Local Marketing',
  'Business & Brand Materials',
]);

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

export default function ContactForm() {
  const [s, setS] = useState({ name: '', email: '', title: '', message: '' });
  const [status, setStatus] = useState('');
  const [pending, setPending] = useState(false);

  // Marketing services use a validated `service` value. Keep the existing
  // `interest` query support for the Services page and its multi-select flow.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const service = params.get('service');
    const queryValue = MARKETING_SERVICES.has(service) ? service : params.get('interest');
    const interest = queryValue?.slice(0, 300).replace(/[\u0000-\u001f\u007f]/g, ' ').trim();
    if (interest) {
      setS(value => ({
        ...value,
        title: value.title || `Inquiry: ${interest}`.slice(0, 200),
        message: value.message || `I'm interested in: ${interest}.\n\n`,
      }));
    }
  }, []);

  const send = async e => {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setStatus('');

    const name = s.name.trim();
    const email = s.email.trim().toLowerCase();
    const title = s.title.trim();
    const message = s.message.trim();

    if (!name || !email || !title || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('Please check the submitted details and try again.');
      setPending(false);
      return;
    }

    const time = new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    try {
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        throw new Error('EmailJS credentials are not configured');
      }

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { title, name, email, time, message },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );

      // Keep saving submissions to Postgres for the admin portal without
      // failing the visitor confirmation if DB logging has a transient issue.
      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, title, message }),
        });
      } catch (dbError) {
        console.warn('Contact DB backup failed', dbError);
      }

      setStatus('Thank you. Your message is with us. We will be in touch soon.');
      setS({ name: '', email: '', title: '', message: '' });
    } catch {
      setStatus('Your message could not be sent. Please try again or email grostage@gmail.com.');
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={send} className="cform">
      <label htmlFor="contact-name" className="rx-field">
        <input id="contact-name" autoComplete="name" required maxLength={150} placeholder=" " value={s.name} onChange={e => setS({ ...s, name: e.target.value })} />
        <span>Your name</span>
      </label>
      <label htmlFor="contact-email" className="rx-field">
        <input id="contact-email" type="email" autoComplete="email" required maxLength={254} placeholder=" " value={s.email} onChange={e => setS({ ...s, email: e.target.value })} />
        <span>Email address</span>
      </label>
      <label htmlFor="contact-title" className="rx-field">
        <input id="contact-title" required maxLength={200} placeholder=" " value={s.title} onChange={e => setS({ ...s, title: e.target.value })} />
        <span>Subject</span>
      </label>
      <label htmlFor="contact-message" className="rx-field">
        <textarea id="contact-message" rows={5} required maxLength={10000} placeholder=" " value={s.message} onChange={e => setS({ ...s, message: e.target.value })} />
        <span>What are you thinking?</span>
      </label>
      <button className="btn" disabled={pending}>
        {pending ? 'Sending…' : 'Let’s start a conversation'}
        <span>↗</span>
      </button>
      <p className={'form-status' + (status.startsWith('Thank') ? ' is-ok' : status ? ' is-err' : '')} role="status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
