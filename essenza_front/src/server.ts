import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by serving the Angular application.
 */
app.get('*', (req, res) => {
  res.sendFile(join(browserDistFolder, 'index.html'));
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
const port = process.env['PORT'] || 4000;
app.listen(port, (error: any) => {
  if (error) {
    throw error;
  }

  console.log(`Node Express server listening on http://localhost:${port}`);
});

/**
 * Request handler for compatibility
 */
export const reqHandler = app;
