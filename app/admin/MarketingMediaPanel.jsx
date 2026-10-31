'use client';

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { marketingMediaItems } from '@/backend/lib/marketing-media-config';

const MarketingMediaPanel = forwardRef(function MarketingMediaPanel(_, ref) {
  const defaults = useMemo(() => Object.fromEntries(marketingMediaItems.map(item => [item.id, item.defaultUrl])), []);
  const [saved, setSaved] = useState(defaults);
  const [drafts, setDrafts] = useState({});
  const [message, setMessage] = useState('Loading marketing images…');
  const [busy, setBusy] = useState({});
  const objectUrls = useRef(new Set());
  const inputRefs = useRef({});

  const clearDrafts = () => {
    for (const url of objectUrls.current) URL.revokeObjectURL(url);
    objectUrls.current.clear();
    setDrafts({});
  };

  useImperativeHandle(ref, () => ({
    confirmDiscard() {
      if (Object.values(busy).some(Boolean)) return false;
      if (!Object.keys(drafts).length) return true;
      if (!window.confirm('Discard your unsaved image selections?')) return false;
      clearDrafts();
      setMessage('Unsaved image selections discarded.');
      return true;
    },
  }), [drafts, busy]);

  useEffect(() => {
    let active = true;
    fetch('/api/marketing-media', { cache: 'no-store' })
      .then(async response => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || 'Unable to load marketing images.');
        if (active) { setSaved({ ...defaults, ...data }); setMessage(''); }
      })
      .catch(error => { if (active) setMessage(error.message || 'Unable to load marketing images.'); });
    return () => {
      active = false;
      for (const url of objectUrls.current) URL.revokeObjectURL(url);
      objectUrls.current.clear();
    };
  }, [defaults]);

  useEffect(() => {
    const warn = event => {
      if (!Object.keys(drafts).length) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [drafts]);

  const chooseFile = (item, event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setMessage(`${item.label}: image must be 5 MB or smaller.`); return; }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setMessage(`${item.label}: choose a JPEG, PNG, or WebP image.`); return; }
    if (drafts[item.id] && !window.confirm('Discard the previous unsaved selection for this image?')) return;
    const previewUrl = URL.createObjectURL(file);
    objectUrls.current.add(previewUrl);
    setDrafts(current => {
      const old = current[item.id]?.previewUrl;
      if (old) { URL.revokeObjectURL(old); objectUrls.current.delete(old); }
      return { ...current, [item.id]: { file, previewUrl, uploadedUrl: '' } };
    });
    setMessage('');
  };

  const save = async item => {
    const draft = drafts[item.id];
    if (!draft || busy[item.id]) return;
    setBusy(current => ({ ...current, [item.id]: true }));
    setMessage(`${item.label}: uploading image…`);
    try {
      let uploadedUrl = draft.uploadedUrl;
      if (!uploadedUrl) {
        const formData = new FormData();
        formData.append('file', draft.file);
        const uploadResponse = await fetch('/api/upload', { method: 'POST', body: formData });
        const uploadResult = await uploadResponse.json().catch(() => ({}));
        if (!uploadResponse.ok || !uploadResult.url) throw new Error(uploadResult.error || 'Image upload failed.');
        uploadedUrl = uploadResult.url;
        setDrafts(current => ({ ...current, [item.id]: { ...current[item.id], uploadedUrl } }));
      }
      setMessage(`${item.label}: saving image…`);
      const response = await fetch('/api/marketing-media', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, url: uploadedUrl }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Image reference could not be saved.');
      setSaved(current => ({ ...current, [item.id]: result.url }));
      URL.revokeObjectURL(draft.previewUrl);
      objectUrls.current.delete(draft.previewUrl);
      setDrafts(current => { const next = { ...current }; delete next[item.id]; return next; });
      setMessage(`${item.label}: image saved successfully.`);
    } catch (error) {
      setMessage(`${item.label}: ${error.message || 'Unable to save image.'}`);
    } finally {
      setBusy(current => ({ ...current, [item.id]: false }));
    }
  };

  const reset = async item => {
    if (busy[item.id]) return;
    if (!window.confirm(`Reset ${item.label} to its original image? Any unsaved selection for this image will be discarded.`)) return;
    setBusy(current => ({ ...current, [item.id]: true }));
    setMessage(`${item.label}: resetting…`);
    try {
      const response = await fetch('/api/marketing-media', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Image could not be reset.');
      const draft = drafts[item.id];
      if (draft?.previewUrl) { URL.revokeObjectURL(draft.previewUrl); objectUrls.current.delete(draft.previewUrl); }
      setDrafts(current => { const next = { ...current }; delete next[item.id]; return next; });
      setSaved(current => ({ ...current, [item.id]: result.url }));
      setMessage(`${item.label}: restored to default.`);
    } catch (error) {
      setMessage(`${item.label}: ${error.message || 'Unable to reset image.'}`);
    } finally {
      setBusy(current => ({ ...current, [item.id]: false }));
    }
  };

  return <section className="marketing-media-panel" aria-label="Marketing media image management">
    <p className="mut">Replace an image, preview it, then save it to the public Marketing Services page.</p>
    {message && <p className="marketing-media-status" role="status" aria-live="polite">{message}</p>}
    {['Growth Studio', 'Marketing Services'].map(group => <section key={group} className="marketing-media-group">
      <h2>{group}</h2>
      <div className="marketing-media-grid">
        {marketingMediaItems.filter(item => item.group === group).map(item => {
          const draft = drafts[item.id];
          const isBusy = Boolean(busy[item.id]);
          const isServiceImage = item.group === 'Marketing Services';
          const previewUrl = draft?.previewUrl || saved[item.id] || item.defaultUrl;
          return <article className="marketing-media-card" key={item.id}>
            <h3>{item.label}</h3>
            <div className={`marketing-media-previews${isServiceImage ? ' marketing-service-media-previews' : ''}`}>
              {isServiceImage ?
                <div className="marketing-service-original-preview"><span>Original Image</span><div className="marketing-service-original-frame"><img src={previewUrl} alt={`${item.label} preview`} /></div></div>
              : <>
                <div><span>Current saved image</span><img src={saved[item.id] || item.defaultUrl} alt={`${item.label} saved preview`} /></div>
                {draft && <div><span>New preview</span><img src={draft.previewUrl} alt={`${item.label} new preview`} />
                  </div>}
              </>}
            </div>
            <input ref={node => { inputRefs.current[item.id] = node; }} type="file" accept="image/jpeg,image/png,image/webp" onChange={event => chooseFile(item, event)} hidden />
            <div className="row marketing-media-actions">
              <button type="button" className="btn ghost sm" disabled={isBusy} onClick={() => inputRefs.current[item.id]?.click()}>{draft ? 'Choose another image' : 'Replace image'}</button>
              <button type="button" className="btn sm" disabled={!draft || isBusy} onClick={() => save(item)}>{isBusy ? 'Saving…' : 'Save changes'}</button>
              <button type="button" className="btn ghost sm" disabled={isBusy || (!draft && saved[item.id] === item.defaultUrl)} onClick={() => reset(item)}>Reset to default</button>
            </div>
          </article>;
        })}
      </div>
    </section>)}
  </section>;
});

export default MarketingMediaPanel;
