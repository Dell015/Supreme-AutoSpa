import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Change `site` to the live domain when supreme-autospa.com is connected.
export default defineConfig({
  site: 'https://supreme-autospa.com',
  integrations: [sitemap({ filter: (p) => !p.includes('/admin') })],
  build: { inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
