<script setup lang="ts">
import { computed } from 'vue'
import { images, type ImageName } from '@/data/images'

// Responsive AVIF/WebP <picture> for a photo from public/gallery (variants built by
// scripts/optimize-images.mjs). Extra attributes (class, data-*) land on the <img>.
// crop="card" serves the 4:3 centre crop (for 4:3 frames such as the catalog cards).
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    name: ImageName
    alt: string
    sizes: string
    loading?: 'lazy' | 'eager'
    fetchpriority?: 'high' | 'low' | 'auto'
    crop?: 'card'
  }>(),
  { loading: 'lazy', fetchpriority: 'auto' },
)

const meta = computed(() => images[props.name])
const variant = computed(() => (props.crop ? `${props.name}-${props.crop}` : props.name))
const widths = computed<readonly number[]>(() => (props.crop ? meta.value.card : meta.value.widths))
const srcset = (ext: 'avif' | 'webp') => widths.value.map((w) => `/img/${variant.value}-${w}.${ext} ${w}w`).join(', ')
// Intrinsic size for the aspect ratio (no layout shift); the card crop is 4:3.
const dims = computed(() =>
  props.crop ? { width: 800, height: 600 } : { width: meta.value.width, height: meta.value.height },
)
// Largest variant, opened by the lightbox instead of the (smaller) displayed source.
const full = computed(() => `/img/${props.name}-${meta.value.widths[meta.value.widths.length - 1]}.webp`)
</script>

<template>
  <!-- display: contents keeps the <img> sizing against the parent, exactly like a bare <img>. -->
  <picture class="contents">
    <source type="image/avif" :srcset="srcset('avif')" :sizes="sizes" />
    <source type="image/webp" :srcset="srcset('webp')" :sizes="sizes" />
    <img
      v-bind="$attrs"
      :src="meta.src"
      :alt="alt"
      :width="dims.width"
      :height="dims.height"
      :loading="loading"
      :fetchpriority="fetchpriority"
      :data-full="full"
      :decoding="loading === 'eager' ? 'sync' : 'async'"
    />
  </picture>
</template>
