import { Link, Outlet } from 'react-router-dom';
import { contacts, person } from '../data/person';
import { Compass } from './Compass';
import { ConsentBanner } from './ConsentBanner';
import { Crosshair } from './Crosshair';
import { VisitorTracker } from './VisitorTracker';

function isExternal(href: string) {
  return href.startsWith('http');
}

export function Layout() {
  return (
    <>
      <div className="hatch" aria-hidden="true" />
      <div className="ticks" aria-hidden="true" />
      <Crosshair />
      <VisitorTracker />
      <header className="site-header">
        <div className="shell header-inner">
          <Link to="/" className="logo">
            <Compass className="logo-compass" />
            {person.mark} · {person.display}
          </Link>
          <nav aria-label="Primary">
            <Link to="/#work">Work</Link>
            <Link to="/#hire">Hire</Link>
            <a href={`mailto:${person.email}`}>Mail</a>
            <a href={person.telegram} target="_blank" rel="noreferrer">
              Telegram
            </a>
            <a href={person.whatsapp} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a href={person.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="shell footer-inner">
          <p>
            {person.display} — {person.title}
          </p>
          <p className="footer-contacts">
            {contacts.map((c, i) => (
              <span key={c.id}>
                {i > 0 ? ' · ' : null}
                <a
                  href={c.href}
                  {...(isExternal(c.href) ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                  {c.label}
                </a>
              </span>
            ))}
            {' · '}
            <Link to="/privacy">Privacy</Link>
            {' · '}© {new Date().getFullYear()}
          </p>
        </div>
      </footer>
      <ConsentBanner />
    </>
  );
}
