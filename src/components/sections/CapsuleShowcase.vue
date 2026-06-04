<script setup lang="ts">
import { ref } from 'vue'
import { useGsapContext, gsap, revealOnScroll } from '@/composables/useGsap'

const root = ref<HTMLElement>()
const specs = [
  { label: 'Lungime', value: '11.5 m' },
  { label: 'Lățime', value: '~3.0 m' },
  { label: 'Compartimentare', value: 'Living + dormitor' },
  { label: 'Ferestre', value: 'Angulare, rame negre' },
  { label: 'Variante', value: 'Cu / fără balcon' },
  { label: 'Finisaj', value: 'La cheie' },
]
const features = [
  'Carcasă albă cu forme rotunjite și anvelopă continuă',
  'Sticlă fumurie de la podea la tavan, lumină naturală maximă',
  'Interior cald cu finisaje din lemn și iluminat ambiental',
  'Balcon opțional cu balustradă din sticlă',
]

useGsapContext(({ reduced }) => {
  revealOnScroll(root.value!, '.reveal', { y: 36, stagger: 0.08 })
  if (reduced) return
  // Subtle parallax on the lead image.
  gsap.to('[data-parallax]', {
    yPercent: -8,
    ease: 'none',
    scrollTrigger: { trigger: root.value!, start: 'top bottom', end: 'bottom top', scrub: true },
  })
}, root)
</script>

<template>
  <section id="capsula" ref="root" class="bg-cloud py-section text-ink">
    <div class="container-x grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
      <!-- Imagery -->
      <div class="relative">
        <div class="reveal overflow-hidden rounded-3xl">
          <img
            data-parallax
            src="/gallery/capsule-balcon.jpeg"
            alt="Capsulă modulară 11.5 m cu balcon, living vitrat și dormitor, amplasată în natură la apus"
            class="aspect-[4/3] w-full scale-110 object-cover"
            loading="lazy"
            width="1600"
            height="1200"
          />
        </div>
        <div class="reveal absolute -bottom-8 -right-2 w-2/5 overflow-hidden rounded-2xl border-4 border-cloud shadow-2xl sm:-right-6 lg:w-1/2">
          <img
            src="/gallery/capsule-fara-balcon.jpeg"
            alt="Varianta fără balcon a capsulei modulare de 11.5 m"
            class="aspect-[4/3] w-full object-cover"
            loading="lazy"
            width="800"
            height="600"
          />
        </div>
        <span class="text-spec absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1.5 text-xs text-cloud">
          model 3D · 11.5 m
        </span>
      </div>

      <!-- Copy + specs -->
      <div>
        <p class="reveal text-spec mb-4 text-sm tracking-[0.18em] text-ember-deep uppercase">Linia Capsule</p>
        <h2 class="reveal font-display text-ink" style="font-size: var(--text-h2); line-height: var(--text-h2--line-height); letter-spacing: var(--text-h2--letter-spacing)">
          Capsula 11.5 m
        </h2>
        <p class="reveal measure mt-5 text-lg text-ink/70">
          Modelul nostru emblematic. O singură anvelopă continuă care unește living-ul și dormitorul,
          cu pereți de sticlă ce dizolvă granița dintre interior și peisaj.
        </p>

        <ul class="reveal mt-8 space-y-3">
          <li v-for="f in features" :key="f" class="flex gap-3 text-ink/75">
            <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ember-deep" aria-hidden="true" />
            {{ f }}
          </li>
        </ul>

        <dl class="reveal mt-9 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-ink/10 pt-7">
          <div v-for="s in specs" :key="s.label">
            <dt class="text-xs uppercase tracking-wide text-ink/45">{{ s.label }}</dt>
            <dd class="text-spec mt-1 text-base font-medium text-ink">{{ s.value }}</dd>
          </div>
        </dl>

        <div class="reveal mt-9">
          <a href="#contact" class="btn-dark">Cere ofertă pentru capsulă</a>
        </div>
      </div>
    </div>
  </section>
</template>
