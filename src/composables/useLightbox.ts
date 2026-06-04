import { ref } from 'vue'

// Global, single-instance lightbox state. Any content <img> opens it (see TheLightbox).
export const lightbox = ref<{ src: string; alt: string } | null>(null)

export function openLightbox(src: string, alt = '') {
  lightbox.value = { src, alt }
}
export function closeLightbox() {
  lightbox.value = null
}
