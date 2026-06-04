<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { lightbox, openLightbox, closeLightbox } from '@/composables/useLightbox'

const zoomed = ref(false)
const origin = ref('50% 50%')
const closeBtn = ref<HTMLButtonElement>()

// Any content <img> (inside <main>, not opted out) opens the lightbox.
function onDocClick(e: MouseEvent) {
  const img = (e.target as HTMLElement)?.closest('img') as HTMLImageElement | null
  if (!img || !img.closest('main') || img.dataset.noZoom !== undefined) return
  e.preventDefault()
  openLightbox(img.currentSrc || img.src, img.alt)
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && lightbox.value) closeLightbox()
}
function toggleZoom(e: MouseEvent) {
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  origin.value = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`
  zoomed.value = !zoomed.value
}
function onMove(e: MouseEvent) {
  if (!zoomed.value) return
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  origin.value = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`
}

watch(lightbox, (v) => {
  zoomed.value = false
  if (typeof document !== 'undefined') {
    document.body.style.overflow = v ? 'hidden' : ''
    if (v) nextTick(() => closeBtn.value?.focus())
  }
})

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
      leave-active-class="transition duration-200 ease-in" leave-to-class="opacity-0"
    >
      <div
        v-if="lightbox"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-ink/92 backdrop-blur-sm p-4 sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-label="Imagine mărită"
        @click.self="closeLightbox()"
      >
        <!-- Close -->
        <button
          ref="closeBtn"
          class="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-graphite/70 bg-ink/70 text-cloud/80 transition-colors hover:text-cloud"
          aria-label="Închide"
          @click="closeLightbox()"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>

        <figure class="flex max-h-full max-w-full flex-col items-center gap-4" @click.stop>
          <div
            class="overflow-hidden rounded-xl"
            :class="zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'"
            @click="toggleZoom"
            @mousemove="onMove"
          >
            <img
              :src="lightbox.src"
              :alt="lightbox.alt"
              data-no-zoom
              class="block max-h-[84vh] max-w-[92vw] object-contain transition-transform duration-300 ease-out select-none"
              :style="{ transform: zoomed ? 'scale(2.2)' : 'scale(1)', transformOrigin: origin }"
              draggable="false"
            />
          </div>
          <figcaption v-if="lightbox.alt" class="max-w-[80ch] text-center text-sm text-cloud/55">
            {{ lightbox.alt }}
          </figcaption>
        </figure>
      </div>
    </Transition>
  </Teleport>
</template>
