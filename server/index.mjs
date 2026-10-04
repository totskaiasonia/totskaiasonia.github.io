import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dataDir = process.env.DATA_DIR || path.join(root, 'data');
const dataFile = path.join(dataDir, 'visits.json');
const distDir = path.join(root, 'dist');
const PORT = Number(process.env.PORT || 8787);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'atlas-dev';
const TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || ADMIN_PASSWORD;

const empty = { sessions: [], leads: [] };
let db = empty;
let writeQueued = false;

async function load() {
  try {
    const raw = await fs.readFile(dataFile, 'utf8');
    db = JSON.parse(raw);
    if (!Array.isArray(db.sessions)) db.sessions = [];
    if (!Array.isArray(db.leads)) db.leads = [];
  } catch {
    db = { sessions: [], leads: [] };
    await persist();
  }
}

async function persist() {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(db, null, 2));
}

function queueWrite() {
  if (writeQueued) return;
  writeQueued = true;
  setTimeout(() => {
    writeQueued = false;
    persist().catch((err) => console.error('persist failed', err));
  }, 250);
}

function json(res, code, body) {
  const data = JSON.stringify(body);
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  });
  res.end(data);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('invalid json'));
      }
    });
    req.on('error', reject);
  });
}

function cleanIp(value) {
  return String(value || '')
    .replace('::ffff:', '')
    .trim();
}

function headerIps(req) {
  const bags = [
    req.headers['cf-connecting-ip'],
    req.headers['true-client-ip'],
    req.headers['x-real-ip'],
    req.headers['x-forwarded-for'],
    req.socket.remoteAddress,
  ];
  const out = [];
  for (const bag of bags) {
    const parts = String(bag || '')
      .split(',')
      .map(cleanIp)
      .filter(Boolean);
    out.push(...parts);
  }
  return out;
}

function clientIp(req) {
  const ips = headerIps(req);
  return ips.find((ip) => !isPrivateIp(ip)) || ips[0] || '';
}

function ipHash(ip) {
  return crypto.createHash('sha256').update(`${ip}|${TOKEN_SECRET}`).digest('hex').slice(0, 12);
}

function parseUa(ua = '') {
  const mobile = /Mobile|Android|iPhone|iPad/i.test(ua);
  let browser = 'Other';
  if (/Edg\//.test(ua)) browser = 'Edge';
  else if (/Chrome\//.test(ua)) browser = 'Chrome';
  else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) browser = 'Safari';
  else if (/Firefox\//.test(ua)) browser = 'Firefox';
  return { device: mobile ? 'mobile' : 'desktop', browser };
}

function countryFrom(req) {
  return (
    req.headers['cf-ipcountry'] ||
    req.headers['x-vercel-ip-country'] ||
    req.headers['x-country-code'] ||
    ''
  )
    .toString()
    .slice(0, 8);
}

function isPrivateIp(ip) {
  return (
    !ip ||
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip === 'unknown' ||
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    ip.startsWith('127.') ||
    ip.startsWith('fc') ||
    ip.startsWith('fd') ||
    ip.startsWith('fe80:') ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
  );
}

const geoCache = new Map();

async function lookupGeo(ip) {
  if (geoCache.has(ip)) return geoCache.get(ip);
  if (isPrivateIp(ip)) {
    const emptyGeo = { country: '', countryCode: '', city: '', region: '', lat: null, lon: null };
    geoCache.set(ip, emptyGeo);
    return emptyGeo;
  }
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 2500);
  try {
    const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, { signal: ctrl.signal });
    const data = await res.json();
    const lat = Number(data.latitude);
    const lon = Number(data.longitude);
    const geo = data?.success
      ? {
          country: String(data.country || '').slice(0, 56),
          countryCode: String(data.country_code || '').slice(0, 8),
          city: String(data.city || '').slice(0, 56),
          region: String(data.region || '').slice(0, 56),
          lat: Number.isFinite(lat) ? lat : null,
          lon: Number.isFinite(lon) ? lon : null,
        }
      : { country: '', countryCode: '', city: '', region: '', lat: null, lon: null };
    geoCache.set(ip, geo);
    return geo;
  } catch {
    return { country: '', countryCode: '', city: '', region: '', lat: null, lon: null };
  } finally {
    clearTimeout(t);
  }
}

function finiteCoord(value, min, max) {
  const n = Number(value);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}

