<script setup lang="ts">
import Fm5DashboardPage from '#features/periode-modul/pages/fm5/Fm5DashboardPage.vue'
import { useI18n } from 'vue-i18n'

definePageMeta({
  layout: 'periode-modul',
})

const { t } = useI18n()
const toast = useToast()

toast.add({
  title: t('sedangTahapPengembangan.judul'),
  description: t('sedangTahapPengembangan.deskripsi'),
  color: 'warning',
})
</script>

<template>
  <Fm5DashboardPage />
</template>
