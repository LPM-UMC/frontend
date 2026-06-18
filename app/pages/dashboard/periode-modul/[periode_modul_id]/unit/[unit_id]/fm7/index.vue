<script setup lang="ts">
import Fm7DashboardPage from '#features/periode-modul/pages/fm7/Fm7DashboardPage.vue'
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
  <Fm7DashboardPage />
</template>
