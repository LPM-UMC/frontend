import { ref } from 'vue'
import { useFm5Api, type Fm5CreatePayload, type Fm5SanggahPayload, type Fm5SignPayload } from '../services/fm5.api'
import type { Fm5DashboardContext } from '../data/fm5GkmfDummy'
import { useI18n } from 'vue-i18n'

export function useFm5Repository() {
  const api = useFm5Api()
  const { t } = useI18n()

  async function getDashboardData(context: Fm5DashboardContext, params: { page?: number, size?: number, search?: string }) {
    const res = await api.getDashboard(context.periodeModulId, context.unitId, params)
    return res
  }

  async function getCreatePageData(context: Fm5DashboardContext) {
    const res = await api.getCreateData(context.periodeModulId, context.unitId)
    return res
  }

  async function getDetailData(beritaAcaraId: string) {
    const res = await api.getDetail(beritaAcaraId)
    return res
  }

  async function verifyPublicData(beritaAcaraId: string) {
    const res = await api.verifyPublic(beritaAcaraId)
    return res.data
  }

  async function createBeritaAcara(context: Fm5DashboardContext, payload: Fm5CreatePayload) {
    const res = await api.createBeritaAcara(context.periodeModulId, context.unitId, payload)
    return res
  }

  async function signBeritaAcara(beritaAcaraId: string, payload: Fm5SignPayload) {
    await api.signBeritaAcara(beritaAcaraId, payload)
    return true
  }

  async function submitSanggahan(beritaAcaraId: string, payload: Fm5SanggahPayload) {
    await api.sanggahBeritaAcara(beritaAcaraId, payload)
    return true
  }

  async function tarikSanggahan(beritaAcaraId: string, payload: { roleId: string }) {
    await api.tarikSanggahBeritaAcara(beritaAcaraId, payload)
    return true
  }

  async function getLampirans(beritaAcaraId: string) {
    const res = await api.getLampirans(beritaAcaraId)
    return res
  }

  async function getLampiranUrl(beritaAcaraId: string, lampiranId: string) {
    const res = await api.getLampiranUrl(beritaAcaraId, lampiranId)
    return res.url
  }

  async function uploadLampiran(beritaAcaraId: string, file: File) {
    const res = await api.uploadLampiran(beritaAcaraId, file)
    return res
  }

  async function deleteLampiran(beritaAcaraId: string, lampiranId: string) {
    await api.deleteLampiran(beritaAcaraId, lampiranId)
    return true
  }

  return {
    getDashboardData,
    getCreatePageData,
    getDetailData,
    verifyPublicData,
    createBeritaAcara,
    signBeritaAcara,
    submitSanggahan,
    tarikSanggahan,
    getLampirans,
    getLampiranUrl,
    uploadLampiran,
    deleteLampiran,
  }
}
