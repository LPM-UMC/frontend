<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import DokumenAmiView from '#features/dokumen-ami/components/DokumenAmiView.vue'
import { useModulApi } from '#features/modul/services/modul.api'
import { useToast } from '#imports'

definePageMeta({
  layout: 'ami',
  middleware: ['auth'],
})

const { t } = useI18n()
const modulApi = useModulApi()
const toast = useToast()

const modulId = ref('')
const isLoading = ref(true)
// modulNameIds is removed since we use t('amiMenus.monev')

onMounted(async () => {
  try {
    const response = await modulApi.listModulAmi({ limit: 100 })
    if (!response || !response.data) return
    const modulList = response.data
    const modul = modulList.find((m) => m.nama === t('amiMenus.monev'))
    
    if (modul) {
      modulId.value = modul.id
    } else {
      toast.add({
        title: 'Modul tidak ditemukan',
        description: 'Pastikan seeder telah dijalankan.',
        color: 'error',
      })
    }
  } catch (error) {
    console.error('Failed to load modul', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-6">
      <h1 class="text-2xl font-bold tracking-tight text-slate-900">{{ t('amiDokumen.uploadDeskripsi', { modul: t('amiMenus.monev', 'Monitoring dan Evaluasi') }) }}</h1>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
    
    <DokumenAmiView 
      v-else-if="modulId" 
      :modul-id="modulId" 
      :modul-name="t('amiMenus.monev', 'Monitoring dan Evaluasi')" 
    />
  </div>
</template>
