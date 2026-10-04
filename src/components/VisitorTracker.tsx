import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { postJson } from '../lib/api';
import { readConsent } from '../lib/consent';
import { lookupClientGeo } from '../lib/geo';
import { getSessionId, readUtm } from '../lib/session';

export function VisitorTracker() {
  const location = useLocation();
  const lastBeat = useRef(Date.now());

  useEffect(() => {
    readUtm();
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;

    const sendTrack = () => {
      if (readConsent() !== 'all') return;
      const sessionId = getSessionId();
      const path = `${location.pathname}${location.hash}`;
      void (async () => {
        const geo = await lookupClientGeo();
        await postJson('/api/track', {
          sessionId,
          path,
          title: document.title,
          referrer: document.referrer,
          language: navigator.language,
          ua: navigator.userAgent,
          utm: readUtm(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          ...(geo || {}),
        });
      })().catch(() => {});
      lastBeat.current = Date.now();
    };

    sendTrack();
    window.addEventListener('st-consent', sendTrack);
    return () => window.removeEventListener('st-consent', sendTrack);
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

    const id = window.setInterval(beat, 8000);
    document.addEventListener('visibilitychange', beat);
    window.addEventListener('pagehide', beat);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', beat);
      window.removeEventListener('pagehide', beat);
    };
  }, [location.pathname, location.hash]);

  return null;
}
