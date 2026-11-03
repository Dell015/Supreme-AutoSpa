import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Change site to the live domain once supreme-autospa.com is connected on Vercel (and in src/data/site.ts and public/robots.txt).
export default defineConfig({
  site: 'https://supreme-auto-spa-kappa.vercel.app',
  integrations: [sitemap({ filter: (p) => !p.includes('/admin') })],
  build: { inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
