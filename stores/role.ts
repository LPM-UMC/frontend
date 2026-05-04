import { defineStore } from "pinia"
import { useAuthStore } from "./auth"
import { useRuntimeConfig } from "nuxt/app"

import type { RoleResponse, CreateRoleRequest, UpdateRoleRequest } from "#types/role"
import type { PagingResponse, PagingRequest } from "./page"
import type { lang } from "#types/lang"

export const useRoleStore = defineStore("role", {
  state: () => ({
    roles: [] as RoleResponse[],
    role: null as RoleResponse | null,
    meta: null as PagingRequest | null,

    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    // ================= GET ROLES =================
    async fetchRoles(
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

        const res = await $fetch<PagingResponse<RoleResponse>>(
          `${config.public.apiBase}/api/${lang}/roles?${query.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        )

        this.roles = res.data
        this.meta = res.meta

        return res

      } catch (err: any) {
        this.error = err?.data?.errors || "Gagal mengambil role"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ================= CREATE =================
    async createRole(lang: lang, payload: CreateRoleRequest) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true
      this.error = null

      try {
        const res = await $fetch<{ data: RoleResponse }>(
          `${config.public.apiBase}/api/${lang}/roles`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
            body: payload,
          }
        )

        // optional: push ke state
        this.roles.unshift(res.data)

        return res.data

      } catch (err: any) {
        this.error = err?.data?.errors || "Gagal membuat role"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ================= UPDATE =================
    async updateRole(
      lang: lang,
      roleId: string,
      payload: UpdateRoleRequest
    ) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true
      this.error = null

      try {
        const res = await $fetch<{ data: RoleResponse }>(
          `${config.public.apiBase}/api/${lang}/roles/${roleId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
            body: payload,
          }
        )

        // update state
        this.roles = this.roles.map((r) =>
          r.id === roleId ? res.data : r
        )

        return res.data

      } catch (err: any) {
        this.error = err?.data?.errors || "Gagal update role"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ================= DELETE =================
    async deleteRole(lang: lang, roleId: string) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true
      this.error = null

      try {
        await $fetch(
          `${config.public.apiBase}/api/${lang}/roles/${roleId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        )

        // remove dari state (optimistic)
        this.roles = this.roles.filter((r) => r.id !== roleId)

      } catch (err: any) {
        this.error = err?.data?.errors || "Gagal menghapus role"
        throw err
      } finally {
        this.isLoading = false
      }
    },
  },
})
