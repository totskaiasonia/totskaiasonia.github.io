import type { FormEvent } from 'react';
import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { getJson, postJson } from '../lib/api';

const VisitMap = lazy(() =>
  import('../components/VisitMap').then((m) => ({ default: m.VisitMap })),
);

type Utm = { source: string; medium: string; campaign: string };
type PageHit = { path: string; title: string; enteredAt: number; leftAt: number | null; ms: number };
type Session = {
  id: string;
  createdAt: number;
  lastSeenAt: number;
  durationMs: number;
  landing: string;
  referrer: string;
  utm: Utm;
  device: string;
  browser: string;
  language: string;
  timezone?: string;
  country: string;
  countryName?: string;
  city?: string;
  region?: string;
  lat: number | null;
  lon: number | null;
  pages: PageHit[];
  leadIds: string[];
};
type Lead = {
  id: string;
  createdAt: number;
  name: string;
  email: string;
  company: string;
  budget: string;
  message: string;
  sessionId: string;
};
type Overview = {
  summary: {
    visitors: number;
    visitorsToday: number;
    leads: number;
    leadsToday: number;
    avgMs: number;
  };
  sessions: Session[];
  leads: Lead[];
};

const TOKEN_KEY = 'st-admin-token';

function fmtMs(ms: number) {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  if (m < 60) return `${m}m ${rem}s`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

function fmtTime(ms: number) {
  return new Date(ms).toLocaleString();
}

export function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [data, setData] = useState<Overview | null>(null);
  const [tab, setTab] = useState<'sessions' | 'leads'>('sessions');
  const [openId, setOpenId] = useState<string | null>(null);

  async function load(nextToken = token) {
    const overview = await getJson<Overview>('/api/admin/overview', nextToken);
    setData(overview);
  }

  useEffect(() => {
    if (!token) return;
    load(token).catch(() => {
      localStorage.removeItem(TOKEN_KEY);
      setToken('');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const res = (await postJson('/api/admin/login', { password })) as { token: string };
      localStorage.setItem(TOKEN_KEY, res.token);
      setToken(res.token);
      await load(res.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  }

  const open = useMemo(
    () => data?.sessions.find((s) => s.id === openId) ?? null,
    [data, openId],
  );

  if (!token || !data) {
    return (
      <div className="admin-shell">
        <form className="admin-login" onSubmit={login}>
          <p className="kicker">Field ops</p>
          <h1>Admin</h1>
          <p>Sessions, time-on-site, and briefs. Local password — change ADMIN_PASSWORD before a public host.</p>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <button className="btn" type="submit">
            Enter
          </button>
          {error ? <p className="hire-err">{error}</p> : null}
        </form>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <header className="admin-head">
        <div>
          <p className="kicker">Field ops</p>
          <h1>Visitors & briefs</h1>
        </div>
        <button
          className="btn btn-ghost"
          type="button"
          onClick={() => {
            localStorage.removeItem(TOKEN_KEY);
            setToken('');
            setData(null);
          }}
        >
          Sign out
        </button>
      </header>

      <div className="admin-kpis">
        <article>
          <em>Visitors</em>
          <strong>{data.summary.visitors}</strong>
          <span>{data.summary.visitorsToday} today</span>
        </article>
        <article>
          <em>Avg stay</em>
          <strong>{fmtMs(data.summary.avgMs)}</strong>
          <span>across sessions</span>
        </article>
        <article>
          <em>Briefs</em>
          <strong>{data.summary.leads}</strong>
          <span>{data.summary.leadsToday} today</span>
        </article>
      </div>

      <div className="admin-tabs">
        <button type="button" className={tab === 'sessions' ? 'is-on' : ''} onClick={() => setTab('sessions')}>
          Sessions
        </button>
        <button type="button" className={tab === 'leads' ? 'is-on' : ''} onClick={() => setTab('leads')}>
          Briefs
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => load()}>
          Refresh
        </button>
      </div>

      {tab === 'leads' ? (
        <div className="admin-leads">
          {data.leads.length === 0 ? <p>No briefs yet.</p> : null}
          {data.leads.map((lead) => (
            <article key={lead.id}>
              <header>
                <strong>{lead.name}</strong>
                <span>{fmtTime(lead.createdAt)}</span>
              </header>
              <p>
                <a href={`mailto:${lead.email}`}>{lead.email}</a>
                {lead.company ? ` · ${lead.company}` : ''}
                {lead.budget ? ` · ${lead.budget}` : ''}
              </p>
              <p>{lead.message}</p>
            </article>
          ))}
        </div>
      ) : (
        <>
          <Suspense fallback={<div className="admin-map-frame"><div className="admin-map" /></div>}>
            <VisitMap sessions={data.sessions} activeId={openId} onSelect={setOpenId} />
          </Suspense>
          <div className="admin-split">
          <table className="admin-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Stay</th>
                <th>Place</th>
                <th>Device</th>
                <th>Landing</th>
                <th>Campaign</th>
              </tr>
            </thead>
            <tbody>
              {data.sessions.map((s) => (
                <tr key={s.id} className={openId === s.id ? 'is-on' : ''} onClick={() => setOpenId(s.id)}>
                  <td>{fmtTime(s.createdAt)}</td>
                  <td>{fmtMs(s.durationMs)}</td>
                  <td>{[s.city, s.countryName || s.country].filter(Boolean).join(', ') || '—'}</td>
                  <td>
                    {s.device} · {s.browser}
                    {s.leadIds.length ? ' · lead' : ''}
                  </td>
                  <td>{s.landing}</td>
                  <td>{[s.utm.source, s.utm.medium, s.utm.campaign].filter(Boolean).join(' / ') || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <aside>
            {open ? (
              <>
                <h2>Path</h2>
                <p>
                  {[open.city, open.region, open.countryName || open.country].filter(Boolean).join(' · ') ||
                    'Place unknown'}
                  {open.timezone ? ` · ${open.timezone}` : ''}
                </p>
                <p>
                  {open.referrer ? `From ${open.referrer}` : 'Direct / unknown referrer'} · {open.language}
                </p>
                <ol className="admin-path">
                  {open.pages.map((p, i) => (
                    <li key={`${p.path}-${p.enteredAt}-${i}`}>
                      <strong>{p.path}</strong>
                      <span>{fmtMs(p.ms)}</span>
                      {p.title ? <em>{p.title}</em> : null}
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              <p>Select a session or a map mark to see pages and time.</p>
            )}
          </aside>
        </div>
        </>
      )}
    </div>
  );
}
