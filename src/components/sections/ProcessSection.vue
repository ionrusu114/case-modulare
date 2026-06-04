<script setup lang="ts">
import { ref } from 'vue'
import { processSteps } from '@/data/catalog'
import { useGsapContext, gsap, revealOnScroll } from '@/composables/useGsap'

const root = ref<HTMLElement>()

useGsapContext(({ reduced }) => {
  revealOnScroll(root.value!, '.reveal', { y: 32, stagger: 0.1 })
  if (reduced) return
  gsap.fromTo(
    '[data-progress-line]',
    { scaleX: 0 },
    {
      scaleX: 1,
      ease: 'none',
      transformOrigin: 'left center',
      scrollTrigger: { trigger: '[data-steps]', start: 'top 75%', end: 'bottom 70%', scrub: true },
    },
  )
}, root)
</script>

<template>
  <section id="proces" ref="root" class="bg-ink-2 py-section text-cloud">
    <div class="container-x">
      <div class="max-w-[44rem]">
        <p class="reveal text-spec mb-4 text-sm tracking-[0.18em] text-ember uppercase">Procesul</p>
        <h2 class="reveal font-display text-cloud" style="font-size: var(--text-h2); line-height: var(--text-h2--line-height); letter-spacing: var(--text-h2--letter-spacing)">
          De la idee la cheie, în 15–20 de zile
        </h2>
      </div>

      <div data-steps class="relative mt-16">
        <!-- Progress rail -->
        <div class="absolute left-0 right-0 top-7 hidden h-px bg-graphite/70 md:block">
          <div data-progress-line class="h-full w-full bg-ember" />
        </div>

        <ol class="grid gap-10 md:grid-cols-4 md:gap-6">
          <li v-for="s in processSteps" :key="s.step" class="reveal relative">
            <div class="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-graphite bg-ink text-spec text-lg text-ember">
              {{ s.step }}
            </div>
            <h3 class="mt-6 font-display text-h3 text-cloud">{{ s.title }}</h3>
            <p class="mt-3 text-cloud/60">{{ s.body }}</p>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>
