import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
    host: true,
    open: true,
  },
  build: {
    minify: 'esbuild',
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    cssCodeSplit: true,
    cssMinify: true,
    chunkSizeWarningLimit: 2000,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router'],
          'vendor-ui': [
            'radix-ui',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-popover',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-slot',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-tabs',
          ],
          'vendor-data': ['@tanstack/react-table', '@tanstack/react-query'],
          'vendor-forms': ['react-hook-form', 'zod', '@hookform/resolvers'],
          'vendor-utils': [
            'clsx',
            'tailwind-merge',
            'class-variance-authority',
            'date-fns',
            'axios',
          ],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router',
      '@tanstack/react-table',
      '@tanstack/react-query',
    ],
  },
});
