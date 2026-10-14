'use client';
import { useEffect, useRef, useState } from 'react';

// Portrait / narrow screens get the 9:16 cut, everything else the 16:9 one.
const MOBILE_QUERY = '(max-width: 767px), (orientation: portrait)';

// Muted looping background video. WebM (VP9) is preferred; browsers that can't
// play it (older Safari/iOS) fall through to the H.264 MP4. The poster shows
// instantly and stays visible if playback is blocked or fails.
export default function HeroVideo() {
  const ref = useRef(null);
  // Visitors can stop the loop (WCAG 2.2.2); that choice outranks autoplay.
  const [stopped, setStopped] = useState(false);
  const stoppedRef = useRef(false);
  // Chosen on the client so each device downloads only its own cut.
  const [variant, setVariant] = useState(null);
  useEffect(() => {
    const mq = matchMedia(MOBILE_QUERY);
    const pick = () => setVariant(mq.matches ? 'mobile' : 'desktop');
    pick();
    mq.addEventListener('change', pick);
    return () => mq.removeEventListener('change', pick);
  }, []);
  useEffect(() => {
    const video = ref.current;
    if (!video || !variant) return;
    // Sources changed: reload, then resume unless the visitor stopped it.
    video.load();
    if (!stoppedRef.current) video.play().catch(() => {});
  }, [variant]);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // React does not reliably render the muted attribute, and iOS refuses
    // to autoplay without it, so set it on the element directly.
    video.muted = true;
    video.defaultMuted = true;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) { stoppedRef.current = true; setStopped(true); }
    const play = () => { if (!stoppedRef.current && !document.hidden) video.play().catch(() => {}); };
    // Only spend CPU and battery while the hero is on screen.
    let visible = true;
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visible ? play() : video.pause(); });
    io.observe(video);
    const onVisibility = () => { document.hidden || !visible ? video.pause() : play(); };
    document.addEventListener('visibilitychange', onVisibility);
    play();
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', onVisibility); };
  }, []);
  const toggle = () => {
    const video = ref.current, next = !stopped;
    stoppedRef.current = next; setStopped(next);
    next ? video.pause() : video.play().catch(() => {});
  };
  return <>
    <div className="stage-art" aria-hidden="true"><video ref={ref} className="stage-video" poster={`/video/grostage-${variant === 'mobile' ? 'mobile' : 'desktop'}-poster.jpg`} muted loop playsInline autoPlay preload="auto" disablePictureInPicture disableRemotePlayback aria-hidden="true" tabIndex={-1}>
      {variant && <>
        <source src={`/video/grostage-${variant}.webm`} type='video/webm; codecs="vp9"' />
        <source src={`/video/grostage-${variant}.mp4`} type='video/mp4; codecs="avc1.64001F"' />
      </>}
    </video></div>
    <button type="button" className="video-toggle" onClick={toggle} aria-label={stopped ? 'Play background video' : 'Pause background video'}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{stopped ? <path d="M7 4.5v15l13-7.5z" /> : <><rect x="6" y="4.5" width="4" height="15" rx="1" /><rect x="14" y="4.5" width="4" height="15" rx="1" /></>}</svg>
    </button>
  </>;
}
