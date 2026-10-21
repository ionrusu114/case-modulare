# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**SpaceBox** — a Romanian, performance-first **3D landing page** for modular houses (case modulare):
premium capsules, living containers, two-storey units, commercial kiosks (guard posts were dropped). The site is a
single long-scroll presentation page. Content language is **Romanian**; the source of truth for product
copy/specs is the imagery in `example_images/` (distilled into `src/data/catalog.ts`).

## Commands

```bash
npm run dev        # Vite dev server
npm run build      # vue-tsc typecheck + vite-ssg static prerender -> dist/
npm run build:spa  # plain SPA build (no prerender), useful for debugging
npm run preview    # serve the production build
npm run typecheck  # vue-tsc -b --noEmit
```

There is no test runner configured. Verify UI changes live in the browser (the `browser` agent drives
Chrome via the `playwright-cli` skill — do not add `.spec` files unless asked).

## Architecture

Stack: **Vue 3.5 (`<script setup lang="ts">`) + Vite 6 + TypeScript + Tailwind CSS v4 + GSAP**, prerendered
with **vite-ssg**. three.js is a dependency only for the unused `CapsuleHero.vue`; nothing on the page loads it.

- **Entry / routing:** `src/main.ts` uses `ViteSSG` with a single `/` route (`src/pages/Home.vue`).
  vite-ssg prerenders real HTML for instant first paint + SEO. The app hydrates **after window load**
  (see Performance rules), so `scrollBehavior` skips the first navigation (keeps the visitor's scroll).
  `src/App.vue` holds global `useHead` SEO (title template, OG/Twitter, Organization JSON-LD with phone + address).
- **Page composition:** `Home.vue` stacks section components from `src/components/sections/` between
  `TheHeader` and `TheFooter`. Sections alternate dark (`ink`) and light (`cloud`/`mist`) backgrounds by design.
- **Hero (performance-critical, LCP):** `HeroSection.vue` shows the photo `capsule-balcon` via `<AppPicture>`
  (eager, `fetchpriority="high"`). The entrance (kicker, headline lines, CTA) and the Ken Burns are **pure CSS
  keyframes** (`fill-mode: backwards`, Ken Burns on the individual `scale` property), so they run from first paint
  without JS; GSAP only adds the scroll parallax on `transform`. Never hide the hero image with opacity.
- **Old 3D hero (unused):** `src/components/three/CapsuleHero.vue` (raw three.js, `/models/capsule.glb`, explode on
  scroll via `heroProgress`) is kept but not mounted anywhere. The guard post configurator was removed;
  `/produs/punct-de-paza` 301-redirects to `/` in `nginx.conf`.
- **GSAP conventions:** all GSAP lives behind `src/composables/useGsap.ts`, which **imports GSAP lazily** after
  mount. Use `useGsapContext(({ gsap, reduced }) => ..., scope)` and take `gsap` from that argument (never import
  `gsap` directly); tweens/ScrollTriggers are auto-reverted on unmount. Use `revealOnScroll(root, '.reveal')` for the
  standard staggered entrance. `<html class="no-js">` keeps `.reveal` visible until GSAP has loaded (useGsap removes
  it). **Always honor `prefers-reduced-motion`**; reveal elements must never stay hidden.
- **Design system:** tokens are defined once in `src/style.css` via Tailwind v4 `@theme` (OKLCH colors,
  `--font-*`, fluid `--text-*` / `--spacing-section`). `DESIGN.md` is the spec; `PRODUCT.md` is brand/content
  context. Both are read by the `impeccable` skill, which **leads** all design decisions here.
- **Content:** `src/data/catalog.ts` is the single typed source for products, USP stats, and process steps;
  `src/data/contact.ts` for phone, email, address, map coordinates and map links.
  Spec values (dimensions, RAL codes) are quoted verbatim from `example_images/`. Edit data there, not in markup.
- **Assets:** curated photos live in `public/gallery/` (originals). Render them only through
  `src/components/AppPicture.vue` (AVIF/WebP `srcset` from `public/img/`, typed by `src/data/images.ts`). After adding
  or changing a photo, run `npm i --no-save sharp@0.34 && node scripts/optimize-images.mjs` (sharp is not a project
  dependency). The contact map `public/img/harta-*` is a static, pre-styled OpenStreetMap render centred on the
  address (keep the © OpenStreetMap credit). Originals stay in `example_images/` (not shipped).

## Performance rules (this project's reason for existing)

Target: **100** in all four PageSpeed categories, mobile and desktop. Check with
`npx lighthouse@12 <url>` (mobile) and `--preset=desktop`. Production is HTTP/2 behind Traefik; plain
`http://localhost` is HTTP/1.1 and makes Lighthouse's simulated LCP look ~0.3s worse, so test locally through an
nginx with TLS + `http2 on` (self-signed cert, `--chrome-flags="--ignore-certificate-errors"`). The anonymous
PageSpeed Insights API quota is often exhausted (HTTP 429); use pagespeed.web.dev in a browser instead.
- First paint needs only HTML + hero image + fonts. `firstPaintFirst()` in `vite.config.ts` inlines the CSS as
  `<style>` and injects the entry module **after window load** (`modulePreload: false`). Do not add
  render-blocking `<link>`/`<script>` tags or third-party embeds to `<head>`.
- Fonts are self-hosted variable woff2 in `public/fonts/`, subset to Romanian Latin (Space Grotesk holds only
  the logo glyphs "SpaceBox."). No Google Fonts. Rename a font file when it changes (cached 1 year).
- GSAP is a lazy chunk; keep heavy libraries (three, maps, embeds) out of the initial graph.
- Build output is brotli + gzip precompressed (`vite-plugin-compression2`). Lazy-load all non-hero images.

## 3D / Blender pipeline

3D assets are produced via the user-scope **Blender MCP** (live Blender 5.1, add-on on `localhost:9876`)
by the **blender-modeler** agent in `.claude/agents/` (see `.claude/agents/README.md`). The hero capsule
is a closed shell with a furnished, warm-lit interior visible through the front glass. It is exported to
**`public/models/capsule.glb`** (glTF 2.0, Y-up, no Draco, ~205KB, named meshes/materials, glass via
KHR_materials_transmission, interior glow via KHR_materials_emissive_strength) and rotated on the frontend
by `CapsuleHero.vue`. The poster `capsule-hero.jpg` is a Cycles still (lit by the free CC0 Poly Haven HDRI
`qwantani_puresky` via `api.polyhaven.com`, no API key), PNG→JPEG via PowerShell `System.Drawing` (no install).
To refresh the hero model, re-export `capsule.glb`; no code change needed.

**3D AI Studio** (image→3D, GLB+PBR) is set up for generating alternative realistic meshes: see
`.blender/3daistudio-api.md` (full API reference) and `.blender/gen.mjs` (`node .blender/gen.mjs <image> <out>`).
Key in `.blender/credentials.local` (gitignored). NOTE: AI output is a single fused mesh (~23MB, no separable
parts) — fine as a realistic reference but NOT usable for the exploded hero (which needs the named Blender parts).
The `.blender/` folder is gitignored history (AI outputs, .blend files, key).

## Conventions

- `<script setup lang="ts">` only; import via the `@/` alias (→ `src/`).
- Tailwind utilities + the token classes in `style.css` (`btn-primary`/`btn-ghost`/`btn-dark`, `container-x`,
  `measure`, `text-spec`). No magic color/spacing values — use tokens. `text-spec` (Geist Mono) is for
  numeric/spec data only.
- Copy is Romanian. No em dashes in copy (house style; see DESIGN.md bans).
