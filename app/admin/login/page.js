'use client';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const go = async e => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const r = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pw }),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok) {
        location.href = '/admin';
      } else {
        setErr(data.error || 'Wrong email or password');
      }
    } catch {
      setErr('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" className="sec top">
      <form onSubmit={go} className="wrap cform" style={{ maxWidth: 420 }}>
        <h1 className="h2" style={{ fontSize: 36 }}>Admin login</h1>
        <input
          type="email"
          placeholder="Email address"
          autoComplete="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          required
          value={pw}
          onChange={e => setPw(e.target.value)}
        />
        <button className="btn" disabled={loading} style={{ marginTop: 12 }}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>
        {err && <p className="mut" style={{ color: '#e55353', marginTop: 8 }}>{err}</p>}
      </form>
    </main>
  );
}

