import { ref } from 'vue'
import { useAspekApi } from '../services/aspek.api'
import type { AspekFormInput, AspekRecord } from '../types/aspek'

export function useAspek(modulId: string | null | undefined) {
  const api = useAspekApi()
  const rows = ref<AspekRecord[]>([])
  const total = ref(0)
  const loading = ref(false)

  async function fetchAspek() {
    if (!modulId) {
      rows.value = []
      total.value = 0
      return
    }

    loading.value = true
    const result = await api.listAspek(modulId)
    rows.value = result.items
    total.value = result.total
    loading.value = false
  }

  async function saveAspek(payload: Omit<AspekFormInput, 'modulId'>, aspekId?: string) {
    if (!modulId) return null

    if (aspekId) {
      return api.updateAspek(modulId, aspekId, payload)
    }

    return api.createAspek({
      modulId,
      ...payload,
    })
  }

  return {
    rows,
    total,
    loading,
    fetchAspek,
    saveAspek,
    removeAspek: (aspekId: string) => {
      if (!modulId) return Promise.resolve(null)
      return api.removeAspek(modulId, aspekId)
    },
  }
}
