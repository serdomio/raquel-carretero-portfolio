// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Tailwind v4 is wired through PostCSS (see postcss.config.mjs) rather than the
// @tailwindcss/vite plugin, which is incompatible with Astro 6's rolldown-vite.
//
// React hosts TinaCMS's contextual ("click-on-page") editing island on /live-edit
// (the rest of the site stays static .astro). It is enabled ONLY for the build,
// NOT for `astro dev`: under Astro 6's rolldown-vite the React dev preamble 500s
// and breaks every page's scripts (the intro splash never dismisses). /live-edit
// works on the rollup build / Tina Cloud anyway, so dev loses nothing.
// https://astro.build/config
const isDev = process.argv.includes('dev');

export default defineConfig({
  integrations: isDev ? [] : [react()],
});
