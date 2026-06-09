<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const scrolled = ref(false)
const open = ref(false)
const links = [
  { href: '#de-ce', label: 'De ce modular' },
  { href: '#capsula', label: 'Capsula' },
  { href: '#catalog', label: 'Catalog' },
  { href: '#proces', label: 'Proces' },
  { href: '#galerie', label: 'Galerie' },
]
function onScroll() {
  scrolled.value = window.scrollY > 24
}
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500"
    :class="
      scrolled
        ? 'border-b border-graphite/60 bg-ink/80 backdrop-blur-md'
        : 'border-b border-transparent bg-transparent'
    "
  >
    <nav class="container-x flex h-16 items-center justify-between" aria-label="Navigație principală">
      <a href="#top" class="font-logo text-xl tracking-tight text-cloud" aria-label="SpaceBox — acasă">
        <span class="font-medium">Space</span><span class="font-bold">Box</span><span class="text-ember">.</span>
      </a>

      <ul class="hidden items-center gap-8 md:flex">
        <li v-for="l in links" :key="l.href">
          <a :href="l.href" class="text-sm text-cloud/70 transition-colors hover:text-cloud">{{ l.label }}</a>
        </li>
      </ul>

      <a href="#contact" class="hidden md:inline-flex btn-primary !py-2.5 !px-5 text-sm">Cere ofertă</a>

      <button
        class="md:hidden text-cloud"
        :aria-expanded="open"
        aria-label="Meniu"
        @click="open = !open"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path v-if="!open" d="M3 6h18M3 12h18M3 18h18" />
          <path v-else d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </nav>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="open" class="border-t border-graphite/60 bg-ink/95 backdrop-blur-md md:hidden">
        <ul class="container-x flex flex-col gap-1 py-4">
          <li v-for="l in links" :key="l.href">
            <a :href="l.href" class="block py-2.5 text-cloud/80" @click="open = false">{{ l.label }}</a>
          </li>
          <li class="pt-2">
            <a href="#contact" class="btn-primary w-full justify-center" @click="open = false">Cere ofertă</a>
          </li>
        </ul>
      </div>
    </Transition>
  </header>
</template>
