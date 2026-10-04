import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { readConsent, writeConsent } from '../lib/consent';

export function ConsentBanner() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;
    setOpen(readConsent() === 'unset');
  }, [location.pathname]);

  if (!open) return null;

  return (
    <div className="consent" role="dialog" aria-label="Analytics consent">
      <p>
        I use a first-party log to see which pages a visitor opened and how long they stayed — so ads
        and outreach are not guesswork. No third-party ads pixels unless you add them later.{' '}
        <Link to="/privacy">Privacy</Link>
      </p>
      <div className="consent-actions">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            writeConsent('needed');
            setOpen(false);
          }}
        >
          Essential only
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            writeConsent('all');
            setOpen(false);
          }}
        >
          Allow analytics
        </button>
      </div>
    </div>
  );
}
