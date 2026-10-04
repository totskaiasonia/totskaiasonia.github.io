# Sofiia Totska — work atlas

Live static site: **https://totskaiasonia.github.io/**  
Source: **https://github.com/totskaiasonia/totskaiasonia.github.io**

GitHub Pages is static. Visitor logs, briefs, and `/admin` need the small Node API.

## Local

```bash
npm install
npm run dev:api          # http://127.0.0.1:8787
npm run dev              # http://localhost:5173  (proxies /api)
```

Admin: http://localhost:5173/admin  
Default password: `atlas-dev` (set `ADMIN_PASSWORD` before a public host).

Ads links can carry UTMs, e.g. `https://totskaiasonia.github.io/?utm_source=instagram&utm_medium=cpc&utm_campaign=launch`

## Production with analytics

Build, then run the API so it also serves `dist/`:

```bash
npm run build
ADMIN_PASSWORD='…' npm start
```

Point the public domain at that process (Render, Railway, Fly). If the UI stays on GitHub Pages, rebuild with `VITE_API_URL=https://your-api.example`.
