# Vite 8 — Config, env, optimizeDeps

## Config file
Auto-resolved: `vite.config.{ts,js,mjs,cjs}` at project root. Always use `defineConfig` for types.

### Top-level options (most-used)
| Option | Purpose |
|---|---|
| `root` | project root (default cwd) |
| `base` | public base path for deployment (e.g. `/app/`) |
| `plugins[]` | Vite/Rollup-compatible plugins |
| `resolve.alias` | path aliases (`{ '@': path.resolve(__dirname,'src') }`) |
| `resolve.tsconfigPaths` | **Vite 8**: resolve aliases from tsconfig `paths` automatically |
| `resolve.dedupe` | force single copy of a dep (e.g. `['vue']`) |
| `define` | compile-time global replacements (`__APP_VERSION__`) |
| `envDir` / `envPrefix` | where `.env` lives / client var prefix (default `VITE_`) |
| `css` | `{ modules, preprocessorOptions, transformer, postcss, devSourcemap }` |
| `server` | dev server (see dev-and-hmr.md) |
| `build` | production build (see build-and-ssr.md) |
| `optimizeDeps` | dependency pre-bundling (below) |
| `environments` | multi-environment config (below) |
| `oxc` | transform options (was `esbuild`): `jsx`, `jsxImportSource`, `define` |
| `devtools` | **Vite 8**: Vite Devtools integration |

### Conditional + async config
```ts
import { defineConfig, loadEnv } from 'vite'
export default defineConfig(async ({ command, mode, isSsrBuild, isPreview }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')   // read .env in config
  return {
    define: { __API__: JSON.stringify(env.VITE_API_URL) },
    plugins: [/* ... */],
  }
})
```
- `command`: `'serve'` (dev/preview) | `'build'`.
- `isSsrBuild`: true only during `vite build --ssr`.
- `isPreview`: true under `vite preview`.

## Env & modes
- Exposed to client: only `import.meta.env.VITE_*` (+ built-ins `MODE`, `BASE_URL`, `PROD`, `DEV`, `SSR`).
- `.env` precedence (later overrides earlier; existing process env always wins):
  `.env` → `.env.local` → `.env.[mode]` → `.env.[mode].local`.
- `.env.local` and `.env.[mode].local` are git-ignored — put machine-local overrides there.
- Mode default: `development` for `vite`, `production` for `vite build`; override with `--mode`.
- Mode is **independent of `NODE_ENV`** — don't conflate them.

### TS types for env
`src/vite-env.d.ts`:
```ts
/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_FEATURE_X: string
}
interface ImportMeta { readonly env: ImportMetaEnv }
```

## Dependency pre-bundling (`optimizeDeps`)
Done by **Rolldown** in Vite 8 (was esbuild). Two jobs: convert CJS/UMD → ESM (fixes named imports) and bundle many-file ESM deps to cut HTTP requests. Cache in `node_modules/.vite`, invalidated by lockfile / config / `NODE_ENV` changes.

```ts
optimizeDeps: {
  include: ['lodash-es', 'some-cjs-dep > nested-dep'],  // force pre-bundle (e.g. deep/linked deps)
  exclude: ['my-local-esm-pkg'],                          // skip
  // entries: ['src/main.ts'],
  // rolldownOptions: { /* replaces esbuildOptions */ },
}
```
- Linked/monorepo deps are treated as source (not pre-bundled) → they must ship ESM.
- Re-bundle after weird stale-dep errors: `vite --force`.

## Environment API (`environments`)
Formalizes execution contexts (client / ssr / edge / worker). Core stable in Vite 8, some APIs experimental. App devs rarely touch it; reach for it for SSR/edge/worker targets or framework authoring.
```ts
export default defineConfig({
  environments: {
    client: {},
    ssr: { resolve: { noExternal: ['pkg-to-bundle'] } },
    // edge: { resolve: { noExternal: true } },
  },
})
```
Each environment inherits top-level options. One dev server can run several environments concurrently (`ModuleRunner` / `RunnableDevEnvironment`).

## Plugins
Order matters; Vite/Rollup plugin API is supported (compat layer maps to Rolldown). Common official plugins: `@vitejs/plugin-vue`, `@vitejs/plugin-vue-jsx`, `@vitejs/plugin-react`, `@vitejs/plugin-legacy`. Plugin `load`/`transform` that produce JS from non-JS should return `{ code, moduleType: 'js' }`.
