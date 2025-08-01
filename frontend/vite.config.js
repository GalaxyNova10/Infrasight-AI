// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This tells Vite that 'pages' means 'src/pages', etc.
      'components': path.resolve(__dirname, './src/components'),
      'pages': path.resolve(__dirname, './src/pages'),
    },
  },
  // Add this server configuration block
  server: {
    host: true, // Listen on all network interfaces
    port: 3000, // Force Vite to use port 3000
  },
});