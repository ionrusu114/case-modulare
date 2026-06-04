<script setup lang="ts">
import { useHead } from '@unhead/vue'
import TheLightbox from '@/components/TheLightbox.vue'

const siteUrl = 'https://modula.ro'
const title = 'MODULA — Case Modulare Premium | Capsule, Containere & Spații Modulare'
const description =
  'MODULA proiectează și livrează case modulare premium: capsule de 11.5 m, containere locuibile, chioșcuri și puncte de pază. Structură din oțel galvanizat, izolație performantă, montaj în 15–20 de zile.'

useHead({
  titleTemplate: (t) => (t && t !== title ? `${t} · MODULA` : title),
  htmlAttrs: { lang: 'ro' },
  link: [{ rel: 'canonical', href: siteUrl }],
  meta: [
    { name: 'description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'MODULA' },
    { property: 'og:locale', content: 'ro_RO' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: siteUrl },
    { property: 'og:image', content: `${siteUrl}/renders/capsule-hero.jpg` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: `${siteUrl}/renders/capsule-hero.jpg` },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'MODULA',
        description,
        url: siteUrl,
        makesOffer: {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Capsulă modulară premium 11.5 m',
            category: 'Case modulare',
          },
        },
      }),
    },
  ],
})
</script>

<template>
  <RouterView />
  <TheLightbox />
</template>
