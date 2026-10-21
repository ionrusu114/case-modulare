<script setup lang="ts">
import { defineAsyncComponent, hydrateOnVisible, type Component } from 'vue'
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import HeroSection from '@/components/sections/HeroSection.vue'

// Below-the-fold sections are prerendered like the rest, but hydrate (and fetch their chunk) only
// when they come within 400px of the viewport. Keeps the post-load hydration task small (TBT).
const lazy = (loader: () => Promise<Component>) =>
  defineAsyncComponent({ loader, hydrate: hydrateOnVisible({ rootMargin: '400px' }) })

const WhySection = lazy(() => import('@/components/sections/WhySection.vue'))
const CapsuleShowcase = lazy(() => import('@/components/sections/CapsuleShowcase.vue'))
const CatalogSection = lazy(() => import('@/components/sections/CatalogSection.vue'))
const ProcessSection = lazy(() => import('@/components/sections/ProcessSection.vue'))
const GallerySection = lazy(() => import('@/components/sections/GallerySection.vue'))
const ContactSection = lazy(() => import('@/components/sections/ContactSection.vue'))
</script>

<template>
  <div id="top">
    <TheHeader />
    <main>
      <HeroSection />
      <WhySection />
      <CapsuleShowcase />
      <CatalogSection />
      <ProcessSection />
      <GallerySection />
      <ContactSection />
    </main>
    <TheFooter />
  </div>
</template>
