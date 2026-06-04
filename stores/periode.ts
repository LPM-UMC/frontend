import { defineStore } from "pinia"
import { useAuthStore } from "./auth"
import { useRuntimeConfig } from "#app"
import type { lang } from "#types/lang"
import type {
  PeriodeResponse,
  CreatePeriodeRequest,
  UpdatePeriodeRequest
} from "#types/periode"
import type { PagingResponse } from "#stores/page"

export const usePeriodeStore = defineStore("periode", {
  state: () => ({
    periodes: [] as PeriodeResponse[],
    periode: null as PeriodeResponse | null,
    periodeAktif: null as PeriodeResponse | null,
    meta: null as any,

    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    // ================= GET LIST =================
    async fetchPeriodes(
      lang: lang,
      params?: {
        page?: number
        size?: number
        search?: string
        order?: "asc" | "desc"
      }
    ) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true
      this.error = null

      try {
        const query = new URLSearchParams()

        if (params?.page) query.append("page", String(params.page))
        if (params?.size) query.append("size", String(params.size))
        if (params?.search) query.append("search", params.search)
        if (params?.order) query.append("order", params.order)

        const res = await $fetch<PagingResponse<PeriodeResponse>>(
          `${config.public.apiBase}/api/${lang}/periode?${query.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        )

        this.periodes = res.data
        this.meta = res.meta

      } catch (err: any) {
        this.error = err?.data?.errors || "Gagal mengambil periode"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ================= GET DETAIL =================
    async fetchPeriodeById(lang: lang, periodeId: string) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true
      this.error = null

      try {
        const res = await $fetch<{ data: PeriodeResponse }>(
          `${config.public.apiBase}/api/${lang}/periode/${periodeId}`,
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        )

        this.periode = res.data

      } catch (err: any) {
        this.error = err?.data?.errors || "Periode tidak ditemukan"
      } finally {
        this.isLoading = false
      }
    },

    // ================= GET AKTIF =================
    async fetchPeriodeAktif(lang: lang) {
      const config = useRuntimeConfig()

      this.isLoading = true
      this.error = null

      try {
        const res = await $fetch<{ data: PeriodeResponse }>(
          `${config.public.apiBase}/api/${lang}/periode/aktif`
        )

        this.periodeAktif = res.data

      } catch (err: any) {
        this.error = err?.data?.errors || "Tidak ada periode aktif"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ================= CREATE =================
    async createPeriode(lang: lang, payload: CreatePeriodeRequest) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true
      this.error = null

      try {
        const formData = new FormData()
        formData.append("tahun_ajaran", payload.tahun_ajaran)
        formData.append("semester", payload.semester)
        formData.append("tanggal_mulai", payload.tanggal_mulai)
        formData.append("tanggal_selesai", payload.tanggal_selesai)
        formData.append("file_kalender", payload.file_kalender)

        const res = await $fetch<{ data: PeriodeResponse }>(
          `${config.public.apiBase}/api/${lang}/periode`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
            body: formData,
          }
        )

        return res.data

      } catch (err: any) {
        this.error = err?.data?.errors || "Gagal membuat periode"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ================= UPDATE =================
    async updatePeriode(
      lang: lang,
      periodeId: string,
      payload: UpdatePeriodeRequest
    ) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true
      this.error = null

      try {
        const formData = new FormData()
        formData.append("tanggal_mulai", payload.tanggal_mulai)
        formData.append("tanggal_selesai", payload.tanggal_selesai)

        if (payload.file_kalender) {
          formData.append("file_kalender", payload.file_kalender)
        }

        const res = await $fetch<{ data: PeriodeResponse }>(
          `${config.public.apiBase}/api/${lang}/periode/${periodeId}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
            body: formData,
          }
        )

        this.periode = res.data
        return res.data

      } catch (err: any) {
        this.error = err?.data?.errors || "Gagal update periode"
        throw err
      } finally {
        this.isLoading = false
      }
    },
    async nonaktifkan(lang: lang, periodeId: string) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true
      this.error = null

      try {
        await $fetch(
          `${config.public.apiBase}/api/${lang}/periode/${periodeId}/nonaktif`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        )

        this.periodeAktif = null

      } catch (err: any) {
        this.error = err?.data?.errors || "Gagal menonaktifkan periode"
        throw err
      } finally {
        this.isLoading = false
      }
    },
  },
})
