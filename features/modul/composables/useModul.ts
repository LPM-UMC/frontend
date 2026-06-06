import { ref } from 'vue'
import { useModulApi } from '../services/modul.api'
import type { ModulFormInput, ModulRecord } from '../types/modul'
import { useAuthStore } from '#stores/auth'

export function useModul() {
  const api = useModulApi()
  const authStore = useAuthStore()
  const rows = ref<ModulRecord[]>([])
  const total = ref(0)
  const loading = ref(false)

  async function fetchModul(query?: Record<string, any>) {
    loading.value = true
    try {
      const activeRoleKode = authStore.activeRole?.kode || ''
      let result;

      if (activeRoleKode.includes('lpm')) {
        result = await api.listModulMonev(query)
      } else if (activeRoleKode.includes('spi')) {
        result = await api.listModulAmi(query)
      } else {
        // Fallback or handle appropriately
        result = await api.listModulMonev(query)
      }

      rows.value = result?.data ?? []
      total.value = result?.meta?.total ?? 0
    } catch (e) {
      console.error(e)
      rows.value = []
      total.value = 0
    } finally {
      loading.value = false
    }
  }

  async function saveModul(payload: ModulFormInput, modulId?: string) {
    if (modulId) {
      return api.updateModul(modulId, payload)
    }

    const activeRoleKode = authStore.activeRole?.kode || ''
    if (activeRoleKode.includes('lpm')) {
      return api.createModulMonev(payload)
    } else if (activeRoleKode.includes('spi')) {
      return api.createModulAmi(payload)
    }
    
    return api.createModulMonev(payload)
  }

  async function getModul(modulId: string) {
    return api.getModul(modulId)
  }

  return {
    rows,
    total,
    loading,
    fetchModul,
    getModul,
    saveModul,
    removeModul: api.removeModul,
  }
}
