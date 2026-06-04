<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { products } from '@/data/catalog'
import { useGsapContext, revealOnScroll } from '@/composables/useGsap'

// Products that have a dedicated interactive page.
const routed: Record<string, string> = { 'punct-paza': '/produs/punct-de-paza' }

const root = ref<HTMLElement>()
const items = computed(() => products.filter((p) => !p.featured))

useGsapContext(() => {
  revealOnScroll(root.value!, '.reveal', { y: 32, stagger: 0.08 })
}, root)
</script>

<template>
  <section id="catalog" ref="root" class="bg-mist py-section text-ink">
    <div class="container-x">
      <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="reveal text-spec mb-4 text-sm tracking-[0.18em] text-ember-deep uppercase">Catalog</p>
          <h2 class="reveal max-w-[16ch] font-display text-ink" style="font-size: var(--text-h2); line-height: var(--text-h2--line-height); letter-spacing: var(--text-h2--letter-spacing)">
            Un modul pentru fiecare nevoie
          </h2>
        </div>
        <p class="reveal measure text-ink/60 sm:text-right">
          De la cazare și birouri de șantier la chioșcuri comerciale și puncte de pază. Toate, cu
          aceeași calitate de fabricație.
        </p>
      </div>

      <div class="mt-14 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
        <article
          v-for="p in items"
          :key="p.id"
          class="reveal group flex flex-col overflow-hidden rounded-2xl border border-ink/8 bg-cloud transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_oklch(0.16_0.006_80/0.45)]"
        >
          <div class="aspect-[4/3] overflow-hidden">
            <img
              :src="p.image"
              :alt="p.alt"
              class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
              width="800"
              height="600"
            />
          </div>
          <div class="flex flex-1 flex-col p-6">
            <p class="text-spec text-xs uppercase tracking-wide text-ember-deep">{{ p.kind }}</p>
            <h3 class="mt-2 font-display text-xl font-bold text-ink">{{ p.name }}</h3>
            <p class="mt-3 text-sm leading-relaxed text-ink/60">{{ p.blurb }}</p>

            <dl class="mt-5 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-ink/8 pt-5">
              <div v-for="s in p.specs" :key="s.label">
                <dt class="text-[0.7rem] uppercase tracking-wide text-ink/40">{{ s.label }}</dt>
                <dd class="text-spec mt-0.5 text-sm font-medium text-ink">{{ s.value }}</dd>
              </div>
            </dl>

            <RouterLink
              v-if="routed[p.id]"
              :to="routed[p.id]"
              class="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ember-deep transition-colors hover:text-ink"
            >
              Configurează 3D
              <span class="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </RouterLink>
            <a v-else href="#contact" class="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-ember-deep">
              Cere ofertă
              <span class="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