function applyGeo(session, geo) {
  if (!geo) return false;
  const lat = finiteCoord(geo.lat, -90, 90);
  const lon = finiteCoord(geo.lon, -180, 180);
  const country = String(geo.countryCode || geo.country || geo.countryName || '').slice(0, 56);
  if (lat == null || lon == null) {
    if (!country && !geo.city) return false;
    if (country) session.country = String(geo.countryCode || country).slice(0, 8);
    if (geo.country || geo.countryName) session.countryName = String(geo.country || geo.countryName).slice(0, 56);
    if (geo.city) session.city = String(geo.city).slice(0, 56);
    if (geo.region) session.region = String(geo.region).slice(0, 56);
    return true;
  }
  session.country = String(geo.countryCode || session.country || '').slice(0, 8) || session.country;
  if (geo.country || geo.countryName) session.countryName = String(geo.country || geo.countryName).slice(0, 56);
  if (geo.city) session.city = String(geo.city).slice(0, 56);
  if (geo.region) session.region = String(geo.region).slice(0, 56);
  session.lat = lat;
  session.lon = lon;
  return true;
}

function geoFromBody(body) {
  const lat = finiteCoord(body?.lat, -90, 90);
  const lon = finiteCoord(body?.lon, -180, 180);
  if (lat == null || lon == null) return null;
  return {
    city: String(body.city || '').slice(0, 56),
    region: String(body.region || '').slice(0, 56),
    country: String(body.countryName || '').slice(0, 56),
    countryCode: String(body.country || '').slice(0, 8),
    lat,
    lon,
  };
}

async function fillGeo(session, ip, body) {
  if (applyGeo(session, geoFromBody(body))) {
    queueWrite();
    return;
  }
  const geo = await lookupGeo(ip);
  if (applyGeo(session, geo)) queueWrite();
}

function bearer(req) {
  const h = req.headers.authorization || '';
  return h.startsWith('Bearer ') ? h.slice(7) : '';
}

function signToken() {
  return crypto.createHmac('sha256', TOKEN_SECRET).update('admin').digest('hex');
}

function isAdmin(req) {
  return bearer(req) === signToken();
}

function publicSession(s) {
  return {
    id: s.id,
    createdAt: s.createdAt,
    lastSeenAt: s.lastSeenAt,
    durationMs: s.durationMs,
    landing: s.landing,
    referrer: s.referrer,
    utm: s.utm,
    device: s.device,
    browser: s.browser,
    language: s.language,
    timezone: s.timezone || '',
    country: s.country,
    countryName: s.countryName || '',
    city: s.city || '',
    region: s.region || '',
    lat: s.lat ?? null,
    lon: s.lon ?? null,
    pages: s.pages,
    leadIds: db.leads.filter((l) => l.sessionId === s.id).map((l) => l.id),
  };
}

function summarize() {
  const now = Date.now();
  const day = 86_400_000;
  const sessions = db.sessions;
  return {
    visitors: sessions.length,
    visitorsToday: sessions.filter((s) => now - s.createdAt < day).length,
    leads: db.leads.length,
    leadsToday: db.leads.filter((l) => now - l.createdAt < day).length,
    avgMs:
      sessions.length === 0
        ? 0
        : Math.round(sessions.reduce((a, s) => a + (s.durationMs || 0), 0) / sessions.length),
  };
}

