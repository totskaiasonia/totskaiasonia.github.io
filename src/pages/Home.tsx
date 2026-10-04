import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { contacts, person } from '../data/person';
import { projects } from '../data/projects';
import { HireForm } from '../components/HireForm';
import { PlateCard } from '../components/PlateCard';
import { HeroPortrait } from '../components/ThemeArt';
import { fadeUp, stagger } from '../components/motion';

const ticker = [
  ...projects.map((p) => `${p.code}  ${p.liveName}`),
  'DUBAI · GCC · TBILISI GRID',
];

export function Home() {
  const loop = [...ticker, ...ticker];

  useEffect(() => {
    const id = window.location.hash.replace('#', '');
    if (id === 'work' || id === 'hire') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div>
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {loop.map((item, i) => (
            <span key={`${item}-${i}`}>{item}</span>
          ))}
        </div>
      </div>

      <div className="shell">
        <section className="hero" aria-label="Introduction">
          <motion.div className="hero-copy" variants={stagger} initial="hidden" animate="show">
            <motion.p className="kicker" variants={fadeUp}>
              {person.location} · work atlas 2026
            </motion.p>
            <motion.h1 variants={fadeUp}>
              <span>{person.given}</span>
              <span className="family">{person.family}</span>
            </motion.h1>
            <motion.div className="hero-meta" variants={fadeUp}>
              <p>
                <strong>{person.title}.</strong> {person.tagline}
              </p>
            </motion.div>
            <motion.div className="hero-actions" variants={fadeUp}>
              <a className="btn" href="#hire">
                Hire me
              </a>
              <a className="btn btn-ghost" href="#work">
                View work
              </a>
              {contacts.map((c) => (
                <a
                  key={c.id}
                  className="btn btn-ghost"
                  href={c.href}
                  {...(c.href.startsWith('http')
                    ? { target: '_blank', rel: 'noreferrer' }
                    : {})}
                >
                  <span>{c.label}</span>
                  <em>{c.hint}</em>
                </a>
              ))}
            </motion.div>
          </motion.div>
          <HeroPortrait />
        </section>

        <section id="work" className="work" aria-labelledby="work-heading">
          <div className="work-head">
            <h2 id="work-heading">Four live products</h2>
            <p>Each case is a shipped product, with a real homepage capture and a short scroll reel.</p>
          </div>
          <div className="plates">
            {projects.map((p) => (
              <PlateCard key={p.slug} project={p} />
            ))}
          </div>
        </section>

        <section className="offer" aria-labelledby="offer-heading">
          <div className="work-head">
            <h2 id="offer-heading">What I take on</h2>
            <p>Bilingual storefronts, subscriptions, and the admin that keeps them honest.</p>
          </div>
          <div className="offer-grid">
            <article>
              <h3>Marketplaces</h3>
              <p>Catalog, search, locale routing, seller tools — the MedSahra shape.</p>
            </article>
            <article>
              <h3>Subscriptions</h3>
              <p>Plans, checkout, renewals, delivery rules — the La Boucherie shape.</p>
            </article>
            <article>
              <h3>Growth tools</h3>
              <p>UTMs, short links, analytics surfaces — the tags.ly shape.</p>
            </article>
            <article>
              <h3>Ops admin</h3>
              <p>Queues, roles, media, tickets. The part clients feel after launch.</p>
            </article>
          </div>
        </section>

        <section id="hire" className="hire" aria-labelledby="hire-heading">
          <div className="work-head">
            <h2 id="hire-heading">Start a brief</h2>
            <p>For ads, use UTM tags. They show up next to the visitor in admin.</p>
          </div>
          <HireForm />
        </section>

        <aside className="about-strip">
          <h2>How this index is drawn</h2>
          <div>
            <p>
              Survey marks, hatch, and a rotating compass are the site’s own language — not the
              brands’. Product screenshots and reels come from the live domains.
            </p>
            <div className="chip-row">
              <span className="chip">Vite · React 19</span>
              <span className="chip">TypeScript</span>
              <span className="chip">First-party analytics</span>
              <span className="chip">English</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
