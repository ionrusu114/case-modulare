# Vite 8 — Production build, chunking, library mode, SSR

## Build options (`build.*`)
| Option | Default | Notes |
|---|---|---|
| `target` | `'baseline-widely-available'` | Chrome/Edge ≥111, FF ≥114, Safari ≥16.4 |
| `outDir` | `dist` | output folder |
| `assetsInlineLimit` | `4096` | bytes; smaller assets inline as base64 |
| `sourcemap` | `false` | `true` / `'inline'` / `'hidden'` |
| `minify` | Oxc | `'esbuild'` needs esbuild installed; `'terser'` needs terser |
| `cssCodeSplit` | `true` | CSS split per async chunk |
| `rolldownOptions` | — | low-level bundler config (was `rollupOptions`) |
| `lib` | — | library mode (below) |
| `ssr` | — | SSR entry / flag |

## Chunking (Vite 8)
`output.manualChunks` **object form is removed**; function form is deprecated. Use Rolldown's `advancedChunks`:
```ts
build: {
  rolldownOptions: {
    output: {
      advancedChunks: {
        groups: [
          { name: 'vue-vendor', test: /node_modules\/(vue|vue-router|pinia)\// },
          { name: 'vendor', test: /node_modules\// },
        ],
      },
    },
  },
}
```
For most apps, the default automatic chunking is fine — only customize when you have a measured reason (e.g. splitting a heavy vendor). Skip manual chunking during the SSR pass (`isSsrBuild`).

## Library mode
```ts
build: {
  lib: {
    entry: path.resolve(__dirname, 'src/index.ts'),
    name: 'MyLib',
    fileName: 'my-lib',
    formats: ['es', 'umd'],   // single entry default; ['es','cjs'] for multi-entry
  },
  rolldownOptions: {
    external: ['vue'],                       // don't bundle peers
    output: { globals: { vue: 'Vue' } },     // for UMD
  },
}
```

## SSR
```bash
vite build                         # client build
vite build --ssr src/entry-server.ts   # server build
vite build --ssrManifest           # emit manifest for preload directives
```
- Branch SSR-specific config with `isSsrBuild` in the config function.
- `resolve.conditions`, `ssr.noExternal`, `ssr.external` control how deps are bundled for the server.
- `import.meta.env.SSR` is `true` in server code — guard browser-only APIs (`window`, `document`).
- For Vue static-site generation, `vite-ssg` builds on this: prerenders routes to crawlable HTML (good for SEO). Set route `meta` to mark prerendered pages; skip `manualChunks`/`advancedChunks` for the SSR build pass.

## Preview the production build
```bash
vite preview            # serves dist/ locally (NOT a production server — test only)
```

## Build checklist
- Run type-check (`vue-tsc --noEmit`) and lint BEFORE/alongside build — Vite won't catch type errors.
- Verify `base` matches the deploy path (subpath hosting breaks asset URLs otherwise).
- Confirm only `VITE_`-prefixed env reached the client bundle (no secrets leaked).
- Check final chunk sizes; add an `advancedChunks` group only if a vendor is measurably too big.
- For SSR/SSG, confirm prerendered HTML contains the SEO `<title>`/meta (not just an empty app shell).
