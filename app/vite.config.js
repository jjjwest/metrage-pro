import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Don't inherit the parent Vue project's PostCSS config.
  css: { postcss: { plugins: [] } },
  server: { port: 5174, host: true },
  test: {
    environment: 'node',
    globals: false,
    include: ['src/tests/**/*.test.{js,jsx}'],
  },
});
