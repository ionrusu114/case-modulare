# SpaceBox — Case Modulare

Landing page pentru case modulare (capsule premium, containere, chioșcuri).
Hero foto cu intrare animată în CSS, galerie cu lightbox, hartă de contact, SEO + prerender. Țintă: 100 în PageSpeed (mobil + desktop).

**Live:** https://spacebox.md

## Stack
Vue 3.5 · Vite 6 · TypeScript · Tailwind CSS v4 · GSAP · three.js · vite-ssg (prerender) · Bun.

## Dezvoltare
```bash
bun install
bun run dev          # server de dezvoltare
bun run build        # vue-tsc + vite-ssg -> dist/ (prerendat)
bun run preview      # previzualizează build-ul
bun run typecheck
```

## Structură
- `src/components/sections/` — secțiunile landing-ului. `src/pages/Home.vue` — singura rută.
- `src/components/AppPicture.vue` — `<picture>` AVIF/WebP responsive pentru fotografiile din `public/gallery/`.
- `src/data/` — conținut tipizat (catalog, contact, manifest imagini). `public/fonts/` — fonturi subset, găzduite local.
- `public/gallery/` — fotografii originale; `public/img/` — variante generate (`npm i --no-save sharp@0.34 && node scripts/optimize-images.mjs`) + harta statică.
- `src/components/three/CapsuleHero.vue` — scena WebGL veche (explode pe scroll), nefolosită în pagină.
- `.blender/` *(gitignored)* — fișiere Blender + unelte 3D AI (istoric local, conține cheia API).

## Mediu (env)
Aplicația web **nu** are nevoie de variabile la runtime (build static). `AISTUDIO_API_KEY` e folosit doar de uneltele locale din `.blender/` (3D AI Studio).

## Docker
Build multi-stage (Bun → nginx), servește `dist/` cu `/health`, gzip și fallback pentru rutele prerendate.
```bash
docker build -t ionrusu114/case-modulare:latest .
docker run --rm -p 8080:80 ionrusu114/case-modulare:latest   # http://localhost:8080
```

## Deploy
Rulează prin **Traefik** (rețea `proxynet`, Let's Encrypt resolver `le`) pe serverul de producție.
`docker-compose.yml` conține label-urile Traefik pentru domeniul de mai sus. CI/CD (GitHub Actions):
push pe `main` → build + push imagine pe Docker Hub → SSH pe server → `docker compose pull && up -d`.
