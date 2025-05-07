import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Exposes to external network
    port: 3000,
    allowedHosts: [
      'satellite-detector-1.onrender.com', // Add the external host here
    ],
    proxy: {
      '/api': 'http://localhost:5000', // If you're using a backend API, set up the proxy here
    },
  },
});
