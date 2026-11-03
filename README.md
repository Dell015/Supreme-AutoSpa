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

## Owner admin (`/admin`)

A private page for the owner: requests inbox, status buttons, reply templates, notes, insights and CSV export. It is `noindex`, excluded from the sitemap and blocked in `robots.txt`.

- **Demo mode (default):** no database. Sample requests plus any quote sent from the site on the same browser are stored in `localStorage`. Good for showing the owner.
- **Live mode:** create a Supabase project, run `supabase/schema.sql`, create one user for the owner (Authentication > Users) and turn off public sign-ups. Put the project URL and anon key in `.env` (see `.env.example`) and in Vercel's environment variables, then redeploy. The quote form then saves every request to the database, and the admin signs in with that user.
