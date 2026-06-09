<script setup lang="ts">
import { ref } from 'vue'
import { useGsapContext, gsap } from '@/composables/useGsap'

// Cinematic parallax hero: the premium 11.5 m capsule (with balcony) on its plot.
// Real photo, no WebGL on first paint -> instant, light hero. Depth comes from the
// image drifting slower than scroll while the copy lifts and fades faster.
const root = ref<HTMLElement>()
const heroSrc = '/gallery/capsule-balcon.jpeg'

useGsapContext(({ reduced }) => {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
  tl.from('[data-hero-kicker]', { y: 20, opacity: 0, duration: 0.7 })
    .from('[data-hero-line]', { yPercent: 110, opacity: 0, duration: 1, stagger: 0.12 }, '-=0.3')
    .from('[data-hero-sub]', { y: 18, opacity: 0, duration: 0.8 }, '-=0.5')
    .from('[data-hero-cta]', { y: 16, opacity: 0, duration: 0.7, stagger: 0.08 }, '-=0.5')
    .from('[data-hero-meta]', { opacity: 0, duration: 0.8 }, '-=0.4')

  if (reduced) return

  // Ken Burns: slow settle on load so the still feels alive without motion sickness.
  gsap.fromTo('[data-hero-img]', { scale: 1.1 }, { scale: 1.04, duration: 2.6, ease: 'power2.out' })

  // Parallax: image drifts down as the hero scrolls away (kept inside its overscan box).
  gsap.fromTo(
    '[data-hero-img]',
    { yPercent: -4 },
    {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: { trigger: root.value!, start: 'top top', end: 'bottom top', scrub: true },
    },
  )
  // Copy lifts and fades faster than the image -> reads as foreground depth.
  gsap.to('[data-hero-copy]', {
    yPercent: -24,
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: root.value!, start: 'top top', end: 'bottom 45%', scrub: true },
  })
}, root)
</script>

<template>
  <section
    ref="root"
    class="relative h-svh w-full overflow-hidden bg-ink"
    aria-label="Capsulă modulară premium 11.5 m"
  >
    <!-- Parallax plate: oversized (124% tall, offset up) so it can drift without exposing edges. -->
    <img
      data-hero-img
      :src="heroSrc"
      alt="Capsulă modulară premium 11.5 m, carcasă albă cu balcon și interior cald vizibil prin sticla fumurie, amplasată pe deal"
      class="absolute left-0 top-[-12%] h-[124%] w-full object-cover object-[58%_center] will-change-transform sm:object-center"
      fetchpriority="high"
      decoding="async"
      data-no-zoom
    />

    <!-- Atmosphere: left scrim guarantees copy contrast; ember floor glow; top/bottom cinematic falloff. -->
    <div
      class="pointer-events-none absolute inset-0"
      style="
        background:
          linear-gradient(to right, oklch(0.16 0.006 80 / 0.92) 0%, oklch(0.16 0.006 80 / 0.7) 32%, oklch(0.16 0.006 80 / 0.12) 60%, transparent 80%),
          radial-gradient(120% 80% at 62% 122%, oklch(0.8 0.13 70 / 0.18), transparent 60%),
          linear-gradient(to bottom, oklch(0.16 0.006 80 / 0.5) 0%, transparent 24%, transparent 60%, oklch(0.16 0.006 80 / 0.9) 100%);
      "
    />

    <!-- Copy -->
    <div
      data-hero-copy
      class="container-x absolute inset-x-0 bottom-0 top-0 flex flex-col justify-center will-change-transform"
    >
      <p data-hero-kicker class="text-spec mb-5 text-sm tracking-[0.2em] text-ember uppercase">
        Case modulare · livrate în 15–20 de zile
      </p>
      <h1
        class="max-w-[18ch] font-display text-cloud"
        style="font-size: var(--text-hero); line-height: var(--text-hero--line-height); letter-spacing: var(--text-hero--letter-spacing)"
      >
        <span class="block overflow-hidden"><span data-hero-line class="block">Spațiul tău,</span></span>
        <span class="block overflow-hidden"><span data-hero-line class="block">gata de locuit.</span></span>
      </h1>
      <p data-hero-sub class="measure mt-7 text-lg text-cloud/70">
        Capsule premium, containere și spații comerciale construite în atelier și montate pe
        terenul tău. Inginerie reală, finisaje la cheie, fără șantier interminabil.
      </p>
      <div class="mt-9 flex flex-wrap items-center gap-4">
        <a data-hero-cta href="#contact" class="btn-primary">Cere ofertă</a>
        <a data-hero-cta href="#capsula" class="btn-ghost">Vezi capsula 11.5 m</a>
      </div>
    </div>

    <!-- Scale marker + scroll hint -->
    <div
      data-hero-meta
      class="container-x pointer-events-none absolute inset-x-0 bottom-7 flex items-end justify-between"
    >
      <div class="text-spec text-xs text-cloud/55">
        <div class="mb-1.5 h-px w-28 bg-cloud/30" />
        11.5 m · 3.0 m · living + dormitor
      </div>
      <span class="text-spec hidden text-xs text-cloud/45 sm:inline">derulează pentru detalii ↓</span>
    </div>
  </section>
</template>
