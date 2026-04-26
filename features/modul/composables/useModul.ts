import { ref } from 'vue'
import { useModulApi } from '../services/modul.api'
import type { ModulFormInput, ModulRecord } from '../types/modul'

export function useModul() {
  const api = useModulApi()
  const rows = ref<ModulRecord[]>([])
  const total = ref(0)
  const loading = ref(false)

  async function fetchModul() {
    loading.value = true
    const result = await api.listModul()
    rows.value = result?.items ?? []
    total.value = result?.total ?? 0
    loading.value = false
  }

  async function saveModul(payload: ModulFormInput, modulId?: string) {
    if (modulId) {
      return api.updateModul(modulId, payload)
    }

    return api.createModul(payload)
  }

  return {
    rows,
    total,
    loading,
    fetchModul,
    saveModul,
    removeModul: api.removeModul,
  }
}