async function serveStatic(req, res, urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  let filePath = path.join(distDir, clean === '/' ? 'index.html' : clean);
  if (!filePath.startsWith(distDir)) {
    res.writeHead(403);
    res.end();
    return;
  }
  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    const types = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webm': 'video/webm',
      '.json': 'application/json',
    };
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    res.end(data);
  } catch {
    const fallback = await fs.readFile(path.join(distDir, 'index.html')).catch(() => null);
    if (fallback) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fallback);
      return;
    }
    res.writeHead(404);
    res.end('not found');
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  const route = url.pathname;

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    });
    res.end();
    return;
  }

  try {
    if (route === '/api/health' && req.method === 'GET') {
      json(res, 200, { ok: true });
      return;
    }

    if (route === '/api/track' && req.method === 'POST') {
      const body = await readBody(req);
      const sessionId = String(body.sessionId || '').slice(0, 64);
      const pagePath = String(body.path || '/').slice(0, 200);
      const title = String(body.title || '').slice(0, 160);
      if (!sessionId || !/^sess_[a-z0-9]+$/i.test(sessionId)) {
        json(res, 400, { error: 'bad session' });
        return;
      }
      const now = Date.now();
      let session = db.sessions.find((s) => s.id === sessionId);
      if (!session) {
        const ua = String(req.headers['user-agent'] || body.ua || '');
        const parsed = parseUa(ua);
        session = {
          id: sessionId,
          createdAt: now,
          lastSeenAt: now,
          durationMs: 0,
          landing: pagePath,
          referrer: String(body.referrer || '').slice(0, 400),
          utm: {
            source: String(body.utm?.source || '').slice(0, 80),
            medium: String(body.utm?.medium || '').slice(0, 80),
            campaign: String(body.utm?.campaign || '').slice(0, 80),
          },
          language: String(body.language || '').slice(0, 32),
          timezone: String(body.timezone || '').slice(0, 64),
          country: countryFrom(req),
          countryName: '',
          city: '',
          region: '',
          lat: null,
          lon: null,
          ipHash: ipHash(clientIp(req)),
          ...parsed,
          pages: [],
        };
        db.sessions.unshift(session);
        if (db.sessions.length > 2000) db.sessions.length = 2000;
        await fillGeo(session, clientIp(req), body);
      } else if (session.lat == null || session.lon == null) {
        await fillGeo(session, clientIp(req), body);
      }
      session.lastSeenAt = now;
      const last = session.pages[session.pages.length - 1];
      if (!last || last.path !== pagePath) {
        if (last && !last.leftAt) {
          last.leftAt = now;
          last.ms = Math.max(0, now - last.enteredAt);
        }
        session.pages.push({ path: pagePath, title, enteredAt: now, leftAt: null, ms: 0 });
        if (session.pages.length > 80) session.pages = session.pages.slice(-80);
      }
      queueWrite();
      json(res, 204, {});
      return;
    }

    if (route === '/api/heartbeat' && req.method === 'POST') {
      const body = await readBody(req);
      const sessionId = String(body.sessionId || '');
      const session = db.sessions.find((s) => s.id === sessionId);
      if (!session) {
        json(res, 204, {});
        return;
      }
      if (session.lat == null || session.lon == null) {
        void fillGeo(session, clientIp(req));
      }
      const now = Date.now();
      const delta = Math.min(30_000, Math.max(0, Number(body.deltaMs) || 0));
      session.durationMs += delta;
      session.lastSeenAt = now;
      const last = session.pages[session.pages.length - 1];
      if (last && last.path === body.path) {
        last.ms += delta;
        last.leftAt = now;
      }
      queueWrite();
      json(res, 204, {});
      return;
    }

    if (route === '/api/leads' && req.method === 'POST') {
      const body = await readBody(req);
      const name = String(body.name || '').trim().slice(0, 80);
      const email = String(body.email || '').trim().slice(0, 120);
      const message = String(body.message || '').trim().slice(0, 2000);
      if (!name || !email || !message || !email.includes('@')) {
        json(res, 400, { error: 'name, email and message are required' });
        return;
      }
      const lead = {
        id: `lead_${crypto.randomBytes(6).toString('hex')}`,
        createdAt: Date.now(),
        name,
        email,
        company: String(body.company || '').trim().slice(0, 120),
        budget: String(body.budget || '').trim().slice(0, 40),
        message,
        sessionId: String(body.sessionId || '').slice(0, 64),
      };
      db.leads.unshift(lead);
      if (db.leads.length > 1000) db.leads.length = 1000;
      queueWrite();
      json(res, 201, { ok: true, id: lead.id });
      return;
    }

    if (route === '/api/admin/login' && req.method === 'POST') {
      const body = await readBody(req);
      if (String(body.password || '') !== ADMIN_PASSWORD) {
        json(res, 401, { error: 'wrong password' });
        return;
      }
      json(res, 200, { token: signToken() });
      return;
    }

    if (route === '/api/admin/overview' && req.method === 'GET') {
      if (!isAdmin(req)) {
        json(res, 401, { error: 'unauthorized' });
        return;
      }
      json(res, 200, {
        summary: summarize(),
        sessions: db.sessions.slice(0, 150).map(publicSession),
        leads: db.leads.slice(0, 150),
      });
      return;
    }

    if (route.startsWith('/api/')) {
      json(res, 404, { error: 'not found' });
      return;
    }

    await serveStatic(req, res, route);
  } catch (err) {
    console.error(err);
    json(res, 500, { error: 'server error' });
  }
});

await load();
server.listen(PORT, '0.0.0.0', () => {
  console.log(`atlas api on http://127.0.0.1:${PORT}`);
});
