import { defineStore } from "pinia"
import { useAuthStore } from "./auth"
import { useRuntimeConfig } from "nuxt/app"

import type { lang } from "#types/lang"
import type {
  ObjekResponse,
  CreateObjekRequest,
  UpdateObjekRequest,
} from "#types/objek"

import type { PagingResponse, PagingRequest } from "./page"

export const useObjekStore = defineStore("objek", {
  state: () => ({
    objeks: [] as ObjekResponse[],
    objek: null as ObjekResponse | null,
    meta: null as PagingRequest | null,

    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    // ================= GET LIST OBJEK =================
    async fetchObjeks(
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

        const res = await $fetch<PagingResponse<ObjekResponse>>(
          `${config.public.apiBase}/api/${lang}/lingkup/${lingkupId}/objek?${query.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        )

        this.objeks = res.data
        this.meta = res.meta

        return res

      } catch (err: any) {
        this.error = err?.data?.message || "Gagal mengambil objek"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ================= GET DETAIL =================
    async fetchObjekById(lang: lang, objekId: string) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true
      this.error = null

      try {
        const res = await $fetch<{ data: ObjekResponse }>(
          `${config.public.apiBase}/api/${lang}/objek/${objekId}`,
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        )

        this.objek = res.data

        return res.data

      } catch (err: any) {
        this.error = err?.data?.message || "Gagal mengambil detail objek"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ================= CREATE =================
    async createObjek(
      lang: lang,
      lingkupId: string,
      payload: CreateObjekRequest
    ) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true
      this.error = null

      try {
        const res = await $fetch<{ data: ObjekResponse }>(
          `${config.public.apiBase}/api/${lang}/lingkup/${lingkupId}/objek`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
            body: payload,
          }
        )

        // optional: langsung push ke list
        this.objeks.unshift(res.data)

        return res.data

      } catch (err: any) {
        this.error = err?.data?.message || "Gagal membuat objek"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ================= UPDATE =================
    async updateObjek(
      lang: lang,
      objekId: string,
      payload: UpdateObjekRequest
    ) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true
      this.error = null

      try {
        const res = await $fetch<{ data: ObjekResponse }>(
          `${config.public.apiBase}/api/${lang}/objek/${objekId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
            body: payload,
          }
        )

        // update list
        this.objeks = this.objeks.map((o) =>
          o.id === objekId ? res.data : o
        )

        // update detail
        if (this.objek?.id === objekId) {
          this.objek = res.data
        }

        return res.data

      } catch (err: any) {
        this.error = err?.data?.message || "Gagal update objek"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ================= DELETE =================
    async deleteObjek(lang: lang, objekId: string) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true
      this.error = null

      try {
        await $fetch(
          `${config.public.apiBase}/api/${lang}/objek/${objekId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        )

        // remove dari state
        this.objeks = this.objeks.filter((o) => o.id !== objekId)

      } catch (err: any) {
        this.error = err?.data?.message || "Gagal menghapus objek"
        throw err
      } finally {
        this.isLoading = false
      }
    },
  },
})
