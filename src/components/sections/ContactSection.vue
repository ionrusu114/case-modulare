<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { products } from '@/data/catalog'
import { contact } from '@/data/contact'
import { useGsapContext, revealOnScroll } from '@/composables/useGsap'
import FormSelect from '@/components/FormSelect.vue'

const root = ref<HTMLElement>()
const submitted = ref(false)
const form = reactive({ name: '', contact: '', product: products[0].name, message: '' })
const productNames = computed(() => products.map((p) => p.name))

function onSubmit() {
  // Presentational: in production wire to a CRM / email endpoint.
  submitted.value = true
}

useGsapContext(() => {
  revealOnScroll(root.value!, '.reveal', { y: 30, stagger: 0.08 })
}, root)
</script>

<template>
  <section id="contact" ref="root" class="bg-ink py-section text-cloud">
    <div class="container-x grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-24">
      <div>
        <p class="reveal text-spec mb-4 text-sm tracking-[0.18em] text-ember uppercase">Contact</p>
        <h2 class="reveal max-w-[14ch] font-display text-cloud" style="font-size: var(--text-hero); line-height: 0.98; letter-spacing: -0.03em">
          Hai <span class="whitespace-nowrap">să-l</span> construim.
        </h2>
        <p class="reveal measure mt-6 text-lg text-cloud/65">
          Spune-ne ce ai în minte. Revenim cu o ofertă fermă, dimensiuni, culori RAL și termen de livrare.
        </p>

        <dl class="reveal mt-10 space-y-5 text-cloud/75">
          <div>
            <dt class="text-xs uppercase tracking-wide text-cloud/60">Telefon</dt>
            <dd class="text-spec mt-1 text-lg">
              <a :href="contact.phoneHref" class="transition-colors hover:text-ember">{{ contact.phone }}</a>
            </dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-cloud/60">Email</dt>
            <dd class="text-spec mt-1 text-lg">
              <a :href="`mailto:${contact.email}`" class="transition-colors hover:text-ember">{{ contact.email }}</a>
            </dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-cloud/60">Adresă</dt>
            <dd class="mt-1 text-lg">
              <a href="#harta" class="transition-colors hover:text-ember">{{ contact.street }}, {{ contact.city }}</a>
            </dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-cloud/60">Livrare</dt>
            <dd class="mt-1">În toată țara, montaj inclus.</dd>
          </div>
        </dl>
      </div>

      <!-- Form -->
      <div class="reveal">
        <form
          v-if="!submitted"
          class="rounded-3xl border border-graphite/70 bg-ink-2 p-6 sm:p-9"
          @submit.prevent="onSubmit"
        >
          <div class="grid gap-5">
            <div class="grid gap-5 sm:grid-cols-2">
              <label class="block">
                <span class="field-label">Nume</span>
                <input v-model="form.name" type="text" required class="field" placeholder="Numele tău" />
              </label>
              <label class="block">
                <span class="field-label">Telefon sau email</span>
                <input v-model="form.contact" type="text" required class="field" placeholder="Cum te contactăm" />
              </label>
            </div>

            <div class="block">
              <span class="field-label" id="model-label">Model</span>
              <FormSelect v-model="form.product" :options="productNames" aria-labelledby="model-label" />
            </div>

            <label class="block">
              <span class="field-label">Detalii</span>
              <textarea v-model="form.message" rows="4" class="field resize-none" placeholder="Dimensiuni, dotări, termen dorit..." />
            </label>

            <button type="submit" class="btn-primary mt-1 w-full justify-center">Trimite cererea</button>
            <p class="text-center text-xs text-cloud/60">Răspundem în maxim 24h lucrătoare.</p>
          </div>
        </form>

        <div v-else class="flex h-full flex-col justify-center rounded-3xl border border-graphite/70 bg-ink-2 p-10 text-center">
          <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-ember text-ink">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 13l4 4L19 7" /></svg>
          </div>
          <h3 class="font-display text-h3 text-cloud">Cerere trimisă, {{ form.name || 'mulțumim' }}!</h3>
          <p class="mt-3 text-cloud/60">Te contactăm în curând cu o ofertă pentru {{ form.product }}.</p>
        </div>
      </div>
    </div>

    <!-- Map: static, pre-styled OpenStreetMap render (no third-party JS or iframe), pin at the
         exact centre. object-cover crops symmetrically, so the centre stays the address. -->
    <div id="harta" class="reveal container-x mt-16 scroll-mt-24 lg:mt-24">
      <figure class="relative overflow-hidden rounded-3xl border border-graphite/70 bg-ink-2">
        <picture class="contents">
          <source type="image/avif" srcset="/img/harta-800.avif 800w, /img/harta-1600.avif 1600w" sizes="(min-width: 640px) 90vw, 100vw" />
          <source type="image/webp" srcset="/img/harta-800.webp 800w, /img/harta-1600.webp 1600w" sizes="(min-width: 640px) 90vw, 100vw" />
          <img
            src="/img/harta.jpg"
            :alt="`Hartă cu locația SpaceBox: ${contact.street}, ${contact.city}`"
            width="1600"
            height="900"
            loading="lazy"
            decoding="async"
            data-no-zoom
            class="aspect-[4/3] w-full object-cover sm:aspect-[16/9] lg:aspect-[21/8]"
          />
        </picture>

        <!-- Pin: the tip sits on the centre point. -->
        <div class="pointer-events-none absolute left-1/2 top-1/2" aria-hidden="true">
          <span class="map-pulse absolute -left-6 -top-6 h-12 w-12 rounded-full bg-ember/35" />
          <div class="absolute bottom-0 left-0 flex -translate-x-1/2 flex-col items-center">
            <span class="font-logo mb-2 whitespace-nowrap rounded-full bg-ink px-3.5 py-1.5 text-sm tracking-tight text-cloud shadow-[0_12px_30px_-10px_oklch(0.16_0.006_80/0.9)]">
              <span class="font-medium">Space</span><span class="font-bold">Box</span><span class="text-ember">.</span>
            </span>
            <svg width="30" height="40" viewBox="0 0 30 40" class="drop-shadow-[0_6px_10px_oklch(0.16_0.006_80/0.7)]">
              <path d="M15 0C6.7 0 0 6.6 0 14.8 0 25.9 15 40 15 40s15-14.1 15-25.2C30 6.6 23.3 0 15 0z" fill="var(--color-ember)" />
              <circle cx="15" cy="14.5" r="5.5" fill="var(--color-ink)" />
            </svg>
          </div>
        </div>

        <figcaption class="absolute bottom-2 right-3 text-[0.65rem] text-cloud/60">
          ©
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener" class="underline-offset-2 hover:text-cloud hover:underline">OpenStreetMap</a>
        </figcaption>
      </figure>

      <div class="mt-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <p class="text-lg text-cloud/75">{{ contact.street }}, {{ contact.city }}</p>
        <div class="flex flex-wrap gap-3">
          <a :href="contact.googleMapsUrl" target="_blank" rel="noopener" class="btn-ghost">Deschide în Google Maps</a>
          <a :href="contact.wazeUrl" target="_blank" rel="noopener" class="btn-ghost">Navighează cu Waze</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.map-pulse {
  animation: map-pulse 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
}
@keyframes map-pulse {
  from { transform: scale(0.4); opacity: 1; }
  to { transform: scale(2.2); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .map-pulse { animation: none; opacity: 0.6; }
}
</style>
