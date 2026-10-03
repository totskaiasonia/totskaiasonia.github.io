import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProject } from '../data/projects';
import { LivePreview } from '../components/LivePreview';
import { fadeUp, stagger } from '../components/motion';

function contrastInk(hex: string): string {
  const h = hex.replace('#', '');
  const r = Number.parseInt(h.slice(0, 2), 16);
  const g = Number.parseInt(h.slice(2, 4), 16);
  const b = Number.parseInt(h.slice(4, 6), 16);
  const luma = (r * 299 + g * 587 + b * 114) / 1000;
  return luma > 150 ? '#08262e' : '#f6efe0';
}

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProject(slug) : undefined;

  if (!project) {
    return (
      <div className="shell missing">
        <p>Plate not found.</p>
        <Link to="/">Return to atlas</Link>
      </div>
    );
  }

  return (
    <motion.div
      className="shell detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Link to="/#work" className="back-link">
        ← Atlas index
      </Link>

      <div className="case-hero">
        <motion.div className="case-hero-copy" variants={stagger} initial="hidden" animate="show">
          <motion.p className="case-kicker" variants={fadeUp}>
            {project.index} · {project.code} · {project.year} · {project.locale}
          </motion.p>
          <motion.h1 variants={fadeUp}>{project.title}</motion.h1>
          <motion.p className="case-sub" variants={fadeUp}>
            {project.subtitle}
          </motion.p>
          <motion.p variants={fadeUp}>{project.tagline}</motion.p>
          {project.links[0] && (
            <motion.a
              className="live-chip"
              variants={fadeUp}
              href={project.links[0].href}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live · {project.liveName}
            </motion.a>
          )}
        </motion.div>
        <div className="atlas-stage atlas-stage--live">
          <LivePreview
            poster={project.poster}
            reel={project.reel}
            alt={`${project.title} live site preview`}
          />
        </div>
      </div>

      <blockquote className="pull">“{project.pullQuote}”</blockquote>

      <div className="legend">
        <article>
          <h3>Problem</h3>
          <p>{project.problem}</p>
        </article>
        <article>
          <h3>Solution</h3>
          <p>{project.solution}</p>
        </article>
        <article>
          <h3>Role</h3>
          <p>{project.role}</p>
        </article>
        <article>
          <h3>Stack</h3>
          <ul className="stack-pills">
            {project.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <h3 className="section-label">Surfaces</h3>
      <div className="surfaces">
        {project.surfaces.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>

      <h3 className="section-label">Highlights</h3>
      <div className="hi-grid">
        {project.highlights.map((h, i) => (
          <div className="hi-card" key={h}>
            <span className="num">{String(i + 1).padStart(2, '0')}</span>
            <p>{h}</p>
          </div>
        ))}
      </div>

      <h3 className="section-label">Field palette (from the product)</h3>
      <div className="palette" role="list" aria-label="Brand palette">
        {project.palette.map((c) => (
          <span
            key={c.hex}
            role="listitem"
            style={{ background: c.hex, color: contrastInk(c.hex) }}
          >
            {c.name} {c.hex}
          </span>
        ))}
      </div>

      {project.links.length > 0 && (
        <>
          <h3 className="section-label">Links</h3>
          <ul className="stack-pills">
            {project.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </motion.div>
  );
}
