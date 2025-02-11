import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';
import compress from '@playform/compress';

import sentry from '@sentry/astro';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: netlify(),
  viewTransitions: true,
  integrations: [
    tailwind(), 
    compress(), 
    sentry({
      dsn: "https://91804f0aa705c81158735fa2aad01129@o4508803076980736.ingest.us.sentry.io/4508803078553600",
      tracesSampleRate: 0,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0,
      sourceMapsUploadOptions: {
        project: "javascript-astro",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }),
  ],
});