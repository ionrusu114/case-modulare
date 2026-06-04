<script setup lang="ts">
import { ref } from 'vue'
import { useGsapContext, revealOnScroll } from '@/composables/useGsap'

const root = ref<HTMLElement>()
const shots = [
  { src: '/gallery/container-ac.jpeg', alt: 'Container modular gri cu unitate de aer condiționat montată exterior', span: 'sm:col-span-2 sm:row-span-2' },
  { src: '/gallery/interior-dormitor.jpeg', alt: 'Interior container amenajat ca dormitor cu paturi suprapuse', span: '' },
  { src: '/gallery/interior-bucatarie.jpeg', alt: 'Chicinetă modulară cu mobilier din lemn, blat negru și aer condiționat', span: '' },
  { src: '/gallery/container-exterior.jpeg', alt: 'Container modular locuibil gri deschis cu ferestre și ușă centrală', span: 'sm:col-span-2' },
  { src: '/gallery/punct-paza.jpeg', alt: 'Fișă de produs pentru punctul de pază modular cu specificații tehnice', span: '' },
]

useGsapContext(() => {
  revealOnScroll(root.value!, '.reveal', { y: 30, stagger: 0.07 })
}, root)
</script>

<template>
  <section id="galerie" ref="root" class="bg-cloud py-section text-ink">
    <div class="container-x">
      <div class="max-w-[44rem]">
        <p class="reveal text-spec mb-4 text-sm tracking-[0.18em] text-ember-deep uppercase">Galerie</p>
        <h2 class="reveal font-display text-ink" style="font-size: var(--text-h2); line-height: var(--text-h2--line-height); letter-spacing: var(--text-h2--letter-spacing)">
          Module reale, livrate
        </h2>
        <p class="reveal measure mt-5 text-lg text-ink/65">
          Nu randări de catalog. Unități fabricate și echipate, fotografiate înainte de livrare.
        </p>
      </div>

      <div class="mt-12 grid auto-rows-[200px] grid-cols-2 gap-4 sm:grid-cols-4 sm:auto-rows-[230px]">
        <figure
          v-for="(s, i) in shots"
          :key="i"
          class="reveal group relative overflow-hidden rounded-2xl"
          :class="s.span"
        >
          <img
            :src="s.src"
            :alt="s.alt"
            class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </figure>
      </div>
    </div>
  </section>
</template>
