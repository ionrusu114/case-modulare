import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { compression } from 'vite-plugin-compression2'
import { fileURLToPath, URL } from 'node:url'

// Performance-first config:
// - Tailwind v4 via official Vite plugin (no PostCSS pass)
// - brotli + gzip precompression of build assets
// - GSAP split into its own chunk
// - vite-ssg (see main.ts) prerenders real HTML for instant first paint + SEO
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    // Exclude .html: vite-ssg prerenders/overwrites index.html AFTER this plugin runs, so a
    // precompressed .gz/.br would be the stale pre-render shell. nginx gzips HTML on the fly
    // from the real prerendered file; JS/CSS/SVG stay precompressed (their output is final here).
    compression({ algorithm: 'gzip', exclude: [/\.html$/] }),
    compression({ algorithm: 'brotliCompress', exclude: [/\.html$/] }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    modulePreload: { polyfill: false },
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'three' // lazy: only the /produs configurator pulls this
            if (id.includes('gsap')) return 'gsap'
            if (id.includes('vue') || id.includes('@vue')) return 'vue'
          }
        },
      },
    },
  },
  // vite-ssg
  ssr: { noExternal: ['gsap'] },
})
