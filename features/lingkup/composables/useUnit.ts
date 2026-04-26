import { ref } from 'vue'
import { useUnitApi } from '../services/unit.api'
import type { UnitFormInput, UnitRecord } from '../types/unit'

export function useUnit(lingkupId: string | null | undefined) {
  const api = useUnitApi()
  const rows = ref<UnitRecord[]>([])
  const total = ref(0)
  const loading = ref(false)

  async function fetchUnit() {
    if (!lingkupId) {
      rows.value = []
      total.value = 0
      return
    }

    loading.value = true
    const result = await api.listUnit(lingkupId)
    rows.value = result.items
    total.value = result.total
    loading.value = false
  }

  async function saveUnit(payload: Omit<UnitFormInput, 'lingkupId'>, unitId?: string) {
    if (!lingkupId) return null

    if (unitId) {
      return api.updateUnit(lingkupId, unitId, payload)
    }

    return api.createUnit({
      lingkupId,
      ...payload,
    })
  }

  return {
    rows,
    total,
    loading,
    fetchUnit,
    saveUnit,
    removeUnit: (unitId: string) => {
      if (!lingkupId) return Promise.resolve(null)
      return api.removeUnit(lingkupId, unitId)
    },
  }
}
