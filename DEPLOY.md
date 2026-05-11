# Deploy qisqa yo‘riqnoma

## Variant A — bitta server (Render / VPS / Docker)

Barcha foydalanuvchilar bitta HTTPS domen orqali ochadi; API va statik bitta `npm start` da.

1. **Environment** (`server/.env` yoki hosting paneli):
   - `NODE_ENV=production`
   - `TELEGRAM_BOT_TOKEN` — BotFather token
   - `PUBLIC_APP_URL=https://sizning-domen.uz` — Mini App ochiladigan to‘liq URL (CORS uchun)
   - `TRUST_PROXY=1` — agar Nginx/Render reverse proxy bo‘lsa

2. **BotFather**: Web App URL = shu HTTPS domen (masalan `https://sizning-domen.uz/`).

3. **Render**: `render.yaml` bilan Blueprint yoki qo‘lda Web Service — `buildCommand` / `startCommand` faylda ko‘rsatilganidek.

4. **Docker**: repo ildizidan `docker build -t toza-yurak .` va `docker run --env-file server/.env -p 3847:3847 toza-yurak` (hosting PORT ni moslang).

## Variant B — Netlify (frontend) + alohida API (Render va h.k.)

1. API serverni Variant A bo‘yicha ishga tushiring (masalan `https://api.siz.uz`).
2. Netlify **Environment variables**: `TY_BACKEND_URL=https://api.siz.uz` (oxirida `/` yo‘q).
3. Build: `netlify:build` — `_redirects` va `api-config.json` avtomatik.
4. Backend `.env`: `CORS_ORIGINS` ga Netlify domeningizni qo‘shing, masalan `https://siz.netlify.app` yoki `PUBLIC_APP_URL` ni Netlify URL qiling.
5. BotFather Web App URL = Netlify sahifa HTTPS manzili.

## Mahalliy ishlab chiqish

Agar frontend Live Server (boshqa port) da, API esa `3847` da bo‘lsa, `index.html` ichida vaqtincha:

- `ty-api-base="http://127.0.0.1:3847"`
- `ty-api-relative="no"`

Faqat `npm start` bilan ochsangiz, hozirgi standart (`ty-api-relative=yes`, bo‘sh base) yetarli.

## Tekshiruv

- Brauzer: `GET https://SIZING-DOMEN/api/health` → `ok: true`, `dbConnected: true`.
- Telegram: Mini App ichidan kirish va chek yuborish.

## SQLite va hosting

Bepul konteynerlar (masalan Render Free) qayta deployda diskni yangilashi mumkin — `app.db` yo‘qolmasligi uchun doimiy disk / to‘liq VPS ishlating yoki `npm run backup-db` bilan muntazam zaxira oling.
