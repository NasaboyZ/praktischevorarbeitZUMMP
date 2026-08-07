import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,   // listen on all interfaces so phone can connect via local IP
    port: 5173,
  },
});
