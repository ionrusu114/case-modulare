---
name: vue-vite-stack
description: MUST be used for any Vue 3 + Vite frontend work in this project. The single entry point that orchestrates the installed Vue best-practice skills and the `vite` skill — tells you which to load and how Vue and Vite fit together. Load whenever writing .vue components, composables, Pinia stores, routes, or wiring vite.config for a Vue app. Use even for "how should I structure this component" or "how do props/emits/v-model work in Vue 3.5".
license: MIT
metadata:
  version: "1"
  author: phoenixmd-template
---

# Vue 3 + Vite stack (orchestrator)

This project writes **Vue 3 with `<script setup lang="ts">` + Composition API + Vite 8**. Don't reinvent guidance that already exists — this skill routes you to the right installed skill and adds the integration glue + project conventions. The design system and rules are owned by **impeccable** (see PRODUCT.md / DESIGN.md); this skill is about writing correct, idiomatic Vue+Vite code under those rules.

## Load order (compose these — they are already installed)
1. **`vue-best-practices`** — load FIRST for any Vue task. Mandates Composition API + `<script setup lang="ts">`, reactivity rules, component design.
2. **`vue`** — Vue 3 component/composable patterns, VueUse integration, reactive destructuring.
3. **`vite`** (this template) — config, dev server, HMR, env, build/SSR. Load when touching `vite.config`, `import.meta.*`, dev/build issues.
4. Task-specific (load only the matching one):
   - Routing → **`vue-router-best-practices`**
   - State → **`vue-pinia-best-practices`**
   - Tests → **`vue-testing-best-practices`** (note: in this project, live functional checks run via the `browser` agent / `playwright-cli` — unit tests still belong here)
   - Composables → **`vueuse`** / **`vueuse-functions`** / **`create-adaptable-composable`**
   - Headless UI primitives → **`reka-ui`**
   - JSX (only if the project uses it) → **`vue-jsx-best-practices`**
   - Options API (only if the project explicitly requires it) → **`vue-options-api-best-practices`**

Don't preload everything — pull the matching skill when the task hits that area. Keeps context lean.

## Vue 3.5+ APIs to use correctly (current stable)
- **`defineModel()`** for `v-model` instead of manual `modelValue` prop + `update:modelValue` emit:
  ```ts
  const model = defineModel<string>()              // <input v-model> on parent
  const checked = defineModel<boolean>('checked')  // named v-model
  ```
- **Reactive props destructure** (stable 3.5) with defaults — no `withDefaults`:
  ```ts
  const { count = 0, label = 'OK' } = defineProps<{ count?: number; label?: string }>()
  ```
  Destructured props stay reactive; to pass one to a composable that needs reactivity, wrap: `useX(() => count)`.
- **`useTemplateRef('name')`** for template refs (replaces matching a ref variable name).
- **`useId()`** for SSR-safe unique ids (form label/control pairing).
- Typed emits: `const emit = defineEmits<{ submit: [payload: Form]; cancel: [] }>()`.
- `<Suspense>` for async setup; `defineAsyncComponent` for lazy components.
- Prefer `computed` for derived state; `watch`/`watchEffect` only for side effects. Never mutate state inside `computed`.

## Vue + Vite integration (how they fit)
- `vite.config.ts`: `plugins: [vue()]`; alias `@`→`src` (or `resolve.tsconfigPaths: true`). See the `vite` skill for the full config.
- Type-checking is separate from Vite: run `vue-tsc --noEmit` (Vite/Oxc only transpiles). Keep `isolatedModules: true`.
- **Routes via glob**: `import.meta.glob('./pages/**/*.vue')` pairs well with file-based routing.
- **Env**: client reads `import.meta.env.VITE_*` only. Type them in `vite-env.d.ts`.
- **Assets in SFCs**: `<img :src="logo">` with `import logo from '@/assets/logo.png'`, or `new URL('./x.png', import.meta.url)`.
- **HMR**: SFCs hot-reload automatically via `@vitejs/plugin-vue`; only hand-write `import.meta.hot` for plain TS modules/stores.
- **SEO/SSG**: with `vite-ssg`, prerender routes to crawlable HTML; set `<title>`/meta via `useHead` (@unhead/vue). Use the `seo` skill per page.

## Project conventions (this template)
- `<script setup lang="ts">` only. PascalCase components, `useXxx` composables, camelCase TS.
- Pinia composition stores: `defineStore('name', () => { /* refs + computed + actions */ })`.
- Reka UI for headless primitives; Tailwind tokens (no magic hex) — tokens come from DESIGN.md via impeccable.
- No `any` without a written reason. No hardcoded user-facing text when i18n is configured.
- A11y: aria-labels on icon buttons, `useId()` for label/control, focus-visible, semantic HTML. Sanitize any `v-html`.
- Reuse > recreate: search existing components/composables before adding (≥80% overlap → reuse/extract).

## Workflow for a Vue feature
1. Load `vue-best-practices` (+ `vite` if config/build is involved). Confirm Composition API + TS.
2. Reuse-check existing components/composables.
3. Implement under impeccable's design rules; use Vue 3.5 APIs above; `context7` for any unsure library API.
4. SEO via `seo` skill if it's a page/route.
5. Verify LIVE in the browser (delegate to the `browser` agent — no test files). Type-check with `vue-tsc`.
6. Re-audit with impeccable.
