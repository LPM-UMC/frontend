import {
  useFm6Api,
  type Fm6CreatePayload,
  type Fm6JawabanPayload,
  type SurveyStatus,
} from '../services/fm6.api'

export interface Fm6Context {
  periodeModulId: string
  unitId: string
}

export function useFm6Repository() {
  const api = useFm6Api()

  // ================= ADMIN =================
  async function getDashboardData(context: Fm6Context, params: { page?: number, size?: number, search?: string }) {
    return await api.getDashboard(context.periodeModulId, context.unitId, params)
  }

  async function getCreatePageData(context: Fm6Context) {
    return await api.getCreateData(context.periodeModulId, context.unitId)
  }

  async function createSurvey(context: Fm6Context, payload: Fm6CreatePayload) {
    return await api.createSurvey(context.periodeModulId, context.unitId, payload)
  }

  async function updateSurvey(surveyId: string, payload: Fm6CreatePayload) {
    await api.updateSurvey(surveyId, payload)
    return true
  }

  async function getDetailData(surveyId: string) {
    return await api.getDetail(surveyId)
  }

  async function updateStatus(surveyId: string, status: SurveyStatus) {
    await api.updateStatus(surveyId, status)
    return true
  }

  async function deleteSurvey(surveyId: string) {
    await api.deleteSurvey(surveyId)
    return true
  }

  // ================= MAHASISWA =================
  async function getMahasiswaSurveys(context: Fm6Context) {
    return await api.getMahasiswaSurveys(context.periodeModulId, context.unitId)
  }

  async function getAllMahasiswaSurveys() {
    return await api.getAllMahasiswaSurveys()
  }

  async function getMahasiswaSurveyDetail(surveyId: string) {
    return await api.getMahasiswaSurveyDetail(surveyId)
  }

  async function submitJawaban(surveyId: string, payload: Fm6JawabanPayload) {
    await api.submitJawaban(surveyId, payload)
    return true
  }

  return {
    // Admin
    getDashboardData,
    getCreatePageData,
    createSurvey,
    updateSurvey,
    getDetailData,
    updateStatus,
    deleteSurvey,
    // Mahasiswa
    getMahasiswaSurveys,
    getAllMahasiswaSurveys,
    getMahasiswaSurveyDetail,
    submitJawaban,
  }
}
