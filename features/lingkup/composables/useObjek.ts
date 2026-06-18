import { ref } from 'vue'
import { useObjekApi } from '../services/objek.api'
import type { ObjekFormInput, ObjekRecord } from '../types/objek'

interface UseObjekOptions {
  lingkupId: string | null | undefined
  unitId?: string | null | undefined
}

export function useObjek(options: UseObjekOptions) {
  const api = useObjekApi()
  const rows = ref<ObjekRecord[]>([])
  const total = ref(0)
  const loading = ref(false)

  async function fetchObjek() {
    if (!options.lingkupId) {
      rows.value = []
      total.value = 0
      return
    }

    loading.value = true
    const result = await api.listObjek(
      options.lingkupId,
      options.unitId || undefined
    )
    rows.value = result.items
    total.value = result.total
    loading.value = false
  }

  async function saveObjek(
    payload: Omit<ObjekFormInput, 'lingkupId' | 'unitId'>,
    objekId?: string
  ) {
    if (!options.lingkupId) return null

    if (objekId) {
      return api.updateObjek(
        options.lingkupId,
        objekId,
        payload,
        options.unitId || undefined
      )
    }

    return api.createObjek({
      lingkupId: options.lingkupId,
      unitId: options.unitId || undefined,
      ...payload,
    })
  }

  return {
    rows,
    total,
    loading,
    fetchObjek,
    saveObjek,
    removeObjek: (objekId: string) => {
      if (!options.lingkupId) return Promise.resolve(null)
      return api.removeObjek(
        options.lingkupId,
        objekId,
        options.unitId || undefined
      )
    },
  }
}
