import { defineConfig } from 'vite';
import fs from 'fs';

// Externalize ALL Node deps so Rollup doesn't try to bundle them
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const externals = [
  /^node:.*/,                          // node:fs etc.
  ...Object.keys(pkg.dependencies || {})  // express, mongoose, cloudinary, etc.
];

export default defineConfig({
  build: {
    outDir: 'dist/server',
    emptyOutDir: false,        // keep client dist
    ssr: true,
    target: 'node20',
    lib: {
      entry: 'server/node-build.ts',
      formats: ['es']
    },
    rollupOptions: {
      external: externals,
      output: { 
        inlineDynamicImports: true,
        entryFileNames: 'node-build.mjs'
      }
    },
    minify: false
  },
  // IMPORTANT: no client plugins here (no react-swc, no UI plugins)
  plugins: []
});
