import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { postJson } from '../lib/api';
import { readConsent } from '../lib/consent';
import { getSessionId, readUtm } from '../lib/session';

export function VisitorTracker() {
  const location = useLocation();
  const lastBeat = useRef(Date.now());

  useEffect(() => {
    readUtm();
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;
    if (readConsent() !== 'all') return;

    const sessionId = getSessionId();
    void postJson('/api/track', {
      sessionId,
      path: `${location.pathname}${location.hash}`,
      title: document.title,
      referrer: document.referrer,
      language: navigator.language,
      ua: navigator.userAgent,
      utm: readUtm(),
    }).catch(() => {});
    lastBeat.current = Date.now();
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;

    const beat = () => {
      if (readConsent() !== 'all') return;
      if (document.visibilityState !== 'visible') return;
      const now = Date.now();
      const deltaMs = now - lastBeat.current;
      lastBeat.current = now;
      void postJson('/api/heartbeat', {
        sessionId: getSessionId(),
        path: `${location.pathname}${location.hash}`,
        deltaMs,
      }).catch(() => {});
    };

    const onConsent = () => {
      if (readConsent() === 'all') beat();
    };

    const id = window.setInterval(beat, 8000);
    document.addEventListener('visibilitychange', beat);
    window.addEventListener('pagehide', beat);
    window.addEventListener('st-consent', onConsent);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', beat);
      window.removeEventListener('pagehide', beat);
      window.removeEventListener('st-consent', onConsent);
    };
  }, [location.pathname, location.hash]);

  return null;
}
