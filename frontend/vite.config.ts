import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/AI-Generated-Image-Detector",
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
