<script setup lang="ts">
import { ref, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'

const props = defineProps<{ modelValue: string; options: string[]; label?: string; id?: string }>()
const emit = defineEmits<{ 'update:modelValue': [v: string] }>()

const open = ref(false)
const root = ref<HTMLElement>()
const active = ref(-1)
const selectedIndex = computed(() => props.options.indexOf(props.modelValue))

onClickOutside(root, () => (open.value = false))

function toggle() {
  open.value = !open.value
  if (open.value) active.value = selectedIndex.value
}
function choose(v: string) {
  emit('update:modelValue', v)
  open.value = false
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') { open.value = false; return }
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    if (open.value && active.value >= 0) choose(props.options[active.value])
    else toggle()
    return
  }
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    if (!open.value) { open.value = true; active.value = selectedIndex.value; return }
    const dir = e.key === 'ArrowDown' ? 1 : -1
    active.value = (active.value + dir + props.options.length) % props.options.length
  }
}
</script>

<template>
  <div ref="root" class="relative">
    <button
      :id="id"
      type="button"
      class="field flex w-full items-center justify-between text-left"
      :class="open ? 'is-open' : ''"
      :aria-expanded="open"
      aria-haspopup="listbox"
      @click="toggle"
      @keydown="onKey"
    >
      <span :class="modelValue ? 'text-cloud' : 'text-cloud/40'">{{ modelValue || 'Alege un model' }}</span>
      <svg
        class="ml-3 shrink-0 text-cloud/45 transition-transform duration-300"
        :class="open ? 'rotate-180 text-ember' : ''"
        width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>

    <Transition
      enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition duration-150 ease-in" leave-to-class="opacity-0 -translate-y-1"
    >
      <ul
        v-if="open"
        class="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-graphite/70 bg-ink-2 p-1.5 shadow-[0_24px_60px_-20px_oklch(0_0_0/0.7)]"
        role="listbox"
      >
        <li
          v-for="(opt, i) in options"
          :key="opt"
          role="option"
          :aria-selected="opt === modelValue"
          class="flex cursor-pointer items-center justify-between rounded-lg px-3.5 py-2.5 text-sm transition-colors"
          :class="[
            opt === modelValue ? 'text-cloud' : 'text-cloud/75',
            i === active ? 'bg-cloud/8' : 'hover:bg-cloud/6',
          ]"
          @mouseenter="active = i"
          @click="choose(opt)"
        >
          {{ opt }}
          <svg v-if="opt === modelValue" class="text-ember" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 13l4 4L19 7" /></svg>
        </li>
      </ul>
    </Transition>
  </div>
</template>
