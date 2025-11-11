import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from './index.js';
import { connectToDatabase } from './lib/mongodb.js';
import { startRateLimiterCleanup } from './lib/rateLimiter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = createServer();
const PORT = process.env.PORT || 3000;

// Health check for Render
app.get('/healthz', (_req, res) => res.send('ok'));

// Serve SPA
const spaDir = path.join(process.cwd(), 'dist', 'spa');
app.use(express.static(spaDir));

/** ❌ remove this (Express v5 + path-to-regexp v6 throws)
// app.get('*', (_req, res) => res.sendFile(path.join(spaDir, 'index.html')));
*/

/** ✅ replace with a safe fallback (kept last) */
app.use((_req, res) => {
  res.sendFile(path.join(spaDir, 'index.html'));
});

// Start server (do DB connect here if needed)
async function start() {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
    }
    startRateLimiterCleanup();
    app.listen(PORT, () => {
      console.log('Server listening on', PORT);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully');
  process.exit(0);
});

start();
