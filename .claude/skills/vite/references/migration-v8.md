# Vite 7 → 8 migration & deprecations

Vite 8 swaps the esbuild+Rollup dual stack for a single **Rolldown** bundler + **Oxc** transformer. A compat layer auto-converts most old options (with deprecation warnings) and most plugins keep working. Use this file to fix warnings and avoid removed APIs.

## Prerequisites
- **Node.js 20.19+ or 22.12+** (Node 18 dropped).
- Optional staged path: adopt `rolldown-vite` on Vite 7 first (drop-in), then upgrade to Vite 8.
- Install size grows ~15 MB (Lightning CSS + Rolldown bundled).

## Renamed options (old auto-converts, will be removed later — update them)
| Old | New |
|---|---|
| `build.rollupOptions` | `build.rolldownOptions` |
| `worker.rollupOptions` | `worker.rolldownOptions` |
| `optimizeDeps.esbuildOptions` | `optimizeDeps.rolldownOptions` |
| `esbuild` config key | `oxc` (`esbuild.jsx`→`oxc.jsx`, `esbuild.define`→`oxc.define`) |

## Minify
- Default minify uses Oxc — no extra package.
- `build.minify: 'esbuild'` still works but now requires `esbuild` as a devDependency.
- `build.minify: 'terser'` still requires `terser`.

## Removed / no-op
- `output.manualChunks` **object form removed**; function form deprecated → use `output.advancedChunks`.
- `resolve.alias[].customResolver` removed → use a plugin `resolveId` hook.
- `build.commonjsOptions` → no-op (Rolldown handles CJS).
- `build.dynamicImportVarsOptions.warnOnError` → no-op.
- `build.rollupOptions.watch.chokidar` removed.
- Rolldown does not support output `format: 'system'` or `'amd'`.
- Rollup hooks not available: `shouldTransformCachedModule`, `resolveImportMeta`, `renderDynamicImport`, `resolveFileUrl` — plugins relying on these need rework.

## Behavior changes
- **`import.meta.hot.accept(dep, cb)` takes a module id, not a URL.** Update any HMR code passing URLs.
- `build.target` default raised to `'baseline-widely-available'` (newer browsers). Set explicitly if you must support older.
- **Lightning CSS** is the default CSS minifier.
- The JS `build()` API throws `BundleError` (catch that type).
- Plugin `load`/`transform` returning non-JS-typed JS should return `{ code, moduleType: 'js' }`.

## New in Vite 8 (adopt where useful)
- `resolve.tsconfigPaths: true` — resolve aliases from tsconfig `paths` (stop duplicating in `resolve.alias`).
- `server.forwardConsole` — browser console/errors in the terminal.
- `devtools` option — Vite Devtools.
- Built-in `emitDecoratorMetadata`; `.wasm?init` in SSR.
- **Full Bundle Mode** (experimental) — much faster dev startup/reloads.

## Quick fix recipe
1. Bump Node if needed.
2. Rename `rollupOptions`→`rolldownOptions`, `esbuildOptions`→`rolldownOptions`, `esbuild`→`oxc`.
3. Replace any `manualChunks` with `advancedChunks` (or delete and use defaults).
4. If you set `minify: 'esbuild'`, either install `esbuild` or drop the option (Oxc default is fine).
5. Audit HMR code for URL args to `accept`.
6. Run dev + build + `vue-tsc` and resolve remaining deprecation warnings.
