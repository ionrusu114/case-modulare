<script setup lang="ts">
import { ref } from 'vue'
import { useGsapContext, gsap } from '@/composables/useGsap'

// Editorial hero: the capsule lives in its OWN cinematic plate, the copy sits on the ink
// stage below it. No text over the house on any screen. The full 11.5 m capsule reads whole
// because the plate keeps the photo's 16:9 framing (mobile) / a wide cine-crop (desktop).
const root = ref<HTMLElement>()
const heroSrc = '/gallery/capsule-balcon.jpeg'

useGsapContext(({ reduced }) => {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
  tl.from('[data-hero-plate]', { opacity: 0, duration: 1.1, ease: 'power2.out' })
    .from('[data-hero-kicker]', { y: 20, opacity: 0, duration: 0.7 }, '-=0.5')
    .from('[data-hero-line]', { yPercent: 110, opacity: 0, duration: 1, stagger: 0.12 }, '-=0.35')
    .from('[data-hero-sub]', { y: 18, opacity: 0, duration: 0.8 }, '-=0.55')
    .from('[data-hero-cta]', { y: 16, opacity: 0, duration: 0.7, stagger: 0.08 }, '-=0.5')
    .from('[data-hero-meta]', { opacity: 0, duration: 0.8 }, '-=0.4')

  if (reduced) return

  // Ken Burns settles to a slight overscan (1.04) so the plate stays full-bleed under parallax.
  gsap.fromTo('[data-hero-img]', { scale: 1.1 }, { scale: 1.04, duration: 2.8, ease: 'power2.out' })

  // Parallax: the capsule drifts gently inside its plate as the hero scrolls away.
  gsap.fromTo(
    '[data-hero-img]',
    { yPercent: -2 },
    {
      yPercent: 3,
      ease: 'none',
      scrollTrigger: { trigger: root.value!, start: 'top top', end: 'bottom top', scrub: true },
    },
  )
}, root)
</script>

<template>
  <section
    ref="root"
    class="relative isolate flex min-h-svh w-full flex-col overflow-hidden bg-ink"
    aria-label="Capsulă modulară premium 11.5 m"
  >
    <!-- Stage atmosphere: cool top key light + warm ember ground glow behind the seam. -->
    <div
      class="pointer-events-none absolute inset-0 -z-10"
      style="
        background:
          radial-gradient(110% 60% at 50% -8%, oklch(0.97 0.004 85 / 0.05), transparent 55%),
          radial-gradient(95% 55% at 50% 60%, oklch(0.8 0.13 70 / 0.16), transparent 60%);
      "
    />

    <!-- IMAGE PLATE: the whole capsule, framed. 16:9 on mobile (matches the photo, no crop),
         a wide cinematic band on desktop. The copy never sits on top of it. -->
    <div
      data-hero-plate
      class="relative w-full overflow-hidden aspect-[16/9] lg:aspect-auto lg:h-[58vh] xl:h-[62vh]"
    >
      <img
        data-hero-img
        :src="heroSrc"
        alt="Capsulă modulară premium 11.5 m, carcasă albă cu balcon și interior cald vizibil prin sticla fumurie, amplasată pe deal"
        class="h-full w-full object-cover object-center will-change-transform"
        fetchpriority="high"
        decoding="async"
        data-no-zoom
      />
      <!-- Soft falloff that dissolves the plate's lower edge into the ink stage. -->
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
        style="background: linear-gradient(to bottom, transparent, oklch(0.16 0.006 80 / 0.45) 60%, var(--color-ink) 100%);"
      />
      <!-- Scale marker, on the plate (technical signature). -->
      <div data-hero-meta class="container-x pointer-events-none absolute inset-x-0 bottom-4">
        <div class="text-spec text-xs text-cloud/65">
          <div class="mb-1.5 h-px w-24 bg-cloud/35" />
          11.5 m · 3.0 m · living + dormitor
        </div>
      </div>
    </div>

    <!-- COPY: on the ink stage, below the plate. -->
    <div
      data-hero-copy
      class="container-x relative z-10 flex flex-1 flex-col justify-center py-9 lg:py-0"
    >
      <p data-hero-kicker class="text-spec mb-4 text-sm tracking-[0.2em] text-ember uppercase">
        Case modulare · livrate în 15–20 de zile
      </p>
      <div class="lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-10">
        <h1
          class="font-display text-cloud lg:col-span-7"
          style="font-size: var(--text-hero); line-height: var(--text-hero--line-height); letter-spacing: var(--text-hero--letter-spacing)"
        >
          <span class="block overflow-hidden"><span data-hero-line class="block">Spațiul tău,</span></span>
          <span class="block overflow-hidden"><span data-hero-line class="block">gata de locuit.</span></span>
        </h1>
        <div class="lg:col-span-5">
          <p data-hero-sub class="measure mt-6 text-lg text-cloud/70 lg:mt-0">
            Capsule premium, containere și spații comerciale construite în atelier și montate pe
            terenul tău. Inginerie reală, finisaje la cheie, fără șantier interminabil.
          </p>
          <div class="mt-8 flex flex-wrap items-center gap-4">
            <a data-hero-cta href="#contact" class="btn-primary">Cere ofertă</a>
            <a data-hero-cta href="#capsula" class="btn-ghost">Vezi capsula 11.5 m</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll hint -->
    <div class="container-x pointer-events-none relative z-10 flex justify-end pb-6">
      <span class="text-spec hidden text-xs text-cloud/45 sm:inline">derulează pentru detalii ↓</span>
    </div>
  </section>
</template>
