import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: netlify(),
  experimental: {
    viewTransitions: true,
  },
  integrations: [tailwind(), compress()],
});
