<script setup lang="ts">
import Fm6MahasiswaJawabDetailPage from '#features/periode-modul/pages/fm6/Fm6MahasiswaJawabDetailPage.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})
</script>

<template>
  <Fm6MahasiswaJawabDetailPage />
</template>
