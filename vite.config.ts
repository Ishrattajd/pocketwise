import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'PocketWise - Student Money Manager',
        short_name: 'PocketWise',
        description: 'Mobile-first PWA for students to manage expenses, savings goals, scholarships, and campus jobs.',
        theme_color: '#0F766E',
        background_color: '#FAF7F2',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'firebase/ai': path.resolve(__dirname, './src/services/firebaseAiShim.ts'),
    },
  },
  test: {
    root: path.resolve(__dirname),
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
