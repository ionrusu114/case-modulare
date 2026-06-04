<script setup lang="ts">
import { ref } from 'vue'
import { usps } from '@/data/catalog'
import { useGsapContext, gsap, revealOnScroll } from '@/composables/useGsap'

const root = ref<HTMLElement>()

useGsapContext(({ reduced }) => {
  revealOnScroll(root.value!, '.reveal', { y: 36, stagger: 0.1 })
  if (reduced) return
  // Count up each metric on enter.
  root.value!.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count)
    const obj = { v: 0 }
    gsap.to(obj, {
      v: target,
      duration: 1.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
      onUpdate: () => { el.textContent = String(Math.round(obj.v)) },
    })
  })
}, root)
</script>

<template>
  <section id="de-ce" ref="root" class="bg-ink py-section text-cloud">
    <div class="container-x">
      <div class="max-w-[52rem]">
        <p class="reveal text-spec mb-4 text-sm tracking-[0.18em] text-ember uppercase">De ce modular</p>
        <h2 class="reveal font-display text-cloud" style="font-size: var(--text-h2); line-height: var(--text-h2--line-height); letter-spacing: var(--text-h2--letter-spacing)">
          Construit ca o casă. Livrat ca un produs.
        </h2>
        <p class="reveal measure mt-6 text-lg text-cloud/65">
          Fiecare modul este fabricat în atelier, sub control de calitate, apoi montat pe teren.
          Câștigi timp, predictibilitate și aceeași inginerie ca într-o construcție clasică.
        </p>
      </div>

      <div class="mt-16 grid gap-px overflow-hidden rounded-2xl border border-graphite/70 bg-graphite/70 sm:grid-cols-3">
        <article v-for="u in usps" :key="u.title" class="reveal bg-ink p-8 sm:p-10">
          <div class="flex items-baseline gap-1 font-display text-cloud">
            <span :data-count="u.metric" class="text-6xl font-extrabold tracking-tight">0</span>
            <span class="text-spec text-xl text-ember">{{ u.unit }}</span>
          </div>
          <h3 class="mt-5 font-display text-h3 text-cloud">{{ u.title }}</h3>
          <p class="mt-3 text-cloud/60">{{ u.body }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
