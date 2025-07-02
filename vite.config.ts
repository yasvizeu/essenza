// vite.config.ts

import { defineConfig } from 'vite';

export default defineConfig({
  // If you're building a Universal (SSR) app, `noExternal` is important
  // for making sure @angular/localize is bundled correctly for the server.
  // This is often what fixes the "$localize is not defined" error in SSR.
  ssr: {
    noExternal: [/^@angular\/localize/],
  },
  // The `optimizeDeps` section is generally for client-side pre-bundling during dev.
  // Including '@angular/localize/init' here is not harmful, but the primary
  // fix for "$localize is not defined" is usually the import in polyfills.ts/main.ts
  // and/or correct SSR bundling (`noExternal`).
  optimizeDeps: {
    include: ['@angular/localize/init'],
  },
});