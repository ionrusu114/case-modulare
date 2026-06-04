<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import WhySection from '@/components/sections/WhySection.vue'
import CapsuleShowcase from '@/components/sections/CapsuleShowcase.vue'
import CatalogSection from '@/components/sections/CatalogSection.vue'
import ProcessSection from '@/components/sections/ProcessSection.vue'
import GallerySection from '@/components/sections/GallerySection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
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
