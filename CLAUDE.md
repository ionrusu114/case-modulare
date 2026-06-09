# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**SpaceBox** — a Romanian, performance-first **3D landing page** for modular houses (case modulare):
premium capsules, living containers, two-storey units, commercial kiosks, guard posts. The site is a
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

Stack: **Vue 3.5 (`<script setup lang="ts">`) + Vite 6 + TypeScript + Tailwind CSS v4 + GSAP + three.js**,
prerendered with **vite-ssg**. three.js is loaded **only client-side, lazily** (the hero capsule and the
product configurator) — never in the SSR/first-paint path.

- **Entry / routing:** `src/main.ts` uses `ViteSSG` with a single `/` route (`src/pages/Home.vue`).
  vite-ssg prerenders real HTML for instant first paint + SEO; the WebGL hero hydrates client-side only.
  `src/App.vue` holds global `useHead` SEO (title template, OG/Twitter, Organization JSON-LD).
- **Page composition:** `Home.vue` stacks section components from `src/components/sections/` between
  `TheHeader` and `TheFooter`. Sections alternate dark (`ink`) and light (`cloud`/`mist`) backgrounds by design.
- **Hero (performance-critical):**
  - `src/components/sections/HeroSection.vue` mounts `src/components/three/CapsuleHero.vue` **client-only**
    (`defineAsyncComponent` + `mounted` ref) and shows `/renders/capsule-hero.jpg` (~190KB) as poster until
    `@ready` (also the SSR/no-JS fallback).
  - `CapsuleHero.vue` is **raw three.js** (no TresJS). It loads `/models/capsule.glb` (exported from Blender,
    35 named parts), lights it with a built-in `RoomEnvironment` + key/rim/warm-interior lights on a
    **transparent** canvas (clean dark studio, no exterior ambient — materials read), and **explodes it on
    scroll**: each part gets a radial `dir` (roof up, base down, glass/frames forward, interior spreads, shell
    stays as core); GSAP pins the hero and writes scroll progress to `heroProgress`
    (`src/composables/useHeroProgress.ts`), the render loop sets each `part.position = base + dir * progress`
    and dollies the camera back as it opens. Assembled at top → exploded diagram as you scroll. `prefers-reduced-motion` skips the pin.
- **Product configurator** (`/produs/punct-de-paza`): `src/pages/ProductPunctPaza.vue` + `src/components/three/GuardPostViewer.vue`
  — raw three.js. Loads `/models/punct-paza.glb` (detailed Blender guard post, 35 named parts, two-tone).
  Live **RAL color swap** recolors the material named exactly **`Body`** (light-grey panels; trim stays anthracite).
  **Hotspots** map to named meshes (Door, Window_Front_L, Interior_AC, Corner, Body_Left/Back, Interior_Desk),
  projected to HTML markers with raycast occlusion. **Interior view is fixed/rotate-only**: OrbitControls radius
  is locked (minDistance == maxDistance) with pan + zoom disabled, so you rotate around the room centre but
  never translate. Exterior = normal orbit (door faces −Z after the glTF Y-up flip → camera sits on −Z).
  Data in `src/data/punctPaza.ts`. Linked from the catalog card.
  - The turntable + poster are produced offline in Blender (Cycles + Poly Haven HDRI) by the
    **blender-modeler** agent. To refresh the hero, re-render those two files; no code change needed.
- **GSAP conventions:** all GSAP lives behind `src/composables/useGsap.ts`. Use `useGsapContext(setup, scope)`
  so tweens/ScrollTriggers are auto-reverted on unmount; use `revealOnScroll(root, '.reveal')` for the
  standard staggered entrance. **Always honor `prefers-reduced-motion`** (the composable exposes
  `prefersReducedMotion()` and `reduced` in the setup callback; reveal elements must never stay hidden).
- **Design system:** tokens are defined once in `src/style.css` via Tailwind v4 `@theme` (OKLCH colors,
  `--font-*`, fluid `--text-*` / `--spacing-section`). `DESIGN.md` is the spec; `PRODUCT.md` is brand/content
  context. Both are read by the `impeccable` skill, which **leads** all design decisions here.
- **Content:** `src/data/catalog.ts` is the single typed source for products, USP stats, and process steps.
  Spec values (dimensions, RAL codes) are quoted verbatim from `example_images/`. Edit data there, not in markup.
- **Assets:** curated photos live in `public/gallery/`; the Blender product render in `public/renders/`;
  the web GLB in `public/models/`. Originals stay in `example_images/` (not shipped).

## Performance rules (this project's reason for existing)

- `three` and `gsap` are each split into their own chunk (`vite.config.ts` `manualChunks`). three loads
  only via the client-only async components, so first paint is just HTML + poster — keep it that way.
- Build output is brotli + gzip precompressed (`vite-plugin-compression2`). Keep `capsule.glb` light
  (no Draco needed at ~205KB) and always provide the poster.
- Prefer real imagery already in `public/`; lazy-load all non-hero images (`loading="lazy"`).

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
