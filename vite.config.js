import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'vue': 'vue/dist/vue.esm-bundler.js'
    },
  },
  css: {
    postcss: {
      plugins: [
        postcssImport(),
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
  server: {
    port: 5173,
    host: true,
    hmr: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
});