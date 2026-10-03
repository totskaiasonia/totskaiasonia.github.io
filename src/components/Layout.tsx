import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { contacts, person } from '../data/person';
import { Compass } from './Compass';
import { Crosshair } from './Crosshair';

function isExternal(href: string) {
  return href.startsWith('http');
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="hatch" aria-hidden="true" />
      <div className="ticks" aria-hidden="true" />
      <Crosshair />
      <header className="site-header">
        <div className="shell header-inner">
          <Link to="/" className="logo">
            <Compass className="logo-compass" />
            {person.mark} · {person.display}
          </Link>
          <nav aria-label="Primary">
            <Link to="/#work">Index</Link>
            {contacts.map((c) => (
              <a
                key={c.id}
                href={c.href}
                {...(isExternal(c.href) ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                {c.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
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
            {' · '}© {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </>
  );
}
