<script setup lang="ts">
import Fm1AspekPage from '#features/periode-modul/pages/fm1/Fm1AspekPage.vue'

definePageMeta({
  layout: 'periode-modul',
  scrollToTop: false,
  key: (route) => `${route.params.periode_modul_id}-${route.params.unit_id}`
})
</script>

<template>
  <Fm1AspekPage />
</template>
