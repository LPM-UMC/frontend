import { ref } from 'vue'
import { useLingkupApi } from '../services/lingkup.api'
import type { LingkupFormInput, LingkupRecord } from '../types/lingkup'

export function useLingkup() {
  const api = useLingkupApi()
  const rows = ref<LingkupRecord[]>([])
  const total = ref(0)
  const loading = ref(false)

  async function fetchLingkup(query?: Record<string, any>) {
    loading.value = true
    try {
      const result = await api.listLingkup(query)
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

  async function saveLingkup(payload: LingkupFormInput, lingkupId?: string) {
    if (lingkupId) {
      return api.updateLingkup(lingkupId, payload)
    }

    return api.createLingkup(payload)
  }

  return {
    rows,
    total,
    loading,
    fetchLingkup,
    saveLingkup,
    removeLingkup: api.removeLingkup,
  }
}
