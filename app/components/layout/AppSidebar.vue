<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen bg-white">
    <!-- Header umum (AppHeader) -->
    <AppHeader />

    <!-- Konten halaman -->
    <main class="pt-16">
      <slot />
    </main>
  </div>
</template>

<!-- <script setup lang="ts">
import AppHeader from '~/components/AppHeader.vue'
</script> -->
