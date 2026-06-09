# DESIGN.md — SpaceBox

Design system dictated by `impeccable` (brand register). Tokens live in `src/style.css` (`@theme`).

## Voice
Three words: **engineered · serene · precise.** A premium prefab studio, not a SaaS, not a magazine.
Aesthetic lane: architectural product showcase (Koto / Den / Muji-industrial), cinematic dark hero
where the white capsule reads as a museum object, opening into bright, airy spec sections.
Art direction per section is allowed; voice stays constant.

## Color (OKLCH — never #000/#fff, neutrals tinted warm hue ~80)
| Token | OKLCH | Role |
|---|---|---|
| `--color-ink` | `oklch(0.16 0.006 80)` | hero/dark stage background |
| `--color-ink-2` | `oklch(0.21 0.008 80)` | raised dark panel |
| `--color-graphite` | `oklch(0.31 0.009 80)` | borders on dark, antracit nod |
| `--color-cloud` | `oklch(0.97 0.004 85)` | text on dark / light section bg |
| `--color-mist` | `oklch(0.945 0.005 85)` | alt light section bg |
| `--color-slate` | `oklch(0.62 0.012 80)` | muted text |
| `--color-ember` | `oklch(0.80 0.13 70)` | ACCENT — interior glow, ≤10% on light |
| `--color-ember-deep`| `oklch(0.66 0.15 55)` | accent pressed / on light text |

Strategy: **Committed/Drenched on the dark hero** (the ink stage + ember glow carry it),
**Restrained on light sections** (cloud/mist + one ember accent). Antracit (RAL 7016) and gri (RAL 7035)
from the product line map to graphite/slate.

## Typography (loaded in index.html)
- **Display:** `Sora` (600–800). Tight tracking on large sizes. Engineered, geometric.
- **Body:** `Hanken Grotesk` (400–600). Humanist warmth, 65–75ch measure.
- **Spec/data:** `Geist Mono` (400–500). ONLY for dimensions, RAL codes, numeric specs (genuinely technical, not costume).

Scale: fluid `clamp()`, ratio ≥1.25.
- `--text-hero`: clamp(2.75rem, 7vw, 6.5rem) / line-height 0.95 / tracking -0.03em
- `--text-h2`:  clamp(2rem, 4.5vw, 3.5rem)
- `--text-h3`:  clamp(1.35rem, 2.2vw, 1.875rem)
- body 1.0625rem, line-height 1.65 (1.7 on dark).

## Spacing & layout
- Section padding fluid: `clamp(4.5rem, 10vw, 9rem)` block.
- Content max width 75rem; text measure max 68ch.
- Left-aligned, asymmetric compositions for hero + showcase; strict grid for spec tables/catalog.
- Cards only where they are the right affordance (catalog grid `repeat(auto-fit,minmax(280px,1fr))`). No nested cards. No side-stripe borders.

## Motion (GSAP)
- Easing: `expo.out` / `power4.out` for reveals; `power2.inOut` for scrub. No bounce/elastic.
- Page-load: staggered hero reveal (kicker → headline lines → CTA → 3D fade-in).
- Scroll: pinned hero, capsule rotation/scale **scrubbed** to scroll; section reveals = translateY(32px)+opacity, stagger 0.08; stat counters count up on enter.
- Respect `prefers-reduced-motion`: disable scrub/transforms, keep instant opacity.

## Bans honored
No gradient text, no glassmorphism-by-default, no side-stripe borders, no em dashes in copy,
no repeated tiny uppercase tracked labels as section grammar (one strong kicker max per fold),
no hero-metric SaaS template, no identical icon-card grids.
