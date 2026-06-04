---
name: vite
description: MUST be used for any Vite work — config (vite.config.ts), dev server, HMR, env/modes, static assets, glob import, web workers, WASM, dependency pre-bundling, production build, SSR, library mode, and plugins. Targets Vite 8 (Rolldown bundler + Oxc transformer). Load whenever editing vite.config, debugging HMR/dev-server/proxy issues, tuning build output, or writing code that uses import.meta (env/glob/hot/url). Use even for "why is my dev server slow" or "how do I alias @ to src".
license: MIT
metadata:
  version: "8"
  author: phoenixmd-template (sourced from vite.dev v8 docs + antfu/skills)
---

# Vite 8

Next-gen frontend build tool. **Vite 8 = Rolldown** (Rust bundler, replaces the old esbuild+Rollup dual stack) + **Oxc** transformer (replaces esbuild for TS/JSX). Keep the whole project ESM. Type-checking is NOT done by Vite — run `vue-tsc`/`tsc` separately.

**Requires Node.js 20.19+ or 22.12+.** Default build target: `'baseline-widely-available'` (Chrome/Edge ≥111, Firefox ≥114, Safari ≥16.4).

## How to use this skill
Read the section you need below for the common cases. For depth, load the matching reference:

| Need | Read |
|---|---|
| Full config options, conditional config, env/modes, optimizeDeps | `references/config.md` |
| Dev server, proxy, warmup, `import.meta.hot` (HMR), glob, assets, workers, WASM | `references/dev-and-hmr.md` |
| Production build, chunking, library mode, SSR, preview | `references/build-and-ssr.md` |
| Upgrading 7→8 / fixing deprecation warnings | `references/migration-v8.md` |

## Minimal Vue 3 + TS config (the default)
```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  plugins: [vue()],                       // + @vitejs/plugin-vue-jsx() only if you use JSX in Vue
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
    // Vite 8: reuse tsconfig "paths" instead of duplicating aliases:
    // tsconfigPaths: true,
  },
})
```
`@vue/compiler-sfc` ships with the plugin — no peer dep. Pair with a `tsconfig.json` that sets `"moduleResolution": "bundler"`, `"isolatedModules": true`, `"skipLibCheck": true`, and `paths` for `@/*`.

## Conditional config (dev vs build vs SSR)
```ts
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  // command: 'serve' (dev) | 'build'
  if (command === 'serve') return { /* dev-only */ }
  return { /* build-only */ }   // use isSsrBuild to branch the SSR pass (e.g. skip manual chunking)
})
```
Config may be `async`. Read env inside config with `loadEnv(mode, process.cwd(), 'VITE_')`.

## Env vars & modes (write code against these)
- Client sees only **`VITE_`-prefixed** vars via `import.meta.env.VITE_FOO`. Change prefix with `envPrefix`.
- Built-ins: `import.meta.env.MODE | BASE_URL | PROD | DEV | SSR`.
- `.env` load order (later wins; real process env always wins): `.env` → `.env.local` → `.env.[mode]` → `.env.[mode].local`. `.local` files are git-ignored. Never put secrets meant for the client in `VITE_` — they ship to the browser.
- Modes: `--mode staging`; defaults are `development` (dev) / `production` (build). Independent of `NODE_ENV`.
- TS: augment `ImportMetaEnv` in `src/vite-env.d.ts` (which has `/// <reference types="vite/client" />`):
```ts
interface ImportMetaEnv { readonly VITE_API_URL: string }
interface ImportMeta { readonly env: ImportMetaEnv }
```

## Dev features you write in app code
- **Glob import** (compile-time): `import.meta.glob('./pages/**/*.vue')` → `{ path: () => import() }`. Options: `{ eager: true }`, `{ import: 'default' }`, `{ query: '?raw' }`, `{ base: './src' }`.
- **Assets**: `import url from './a.png?url'`, `import txt from './a.txt?raw'`, `import Worker from './w?worker'`, `import init from './m.wasm?init'`. `?inline` forces base64.
- **CSS**: plain `.css` import is injected + HMR'd; `*.module.css` = CSS Modules; Sass/Less/Stylus supported. Lightning CSS is the default minifier (opt into full transform with `css.transformer: 'lightningcss'`).
- **Workers**: `new Worker(new URL('./w.ts', import.meta.url), { type: 'module' })`.
- **HMR**: always guard `if (import.meta.hot) { import.meta.hot.accept(...) }`. ⚠ Vite 8: `accept(dep, cb)` takes a module **id**, not a URL. See `references/dev-and-hmr.md`.

## Top gotchas (Vite 8)
- `build.rollupOptions` → **`build.rolldownOptions`**; `optimizeDeps.esbuildOptions` → **`optimizeDeps.rolldownOptions`**; `esbuild` config key → **`oxc`**. Old names auto-convert but warn.
- `output.manualChunks` **object form is removed**, function form deprecated → use `output.advancedChunks` (or rely on framework chunking).
- `build.minify: 'esbuild'` now requires installing `esbuild`; `'terser'` requires `terser`. Default (Oxc) needs neither.
- `import.meta.hot.accept` no longer accepts a URL — pass an id.
- Avoid **barrel files** (`index.ts` re-export hubs) and prefer explicit import paths — both speed up the dev server. Use `server.warmup.clientFiles` for known hot entries.
- `node_modules/.vite` is the pre-bundle cache; `vite --force` to rebuild it after dependency oddities.

## CLI
```bash
vite                    # dev server (default :5173)
vite build              # production build → dist/
vite build --ssr src/entry-server.ts
vite preview            # serve the built dist/ locally
vite --force            # ignore pre-bundle cache
vite --host             # expose on LAN
```
