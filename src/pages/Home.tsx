import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { contacts, person } from '../data/person';
import { projects } from '../data/projects';
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
    if (window.location.hash === '#work') {
      document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
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
              <a className="btn" href="#work">
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

        <aside className="about-strip">
          <h2>How this index is drawn</h2>
          <div>
            <p>
              Survey marks, hatch, and a rotating compass are the site’s own language — not the
              brands’. Product screenshots and reels come from the live domains. Built as a static
              Vite atlas so a CV link stays independent of product repos.
            </p>
            <div className="chip-row">
              <span className="chip">Vite · React 19</span>
              <span className="chip">TypeScript</span>
              <span className="chip">Framer Motion</span>
              <span className="chip">English</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
