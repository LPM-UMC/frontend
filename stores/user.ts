import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import type { lang } from "../types/lang";
import type { UserResponse } from "../types/user";
import { navigateTo, useRuntimeConfig } from "nuxt/app";
import type { PagingResponse, PagingRequest } from "../types/page";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as UserResponse | null,
    users: [] as UserResponse[],
    meta: null as PagingRequest | null,

    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchUsers(
      lang: lang,
      params?: {
        page?: number;
        size?: number;
        search?: string;
        order?: "asc" | "desc";
        roleId?: string;
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
        if (params?.roleId) query.append("roleId", params.roleId)

        const res = await $fetch<PagingResponse<UserResponse>>(
          `${config.public.apiBase}/api/${lang}/users?${query.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        )

        this.users = res.data
        this.meta = res.meta

      } catch (err) {
        this.error = err?.data?.message || "Gagal mengambil data user";

      } finally {
        this.isLoading = false

      }
    },

    async fetchUserById(lang: lang, userId: string) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true
      this.error = null

      try {
        const res = await $fetch<{ data: UserResponse }>(
          `${config.public.apiBase}/api/${lang}/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        )

        this.user = res.data

      } catch (err) {
        this.error = err?.data?.errors || "User tidak ditemukan"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ===== CREATE =====
    async createUser(
      lang: lang,
      payload: {
        nidn: string
        nama: string
        email: string
        role_ids: string[]
      }
    ) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true
      this.error = null

      try {
        const res = await $fetch<{ data: UserResponse }>(
          `${config.public.apiBase}/api/${lang}/users`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
            body: payload,
          }
        )

        return res.data

      } catch (err) {
        this.error = err?.data?.errors || "Gagal membuat user"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ===== UPDATE USER (ADMIN) =====
    async updateUser(
      lang: lang,
      userId: string,
      payload: {
        email: string
        role_ids: string[]
      }
    ) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true

      try {
        const res = await $fetch<{ data: UserResponse }>(
          `${config.public.apiBase}/api/${lang}/users/${userId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
            body: payload,
          }
        )

        return res.data

      } catch (err) {
        this.error = err?.data?.errors || "Gagal update user"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ===== UPDATE PROFILE =====
    async updateProfile(
      lang: lang,
      payload: {
        nama: string
        email: string
        instagram: string
        linkedin: string
      }
    ) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true

      try {
        const res = await $fetch<{ data: UserResponse }>(
          `${config.public.apiBase}/api/${lang}/users/profile`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
            body: payload,
          }
        )

        this.user = res.data
        return res.data

      } catch (err) {
        this.error = err?.data?.message || "Gagal update profile"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ===== UPDATE PROFILE IMAGE =====
    async updateProfileImage(lang: lang, file: File) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true

      try {
        const formData = new FormData()
        formData.append("picture", file)

        const res = await $fetch<{ data: UserResponse }>(
          `${config.public.apiBase}/api/${lang}/users/profile/picture`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
            body: formData,
          }
        )

        this.user = res.data
        return res.data

      } catch (err) {
        this.error = err?.data?.message || "Gagal upload gambar"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ===== DELETE =====
    async deleteUser(lang: lang, userId: string) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true

      try {
        await $fetch(
          `${config.public.apiBase}/api/${lang}/users/${userId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        )

        // remove dari state (optimistic update)
        this.users = this.users.filter((u) => u.id !== userId)

        // redirect jika sedang melihat detail user yang dihapus
        return await navigateTo(`/${lang}/dashboard/manajemen-user`)

      } catch (err) {
        this.error = err?.data?.errors || "Gagal menghapus user"
        throw err
      } finally {
        this.isLoading = false
      }
    },
  },
})
