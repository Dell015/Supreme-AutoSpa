# Supreme AutoSpa website (concept preview)

Astro static site. Fonts are self-hosted (Russo One + Archivo).

```
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs ./dist
```

## Deploy to Vercel
Import the folder, framework preset **Astro**, defaults for everything else.
When supreme-autospa.com is connected, change `site` in `astro.config.mjs` and `url` in `src/data/site.ts`.

## Editing content
All facts (phone, hours, services, photos, reviews) live in `src/data/site.ts`.
- Footer credit: fill `credit.name` (and `credit.url`) in `src/data/site.ts`.
- Quote form: it builds a message and hands off to Messenger / SMS / email. To store leads later, set `data-endpoint` on the form in `src/pages/quote.astro`.
