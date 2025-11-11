import path from "path";
import express from "express";
import { createServer } from "./index";

const app = createServer();
const port = process.env.PORT || 3000;

// Resolve current directory (for ESM)
const __dirname = import.meta.dirname;

// Path to your built frontend files
const distPath = path.join(__dirname, "../spa");

// Serve static assets (React/Vite/Next build output)
app.use(express.static(distPath));

/**
 * Simple health check route for Render
 */
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

/**
 * SPA fallback:
 * Serve index.html for any non-API route
 * (avoids path-to-regexp error from app.get("*"))
 */
app.get(/^(?!\/api\/|\/health).*/, (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`🚀 SHY Community server running on port ${port}`);
  console.log(`🌐 Frontend available at http://localhost:${port}`);
  console.log(`🔧 API base URL: http://localhost:${port}/api`);
});

/**
 * Graceful shutdown handlers
 */
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
