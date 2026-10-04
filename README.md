# Sofiia Totska — work atlas

GitHub Pages (static): **https://totskaiasonia.github.io/**  
Railway (site + API + admin): **https://web-production-1c9ea.up.railway.app/**  
Admin: **https://web-production-1c9ea.up.railway.app/admin**

Ads links can carry UTMs:

`https://web-production-1c9ea.up.railway.app/?utm_source=instagram&utm_medium=cpc&utm_campaign=launch`

Set `ADMIN_PASSWORD` in the Railway service variables. Visits live on the `/data` volume.

## Local

```bash
npm install
npm run dev:api          # http://127.0.0.1:8787
npm run dev              # http://localhost:5173  (proxies /api)
```
