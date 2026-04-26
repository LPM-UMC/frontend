import { ref } from 'vue'
import { usePeriodeModulApi } from '../services/periode-modul.api'
import type { PeriodeModulFormInput, PeriodeModulRecord } from '../types/periode-modul'

export function usePeriodeModul() {
  const api = usePeriodeModulApi()
  const rows = ref<PeriodeModulRecord[]>([])
  const total = ref(0)
  const loading = ref(false)

  async function fetchPeriodeModul() {
    loading.value = true
    const result = await api.listPeriodeModul()
    rows.value = result?.items ?? []
    total.value = result?.total ?? 0
    loading.value = false
  }

  async function savePeriodeModul(payload: PeriodeModulFormInput, periodeModulId?: string) {
    if (periodeModulId) {
      return api.updatePeriodeModul(periodeModulId, payload)
    }

    return api.createPeriodeModul(payload)
  }

  return {
    rows,
    total,
    loading,
    fetchPeriodeModul,
    savePeriodeModul,
    removePeriodeModul: api.removePeriodeModul,
  }
}
