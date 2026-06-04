# Vite 8 — Dev server, HMR, assets, workers, WASM

## Dev server (`server.*`)
```ts
server: {
  host: true,            // expose on LAN (or '0.0.0.0'); default 'localhost'
  port: 5173,            // auto-increments if taken unless strictPort
  strictPort: false,
  open: false,
  cors: true,            // default allows localhost/127.0.0.1/[::1]
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      rewrite: (p) => p.replace(/^\/api/, ''),
      ws: true,          // proxy websockets
    },
  },
  warmup: { clientFiles: ['./src/main.ts', './src/App.vue'] },  // pre-transform hot files (kills waterfalls)
  fs: { allow: ['..'], deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**'] },
  forwardConsole: true,  // Vite 8: forward browser console/errors to terminal
  hmr: { overlay: true },// protocol/host/port/path/clientPort also available
}
```
- Proxy keys: string prefix, or start with `^` for regex.
- `server.warmup` is the cheapest dev-speed win for known entry points.
- **Full Bundle Mode** (experimental, Vite 8): ~3× faster startup, fewer requests — opt in per release notes.

## HMR API — `import.meta.hot`
Always guard with `if (import.meta.hot)`. The block is tree-shaken out of production.

```ts
if (import.meta.hot) {
  // 1. self-accepting (this module handles its own update)
  import.meta.hot.accept((newMod) => {
    if (newMod) { /* newMod undefined on syntax error */ }
  })

  // 2. accept an updated dependency — ⚠ Vite 8: pass a module ID, NOT a URL
  import.meta.hot.accept('./store.ts', (newStore) => { /* ... */ })
  import.meta.hot.accept(['./a.ts', './b.ts'], ([a, b]) => { /* ... */ })

  // 3. cleanup before this module is replaced
  import.meta.hot.dispose((data) => { clearInterval(timer); data.count = count })

  // 4. cleanup when module is removed entirely
  import.meta.hot.prune((data) => { /* ... */ })

  // 5. persisted state across updates (mutate, don't reassign)
  import.meta.hot.data.count ??= 0

  // 6. bubble the update to the parent importer
  import.meta.hot.invalidate('reason')

  // 7. custom events
  import.meta.hot.on('my:event', (payload) => {})
  import.meta.hot.send('my:client-event', { ok: true })
}
```
Built-in events to listen for: `vite:beforeUpdate`, `vite:afterUpdate`, `vite:beforeFullReload`, `vite:beforePrune`, `vite:invalidate`, `vite:error`, `vite:ws:connect`, `vite:ws:disconnect`.

In Vue SFCs, `@vitejs/plugin-vue` wires HMR automatically — you rarely write `import.meta.hot` by hand; it's for plain TS modules, stores, and custom logic.

## TypeScript / JSX in dev
- Transpile-only via **Oxc** (no type info) → keep `"isolatedModules": true` in tsconfig and run `vue-tsc --noEmit` separately for type errors.
- Recommended tsconfig: `"moduleResolution": "bundler"`, `"allowImportingTsExtensions": true`, `"skipLibCheck": true`.
- Customize JSX via the `oxc` config key (`oxc.jsxImportSource`, `oxc.jsx`).

## Static assets
```ts
import imgUrl from './logo.png?url'      // resolved URL string
import raw from './shader.glsl?raw'       // file contents as string
import inlined from './icon.svg?inline'   // base64 data URL
new URL('./img.png', import.meta.url)     // dynamic asset URL (kept by bundler)
```
Assets under `build.assetsInlineLimit` (default 4096 bytes) are inlined automatically. Files in `public/` are served at root and copied as-is (reference by absolute path `/file.png`, no import).

## `import.meta.glob`
```ts
// lazy (default): map of path -> dynamic import loader
const pages = import.meta.glob('./pages/**/*.vue')
// eager: map of path -> module
const eager = import.meta.glob('./locales/*.json', { eager: true, import: 'default' })
// with query
const sources = import.meta.glob('./md/*.md', { query: '?raw', import: 'default' })
```
Patterns are relative to the current file (or set `base`). Globs are resolved at build time — paths must be literals, not variables.

## Web Workers
```ts
// recommended (URL form)
const worker = new Worker(new URL('./heavy.ts', import.meta.url), { type: 'module' })
// query form
import HeavyWorker from './heavy?worker'        // constructor
import inlineWorker from './heavy?worker&inline'
import workerUrl from './heavy?worker&url'
import SharedW from './heavy?sharedworker'
```

## WASM
```ts
import init from './add.wasm?init'
const instance = await init(/* optional imports */)
instance.exports.add(1, 2)
```
`?init` works in SSR as of Vite 8. For full module access, use the standard `WebAssembly` API with a `?url` import.
