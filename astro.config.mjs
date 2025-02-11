import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';
import compress from '@playform/compress';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: netlify(),
  viewTransitions: true,
  // experimental: {
  //   viewTransitions: true,
  // },
  integrations: [tailwind(), compress()],
});
