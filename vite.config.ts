import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { compression } from 'vite-plugin-compression2'
import { fileURLToPath, URL } from 'node:url'

// Performance-first config:
// - Tailwind v4 via official Vite plugin (no PostCSS pass)
// - brotli + gzip precompression of build assets
// - GSAP split into its own chunk (loaded lazily, see useGsap.ts)
// - first paint never waits for (or competes with) CSS/JS requests, see firstPaintFirst()
// - vite-ssg (see main.ts) prerenders real HTML for instant first paint + SEO

// The prerendered HTML is complete on its own (copy, images, CSS hero entrance), so the page is
// painted before any request beyond HTML + hero image + fonts:
// - the small app stylesheet is inlined as <style> (no render-blocking CSS request);
// - the entry module is injected after window load instead of from <head>, so Vue hydration and
//   its chunks start once the hero (LCP) is on screen. Anchors work without JS meanwhile.
// vite-ssg prerenders from this transformed index.html, so every page gets both.
function firstPaintFirst(): Plugin {
  return {
    name: 'first-paint-first',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, { bundle }) {
        if (!bundle) return html
        let inlined = 0
        let deferred = 0
        const out = html
          .replace(/<link rel="stylesheet"[^>]*href="\/(assets\/[^"]+\.css)"[^>]*>/g, (tag, file: string) => {
            const asset = bundle[file]
            if (asset?.type !== 'asset') return tag
            inlined++
            return `<style>${String(asset.source)}</style>`
          })
          .replace(/<script type="module"[^>]*src="(\/assets\/[^"]+\.js)"[^>]*><\/script>/, (_tag, src: string) => {
            deferred++
            // After load, wait until the LCP image (fetchpriority=high) is decoded, then give raster a
            // short head start (0.6s) so the image is on screen before hydration takes the CPU. The first
            // interaction (incl. focusing a form field) hydrates at once; the 4s timer covers a stalled
            // load or a background tab.
            return `<script>(()=>{let d=0;const ev=['pointerdown','keydown','touchstart','wheel','focusin'];const go=()=>{if(d++)return;ev.forEach(e=>removeEventListener(e,go));const s=document.createElement('script');s.type='module';s.src='${src}';document.head.append(s)};ev.forEach(e=>addEventListener(e,go,{passive:true}));addEventListener('load',()=>{const i=document.querySelector('img[fetchpriority=high]');Promise.resolve(i&&i.decode()).catch(()=>{}).then(()=>setTimeout(go,600))},{once:true});setTimeout(go,4000)})()</script>`
          })
        // Fail loudly if a Vite upgrade changes the emitted tags: a silent no-op would bring back
        // render-blocking CSS and an eager entry script.
        if (!inlined || !deferred) throw new Error(`first-paint-first: inlined ${inlined} CSS, deferred ${deferred} entry scripts`)
        return out
      },
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    firstPaintFirst(),
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
    // No <link rel="modulepreload"> in <head>: chunks load with the deferred entry (firstPaintFirst).
    modulePreload: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'three' // only the unused CapsuleHero imports three; never in the page
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
