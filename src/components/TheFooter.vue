<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-graphite/60 bg-ink text-cloud/60">
    <div class="container-x flex flex-col gap-8 py-12 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <a href="#top" class="font-logo text-xl tracking-tight text-cloud" aria-label="SpaceBox — acasă">
          <span class="font-medium">Space</span><span class="font-bold">Box</span><span class="text-ember">.</span>
        </a>
        <p class="mt-2 max-w-xs text-sm">
          Case și spații modulare premium. Proiectate, fabricate și montate la cheie.
        </p>
      </div>
      <nav class="flex flex-wrap gap-x-7 gap-y-2 text-sm" aria-label="Footer">
        <a href="#de-ce" class="transition-colors hover:text-cloud">De ce modular</a>
        <a href="#capsula" class="transition-colors hover:text-cloud">Capsula</a>
        <a href="#catalog" class="transition-colors hover:text-cloud">Catalog</a>
        <a href="#proces" class="transition-colors hover:text-cloud">Proces</a>
        <a href="#contact" class="transition-colors hover:text-cloud">Contact</a>
      </nav>
    </div>
    <div class="container-x border-t border-graphite/40 py-6 text-xs text-cloud/40">
      © {{ year }} SpaceBox. Toate drepturile rezervate.
    </div>
  </footer>
</template>
