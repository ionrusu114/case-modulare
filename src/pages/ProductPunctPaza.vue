<script setup lang="ts">
import { ref, computed, defineAsyncComponent, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import { RouterLink } from 'vue-router'
import TheFooter from '@/components/TheFooter.vue'
import { product, specs, colorOptions, hotspots } from '@/data/punctPaza'

const GuardPostViewer = defineAsyncComponent(() => import('@/components/three/GuardPostViewer.vue'))
const mounted = ref(false)
onMounted(() => (mounted.value = true))

const color = ref(colorOptions[0])
const view = ref<'exterior' | 'interior'>('exterior')
const activeId = ref<string | null>(null)
const active = computed(() => hotspots.find((h) => h.id === activeId.value) || null)

useHead({
  title: 'Punct de Pază Modular 3.00 × 2.40 m — model 3D interactiv',
  meta: [
    { name: 'description', content: 'Configurează Punctul de Pază Modular MODULA: model 3D interactiv, vezi interiorul și exteriorul, schimbă culoarea (RAL 7035 / 7016) și descoperă specificațiile. 7.20 m², structură oțel galvanizat, montaj 15–20 zile.' },
    { property: 'og:title', content: 'Punct de Pază Modular — model 3D interactiv | MODULA' },
  ],
})
</script>

<template>
  <div id="top" class="bg-ink text-cloud">
    <!-- Slim header -->
    <header class="sticky top-0 z-50 border-b border-graphite/60 bg-ink/85 backdrop-blur-md">
      <div class="container-x flex h-16 items-center justify-between">
        <RouterLink to="/" class="font-display text-lg font-extrabold tracking-tight text-cloud">
          MODULA<span class="text-ember">.</span>
        </RouterLink>
        <div class="flex items-center gap-5">
          <RouterLink to="/" class="text-sm text-cloud/70 transition-colors hover:text-cloud">← Acasă</RouterLink>
          <RouterLink to="/#contact" class="btn-primary !py-2.5 !px-5 text-sm">Cere ofertă</RouterLink>
        </div>
      </div>
    </header>

    <main>
      <!-- Title -->
      <section class="container-x pt-10 pb-6">
        <p class="text-spec mb-3 text-sm tracking-[0.18em] text-ember uppercase">Configurator 3D</p>
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 class="font-display text-cloud" style="font-size: var(--text-h2); line-height: 1.02; letter-spacing: -0.02em">
              {{ product.name }}
            </h1>
            <p class="text-spec mt-2 text-sm text-cloud/55">{{ product.kind }}</p>
          </div>
          <p class="measure text-cloud/65">{{ product.intro }}</p>
        </div>
      </section>

      <!-- 3D stage -->
      <section class="container-x">
        <div class="relative h-[64svh] min-h-[440px] w-full overflow-hidden rounded-3xl border border-graphite/70 bg-gradient-to-b from-ink-2 to-ink">
          <GuardPostViewer
            v-if="mounted"
            :body-color="color.hex"
            :view="view"
            class="absolute inset-0"
            @select="activeId = $event"
          />
          <div v-else class="absolute inset-0 grid place-items-center text-cloud/40 text-sm">Se încarcă modelul 3D…</div>

          <!-- View toggle -->
          <div class="absolute left-4 top-4 flex rounded-full border border-graphite/70 bg-ink/70 p-1 backdrop-blur-md">
            <button
              v-for="v in (['exterior','interior'] as const)"
              :key="v"
              class="rounded-full px-4 py-1.5 text-sm capitalize transition-colors"
              :class="view === v ? 'bg-ember text-ink font-semibold' : 'text-cloud/70 hover:text-cloud'"
              @click="view = v"
            >
              {{ v === 'exterior' ? 'Exterior' : 'Interior' }}
            </button>
          </div>

          <!-- Hint -->
          <p class="text-spec pointer-events-none absolute right-4 top-5 hidden text-xs text-cloud/45 sm:block">
            trage pentru a roti · click pe puncte
          </p>

          <!-- Color picker -->
          <div class="absolute bottom-4 left-4 flex items-center gap-3 rounded-2xl border border-graphite/70 bg-ink/70 px-4 py-3 backdrop-blur-md">
            <div class="flex gap-2">
              <button
                v-for="c in colorOptions"
                :key="c.ral"
                class="h-8 w-8 rounded-full border-2 transition-transform hover:scale-110"
                :class="color.ral === c.ral ? 'border-ember' : 'border-cloud/25'"
                :style="{ background: c.hex }"
                :aria-label="`${c.name} ${c.ral}`"
                :title="`${c.name} · ${c.ral}`"
                @click="color = c"
              />
            </div>
            <div class="text-spec hidden text-xs leading-tight sm:block">
              <div class="text-cloud">{{ color.name }}</div>
              <div class="text-cloud/45">{{ color.ral }}</div>
            </div>
          </div>

          <!-- Hotspot detail -->
          <Transition
            enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-y-3"
            leave-active-class="transition duration-200 ease-in" leave-to-class="opacity-0 translate-y-3"
          >
            <div v-if="active" class="absolute bottom-4 right-4 left-4 sm:left-auto sm:max-w-xs rounded-2xl border border-graphite/70 bg-ink/85 p-5 backdrop-blur-md">
              <button class="absolute right-3 top-3 text-cloud/40 hover:text-cloud" aria-label="Închide" @click="activeId = null">✕</button>
              <h3 class="font-display text-h3 text-cloud pr-6">{{ active.title }}</h3>
              <p class="mt-2 text-sm text-cloud/65">{{ active.body }}</p>
            </div>
          </Transition>
        </div>
      </section>

      <!-- Specs + features -->
      <section class="container-x py-section">
        <div class="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <div>
            <h2 class="font-display text-h3 text-cloud">Specificații tehnice</h2>
            <dl class="mt-6 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-graphite/60 pt-7 sm:grid-cols-3">
              <div v-for="s in specs" :key="s.label">
                <dt class="text-xs uppercase tracking-wide text-cloud/40">{{ s.label }}</dt>
                <dd class="text-spec mt-1 text-base font-medium text-cloud">{{ s.value }}</dd>
              </div>
            </dl>
          </div>
          <aside class="rounded-3xl border border-graphite/70 bg-ink-2 p-8">
            <h2 class="font-display text-h3 text-cloud">Îți place modelul?</h2>
            <p class="mt-3 text-cloud/65">
              Spune-ne culoarea aleasă ({{ color.name }} · {{ color.ral }}) și dotările dorite. Revenim cu o ofertă fermă și termen de livrare.
            </p>
            <RouterLink to="/#contact" class="btn-primary mt-6 w-full justify-center">Cere ofertă</RouterLink>
            <RouterLink to="/#catalog" class="btn-ghost mt-3 w-full justify-center">Vezi tot catalogul</RouterLink>
          </aside>
        </div>
      </section>
    </main>

    <TheFooter />
  </div>
</template>
