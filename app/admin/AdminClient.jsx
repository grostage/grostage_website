'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import MarketingMediaPanel from './MarketingMediaPanel';

const empty = { title: '', slug: '', category: '', excerpt: '', content: '', tags: '', image: '', published: true };
const footerFields = [['tagline', 'Tagline'], ['email', 'Email'], ['phone', 'Phone'], ['address', 'Address'], ['copyright', 'Copyright text']];
const socialFields = [['linkedin', 'LinkedIn URL', 'LinkedIn'], ['instagram', 'Instagram URL', 'Instagram'], ['facebook', 'Facebook URL', 'Facebook'], ['youtube', 'YouTube URL', 'YouTube'], ['twitter', 'Twitter / X URL', 'Twitter / X']];
const socialAliases = { linkedin: 'linkedin', instagram: 'instagram', facebook: 'facebook', youtube: 'youtube', twitter: 'twitter', twitterx: 'twitter', x: 'twitter' };

function footerForEditing(data) {
  const socialLinks = Array.isArray(data.socials) ? data.socials.map(link => ({ label: link.label || '', value: link.value || link.href || '' })) : String(data.socials || '').split('\n').map(line => {
    const [label, ...value] = line.split('|');
    return { label: label || '', value: value.join('|') || '' };
  }).filter(link => link.label || link.value);
  const links = Array.isArray(data.links) ? data.links.map(link => ({ label: link.label || '', value: link.value || link.href || '' })) : String(data.links || '').split('\n').map(line => {
    const [label, ...value] = line.split('|');
    return { label: label || '', value: value.join('|') || '' };
  }).filter(link => link.label || link.value);
  return { ...data, links, socialLinks };
}

