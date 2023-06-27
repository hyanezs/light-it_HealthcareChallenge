import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr';

export default defineConfig(() => ({
  resolve: {
    alias: [{ find: /^~/, replacement: '' }],
  },
  server: {
    port: 3000,
  },
  plugins: [
    react(),
    eslint(),
    svgr({
      exportAsDefault: true,
    }),
  ],
}));
