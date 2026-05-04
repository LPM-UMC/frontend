import { defineStore } from "pinia"
import { useAuthStore } from "./auth"
import { useRuntimeConfig } from "nuxt/app"
import type { lang } from "../types/lang"

import type {
  LingkupResponse,
  LingkupUnitResponse,
  CreateLingkupRequest,
  UpdateLingkupRequest,
  CreateLingkupUnitRequest,
  UpdateLingkupUnitRequest,
} from "#types/lingkup"

import type { PagingResponse } from "#types/page"

export const useLingkupStore = defineStore("lingkup", {
  state: () => ({
    lingkups: [] as LingkupResponse[],
    lingkup: null as LingkupResponse | null,

    units: [] as LingkupUnitResponse[],
    unit: null as LingkupUnitResponse | null,

    meta: null as any,

    isLoading: false,
    error: null as string | null,
  }),

  // ================= ACTIONS =================
  actions: {
    // ===== GET LINGKUP =====
    async fetchLingkups(
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

        const res = await $fetch<PagingResponse<LingkupResponse>>(
          `${config.public.apiBase}/api/${lang}/lingkup?${query.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        )

        this.lingkups = res.data
        this.meta = res.meta

      } catch (err: any) {
        this.error = err?.data?.message || "Gagal mengambil data lingkup"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ===== GET DETAIL LINGKUP =====
    async fetchLingkupById(lang: lang, lingkupId: string) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true
      this.error = null

      try {
        const res = await $fetch<{ data: LingkupResponse }>(
          `${config.public.apiBase}/api/${lang}/lingkup/${lingkupId}`,
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        )

        this.lingkup = res.data

      } catch (err: any) {
        this.error = err?.data?.message || "Lingkup tidak ditemukan"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ===== CREATE LINGKUP =====
    async createLingkup(lang: lang, payload: CreateLingkupRequest) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true
      this.error = null

      try {
        const res = await $fetch<{ data: LingkupResponse }>(
          `${config.public.apiBase}/api/${lang}/lingkup`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
            body: payload,
          }
        )

        return res.data

      } catch (err: any) {
        this.error = err?.data?.message || "Gagal membuat lingkup"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ===== UPDATE LINGKUP =====
    async updateLingkup(
      lang: lang,
      lingkupId: string,
      payload: UpdateLingkupRequest
    ) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true

      try {
        const res = await $fetch<{ data: LingkupResponse }>(
          `${config.public.apiBase}/api/${lang}/lingkup/${lingkupId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
            body: payload,
          }
        )

        return res.data

      } catch (err: any) {
        this.error = err?.data?.message || "Gagal update lingkup"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ===== DELETE LINGKUP =====
    async deleteLingkup(lang: lang, lingkupId: string) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true

      try {
        await $fetch(
          `${config.public.apiBase}/api/${lang}/lingkup/${lingkupId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        )

        this.lingkups = this.lingkups.filter((l) => l.id !== lingkupId)

      } catch (err: any) {
        this.error = err?.data?.message || "Gagal menghapus lingkup"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // =========================
    // UNIT LINGKUP
    // =========================

    // ===== GET UNIT =====
    async fetchUnits(
      lang: lang,
      lingkupId: string,
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

        const res = await $fetch<PagingResponse<LingkupUnitResponse>>(
          `${config.public.apiBase}/api/${lang}/lingkup/${lingkupId}/unit?${query.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        )

        this.units = res.data
        this.meta = res.meta

      } catch (err: any) {
        this.error = err?.data?.message || "Gagal mengambil unit lingkup"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ===== GET DETAIL UNIT =====
    async fetchUnitById(lang: lang, unitId: string) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true
      this.error = null

      try {
        const res = await $fetch<{ data: LingkupUnitResponse }>(
          `${config.public.apiBase}/api/${lang}/unit-lingkup/${unitId}`,
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        )

        this.unit = res.data

      } catch (err: any) {
        this.error = err?.data?.message || "Unit lingkup tidak ditemukan"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ===== CREATE UNIT =====
    async createUnit(
      lang: lang,
      lingkupId: string,
      payload: CreateLingkupUnitRequest
    ) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true
      this.error = null

      try {
        const res = await $fetch<{ data: LingkupUnitResponse }>(
          `${config.public.apiBase}/api/${lang}/lingkup/${lingkupId}/unit`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
            body: payload,
          }
        )

        return res.data

      } catch (err: any) {
        this.error = err?.data?.message || "Gagal membuat unit"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ===== UPDATE UNIT =====
    async updateUnit(
      lang: lang,
      unitId: string,
      payload: UpdateLingkupUnitRequest
    ) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true

      try {
        const res = await $fetch<{ data: LingkupUnitResponse }>(
          `${config.public.apiBase}/api/${lang}/unit-lingkup/${unitId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
            body: payload,
          }
        )

        return res.data

      } catch (err: any) {
        this.error = err?.data?.message || "Gagal update unit"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ===== DELETE UNIT =====
    async deleteUnit(lang: lang, unitId: string) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true

      try {
        await $fetch(
          `${config.public.apiBase}/api/${lang}/unit-lingkup/${unitId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        )

        this.units = this.units.filter((u) => u.id !== unitId)

      } catch (err: any) {
        this.error = err?.data?.message || "Gagal menghapus unit"
        throw err
      } finally {
        this.isLoading = false
      }
    },
  },
})
