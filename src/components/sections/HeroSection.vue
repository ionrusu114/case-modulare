<script setup lang="ts">
import { defineAsyncComponent, ref, onMounted } from 'vue'
import { useGsapContext, gsap, ScrollTrigger, prefersReducedMotion } from '@/composables/useGsap'
import { heroProgress, heroPointer } from '@/composables/useHeroProgress'

// Real 3D capsule (GLB) exported from Blender, rotated on scroll in WebGL.
// Client-only mount; poster shows until the model is ready (and as no-JS/SSR fallback).
const CapsuleHero = defineAsyncComponent(() => import('../three/CapsuleHero.vue'))
const mounted = ref(false)
const ready = ref(false)
const root = ref<HTMLElement>()
const stage = ref<HTMLElement>()
const posterSrc = '/renders/capsule-hero.jpg'

onMounted(() => (mounted.value = true))

useGsapContext(({ reduced }) => {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
  tl.from('[data-hero-kicker]', { y: 20, opacity: 0, duration: 0.7 })
    .from('[data-hero-line]', { yPercent: 110, opacity: 0, duration: 1, stagger: 0.12 }, '-=0.3')
    .from('[data-hero-sub]', { y: 18, opacity: 0, duration: 0.8 }, '-=0.5')
    .from('[data-hero-cta]', { y: 16, opacity: 0, duration: 0.7, stagger: 0.08 }, '-=0.5')
    .from('[data-hero-meta]', { opacity: 0, duration: 0.8 }, '-=0.4')

  if (reduced) return

  // Pin the hero and drive the capsule's rotation from scroll progress.
  ScrollTrigger.create({
    trigger: root.value!,
    start: 'top top',
    end: '+=140%',
    pin: stage.value!,
    pinSpacing: true,
    scrub: 0.5,
    onUpdate: (self) => { heroProgress.value = self.progress },
  })
  gsap.to('[data-hero-copy]', {
    opacity: 0,
    y: -40,
    ease: 'none',
    scrollTrigger: { trigger: root.value!, start: 'top top', end: '+=50%', scrub: true },
  })
}, root)

function onPointer(e: PointerEvent) {
  if (prefersReducedMotion()) return
  heroPointer.value = {
    x: (e.clientX / window.innerWidth) * 2 - 1,
    y: (e.clientY / window.innerHeight) * 2 - 1,
  }
}
</script>

<template>
  <section ref="root" class="relative bg-ink" aria-label="Capsulă modulară premium 11.5 m">
    <div ref="stage" class="relative h-svh w-full overflow-hidden" @pointermove="onPointer">
      <!-- Poster: instant first paint + fallback, fades out when the 3D is ready. -->
      <img
        :src="posterSrc"
        alt="Capsulă modulară premium 11.5 m, carcasă albă cu interior cald vizibil prin sticlă"
        class="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700"
        :class="ready ? 'opacity-0' : 'opacity-100'"
        fetchpriority="high"
        data-no-zoom
      />
      <!-- Interactive 3D capsule (rotates on scroll). Mounts client-side only. -->
      <CapsuleHero v-if="mounted" class="absolute inset-0" @ready="ready = true" />

      <!-- Atmosphere: left scrim guarantees copy contrast; vignette + floor glow. -->
      <div
        class="pointer-events-none absolute inset-0"
        style="
          background:
            linear-gradient(to right, oklch(0.16 0.006 80) 0%, oklch(0.16 0.006 80 / 0.86) 30%, transparent 64%),
            radial-gradient(120% 80% at 60% 120%, oklch(0.8 0.13 70 / 0.16), transparent 60%),
            linear-gradient(to bottom, oklch(0.16 0.006 80 / 0.4) 0%, transparent 22%, transparent 66%, oklch(0.16 0.006 80 / 0.85) 100%);
        "
      />

      <!-- Copy -->
      <div data-hero-copy class="container-x absolute inset-x-0 bottom-0 top-0 flex flex-col justify-center">
        <p data-hero-kicker class="text-spec mb-5 text-sm tracking-[0.2em] text-ember uppercase">
          Case modulare · livrate în 15–20 de zile
        </p>
        <h1 class="max-w-[18ch] font-display text-cloud" style="font-size: var(--text-hero); line-height: var(--text-hero--line-height); letter-spacing: var(--text-hero--letter-spacing)">
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
      <div data-hero-meta class="container-x pointer-events-none absolute inset-x-0 bottom-7 flex items-end justify-between">
        <div class="text-spec text-xs text-cloud/55">
          <div class="mb-1.5 h-px w-28 bg-cloud/30" />
          11.5 m · 3.0 m · living + dormitor
        </div>
        <span class="text-spec text-xs text-cloud/45">scroll pentru a desface modulul ↓</span>
      </div>
    </div>
  </section>
</template>