export default function AdminClient() {
  const [tab, setTab] = useState('works');
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(null);
  const [footer, setFooter] = useState(null);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);
  const marketingMediaRef = useRef(null);
  const router = useRouter();

  const load = async () => {
    const endpoint = tab === 'footer' ? '/api/footer' : tab === 'contacts' ? '/api/contacts' : `/api/content/${tab}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    if (!response.ok) return setMessage(data.error || 'Unable to load data');
    if (tab === 'footer') setFooter(footerForEditing(data));
    else setRows(data);
  };

  useEffect(() => {
    setForm(null);
    setMessage('');
    setUploadError('');
    setUploading(false);
    if (tab !== 'marketing-media') load();
  }, [tab]);

  const save = async () => {
    if (uploading) {
      setUploadError('Please wait for image upload to complete.');
      return;
    }
    const response = await fetch(`/api/content/${tab}${form.id ? `/${form.id}` : ''}`, {
      method: form.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) return setMessage(data.error || 'Unable to save');
    setForm(null);
    setMessage(tab === 'works' ? 'Work saved successfully.' : 'Post saved.');
    load();
  };

  const remove = async id => {
    if (!confirm('Delete this item?')) return;
    const response = await fetch(`/api/content/${tab}/${id}`, { method: 'DELETE' });
    const data = await response.json().catch(() => ({}));
    setMessage(response.ok ? 'Deleted.' : data.error || 'Unable to delete');
    if (response.ok) load();
  };

  const upload = async event => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    // Immediately display local preview so user sees new image instantly
    const localUrl = URL.createObjectURL(file);
    setForm(current => ({ ...current, image: localUrl }));
    setUploading(true);
    setUploadError('');

    try {
      const data = new FormData();
      data.append('file', file);
      const response = await fetch('/api/upload', { method: 'POST', body: data });
      const result = await response.json();
      if (response.ok && result.url) {
        setForm(current => ({ ...current, image: result.url }));
        setUploadError('');
      } else {
        setUploadError(result.error || 'Upload to cloud failed. The local preview is shown, but please try uploading again.');
      }
    } catch (err) {
      setUploadError('Upload failed: ' + (err.message || 'Network error'));
    } finally {
      setUploading(false);
    }
  };

  const saveFooter = async () => {
    try {
      const payload = {
        ...footer,
        links: (footer.links || []).filter(link => String(link.label || '').trim() || String(link.value || '').trim()),
        socials: (footer.socialLinks || []).filter(link => String(link.label || '').trim() || String(link.value || '').trim()),
      };
      delete payload.socialLinks;
      const response = await fetch('/api/footer', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) return setMessage(result.error || `Unable to save footer (${response.status}).`);
      setMessage('Footer saved successfully.');
      const saved = await fetch('/api/footer', { cache: 'no-store' });
      if (saved.ok) setFooter(footerForEditing(await saved.json()));
      router.refresh();
    } catch (error) {
      setMessage('Unable to save footer. Check your connection and try again.');
    }
  };

  const logOut = async () => {
    await fetch('/api/login', { method: 'DELETE' });
    location.href = '/admin/login';
  };

  const edit = row => {
    setUploadError('');
    setUploading(false);
    setForm({
      ...row,
      tags: Array.isArray(row.tags) ? row.tags.join(', ') : (row.tags || ''),
    });
  };

  const publicPath = row => `/${tab === 'works' ? 'work' : 'blog'}/${row.slug}`;

  return <main id="main-content" className="sec top adm"><div className="wrap">
    <div className="row between"><h1 className="h2" style={{ fontSize: 40 }}>Admin</h1><button className="btn ghost sm" onClick={logOut}>Log out</button></div>
    <div className="tabs">
      {[['works', 'Work'], ['posts', 'Blog posts'], ['contacts', 'Contact submissions'], ['footer', 'Footer'], ['marketing-media', 'Marketing Media']].map(([key, label]) =>
        <button key={key} className={tab === key ? 'on' : ''} onClick={() => {
          if (tab === 'marketing-media' && key !== tab && marketingMediaRef.current && !marketingMediaRef.current.confirmDiscard()) return;
          setTab(key);
        }}>{label}</button>
      )}
    </div>
    {message && <p className="mut" role="status" aria-live="polite">{message}</p>}

    {tab === 'marketing-media' && <MarketingMediaPanel ref={marketingMediaRef} />}

    {tab === 'footer' && footer && <div className="cform">
      {footerFields.map(([key, label]) => <label key={key}>{label}<input value={footer[key] || ''} onChange={event => setFooter({ ...footer, [key]: event.target.value })} /></label>)}
      <fieldset className="admin-social-panel"><legend>Footer links</legend>
        <p className="mut">Label is displayed in the footer. Value is the destination URL or path.</p>
        {footer.links.map((link, index) => <div className="row" key={index}>
          <input placeholder="Label" value={link.label} onChange={event => setFooter({ ...footer, links: footer.links.map((item, i) => i === index ? { ...item, label: event.target.value } : item) })} />
          <input placeholder="Value, e.g. /about" value={link.value} onChange={event => setFooter({ ...footer, links: footer.links.map((item, i) => i === index ? { ...item, value: event.target.value } : item) })} />
          <button type="button" className="btn ghost sm" onClick={() => setFooter({ ...footer, links: footer.links.filter((_, i) => i !== index) })}>Remove</button>
        </div>)}
        <button type="button" className="btn ghost sm" onClick={() => setFooter({ ...footer, links: [...footer.links, { label: '', value: '' }] })}>+ Add link</button>
      </fieldset>
      <section className="admin-social-panel"><h2>Social Links</h2>
        <p className="mut">Label is displayed in the footer. Value is the social media URL.</p>
        {footer.socialLinks.map((link, index) => <div className="row" key={index}>
          <input placeholder="Label, e.g. LinkedIn" value={link.label} onChange={event => setFooter({ ...footer, socialLinks: footer.socialLinks.map((item, i) => i === index ? { ...item, label: event.target.value } : item) })} />
          <input type="url" inputMode="url" placeholder="https://" value={link.value} onChange={event => setFooter({ ...footer, socialLinks: footer.socialLinks.map((item, i) => i === index ? { ...item, value: event.target.value } : item) })} />
          <button type="button" className="btn ghost sm" onClick={() => setFooter({ ...footer, socialLinks: footer.socialLinks.filter((_, i) => i !== index) })}>Remove</button>
        </div>)}
        <button type="button" className="btn ghost sm" onClick={() => setFooter({ ...footer, socialLinks: [...footer.socialLinks, { label: '', value: '' }] })}>+ Add social link</button>
      </section>
      <button className="btn" onClick={saveFooter}>Save footer</button>
      {message && <p className="form-status" role="status" aria-live="polite">{message}</p>}
    </div>}

    {tab === 'contacts' && <div className="list">
      {rows.map(row => <article key={row.id} className="item contact-item"><div><b>{row.name}</b><small className="mut"> {row.email} · {new Date(row.created_at).toLocaleString()}</small><p>{row.message}</p></div></article>)}
      {!rows.length && <p className="mut">No contact submissions yet.</p>}
    </div>}

    {!['footer', 'contacts'].includes(tab) && !form && <>
      <button className="btn sm" onClick={() => setForm({ ...empty })}>+ Add new {tab === 'works' ? 'work' : 'post'}</button>
      <div className="list">
        {rows.map(row => <div key={row.id} className="item"><div><b>{row.title}</b><small className="mut"> {publicPath(row)}</small></div>
          <div className="row"><a className="btn ghost sm" href={publicPath(row)} target="_blank" rel="noreferrer">View</a><button className="btn ghost sm" onClick={() => edit(row)}>Edit</button><button className="btn ghost sm" onClick={() => remove(row.id)}>Delete</button></div>
        </div>)}
        {!rows.length && <p className="mut">Nothing here yet.</p>}
      </div>
    </>}

    {!['footer', 'contacts'].includes(tab) && form && <div className="cform">
      <label>Title<input value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} /></label>
      <label>Slug (optional)<input value={form.slug} onChange={event => setForm({ ...form, slug: event.target.value })} /></label>
      {tab === 'works' && <label>Category<input placeholder="Example: E-commerce / Digital product" value={form.category || ''} onChange={event => setForm({ ...form, category: event.target.value })} /></label>}
      <label>Short summary<input value={form.excerpt} onChange={event => setForm({ ...form, excerpt: event.target.value })} /></label>
      <label>Detailed content <small className="mut">Use a blank line for a new paragraph. Start a heading with ## followed by a space.</small><textarea rows={14} placeholder={'Project introduction.\n\n## The challenge\n\nDescribe the challenge here.'} value={form.content} onChange={event => setForm({ ...form, content: event.target.value })} /></label>
      {tab === 'works' && <label>Tags (comma separated)<input placeholder="Website, UI/UX, E-commerce" value={form.tags || ''} onChange={event => setForm({ ...form, tags: event.target.value })} /></label>}
      <div>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Cover image</label>
        {form.image ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={form.image}
                alt="Cover preview"
                style={{
                  maxWidth: 320,
                  maxHeight: 200,
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'cover',
                  borderRadius: 10,
                  border: '1px solid var(--line)',
                  display: 'block'
                }}
              />
              {uploading && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.65)',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 500
                }}>
                  Uploading to cloud…
                </div>
              )}
            </div>
            <div className="row" style={{ gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn ghost sm"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? 'Uploading…' : 'Change image'}
              </button>
              <button
                type="button"
                className="btn ghost sm"
                disabled={uploading}
                onClick={() => {
                  setForm(current => ({ ...current, image: '' }));
                  setUploadError('');
                }}
              >
                Delete image
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
            <button
              type="button"
              className="btn ghost sm"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? 'Uploading…' : '+ Upload cover image'}
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={upload}
          style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}
        />

        <div style={{ marginTop: 10 }}>
          <label style={{ fontSize: 13, color: 'var(--mut)', display: 'block', marginBottom: 4 }}>
            Or image path / URL:
          </label>
          <input
            placeholder="/projects/circuit-india.webp or https://..."
            value={form.image || ''}
            onChange={event => setForm({ ...form, image: event.target.value })}
            style={{ fontSize: 14, padding: '10px 14px' }}
          />
        </div>

        {uploadError && <p style={{ color: '#e5534b', fontSize: 13, margin: '8px 0 0' }}>{uploadError}</p>}
      </div>
      <div className="row">
        <button className="btn" disabled={uploading} onClick={save}>
          {uploading ? 'Uploading image…' : `Save ${tab === 'works' ? 'work' : 'post'}`}
        </button>
        <button className="btn ghost" disabled={uploading} onClick={() => setForm(null)}>
          Cancel
        </button>
      </div>
    </div>}
  </div></main>;
}
