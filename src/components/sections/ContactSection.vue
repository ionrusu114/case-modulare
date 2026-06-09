<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { products } from '@/data/catalog'
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
          Hai să-l construim.
        </h2>
        <p class="reveal measure mt-6 text-lg text-cloud/65">
          Spune-ne ce ai în minte. Revenim cu o ofertă fermă, dimensiuni, culori RAL și termen de livrare.
        </p>

        <dl class="reveal mt-10 space-y-5 text-cloud/75">
          <div>
            <dt class="text-xs uppercase tracking-wide text-cloud/40">Telefon</dt>
            <dd class="text-spec mt-1 text-lg">+40 700 000 000</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-cloud/40">Email</dt>
            <dd class="text-spec mt-1 text-lg">
              <a href="mailto:contact@spacebox.md" class="transition-colors hover:text-ember">contact@spacebox.md</a>
            </dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-cloud/40">Livrare</dt>
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
            <p class="text-center text-xs text-cloud/40">Răspundem în maxim 24h lucrătoare.</p>
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
  </section>
</template>
