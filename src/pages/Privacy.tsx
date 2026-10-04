import { Link } from 'react-router-dom';

export function Privacy() {
  return (
    <div className="shell detail">
      <Link to="/" className="back-link">
        ← Atlas index
      </Link>
      <h1 className="case-hero" style={{ display: 'block', marginTop: '1rem' }}>
        Privacy
      </h1>
      <p className="case-sub">First-party log for this site only. No sale of visitor lists.</p>
      <div className="legend">
        <article>
          <h3>What is stored</h3>
          <p>
            If you allow analytics: a random session id, pages opened, time the tab stayed visible,
            device/browser, language, referrer, and UTM tags from ads. IP is hashed, not shown as a
            raw address. If you send a brief: name, email, company, budget, and message.
          </p>
        </article>
        <article>
          <h3>What is not stored</h3>
          <p>
            No keystrokes, no passwords, no third-party ad network by default. Essential-only skips
            the visit log; the hire form still works.
          </p>
        </article>
      </div>
    </div>
  );
}
