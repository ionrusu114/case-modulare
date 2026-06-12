<script setup lang="ts">
import { useHead } from '@unhead/vue'
import TheLightbox from '@/components/TheLightbox.vue'

const siteUrl = 'https://spacebox.md'
const title = 'SpaceBox — Case Modulare Premium | Capsule, Containere & Spații Modulare'
const description =
  'SpaceBox proiectează și livrează case modulare premium: capsule de 11.5 m, containere locuibile, chioșcuri și puncte de pază. Structură din oțel galvanizat, izolație performantă, montaj de la 15 zile.'
const ogImage = `${siteUrl}/renders/capsule-hero.jpg`
const ogImageAlt = 'Capsulă modulară premium SpaceBox de 11.5 m cu balcon, amplasată pe deal'

useHead({
  titleTemplate: (t) => (t && t !== title ? `${t} · SpaceBox` : title),
  htmlAttrs: { lang: 'ro' },
  link: [{ rel: 'canonical', href: siteUrl }],
  meta: [
    { name: 'description', content: description },
    { name: 'robots', content: 'index, follow, max-image-preview:large' },
    { name: 'author', content: 'SpaceBox' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'SpaceBox' },
    { property: 'og:locale', content: 'ro_RO' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: siteUrl },
    { property: 'og:image', content: ogImage },
    { property: 'og:image:alt', content: ogImageAlt },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: ogImage },
    { name: 'twitter:image:alt', content: ogImageAlt },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'SpaceBox',
        description,
        url: siteUrl,
        logo: `${siteUrl}/favicon.svg`,
        image: ogImage,
        email: 'contact@spacebox.md',
        areaServed: ['RO', 'MD'],
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
