import { ref } from 'vue'
import { useLingkupApi } from '../services/lingkup.api'
import type { LingkupFormInput, LingkupRecord } from '../types/lingkup'

export function useLingkup() {
  const api = useLingkupApi()
  const rows = ref<LingkupRecord[]>([])
  const total = ref(0)
  const loading = ref(false)

  async function fetchLingkup() {
    loading.value = true
    const result = await api.listLingkup()
    rows.value = result?.items ?? []
    total.value = result?.total ?? 0
    loading.value = false
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
