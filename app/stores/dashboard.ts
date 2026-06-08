import { defineStore } from "pinia"
import { useAuthStore } from "./auth"
import { useRuntimeConfig } from "#app"
import type { lang } from "#types/lang"

import type {
  UserDasborResponse,
  RoleDasborResponse,
  LingkupDasborResponse,
  ModulDasborResponse,
} from "#types/dasboard"

export const useDasborStore = defineStore("dasbor", {
  state: () => ({
    userDasbor: null as UserDasborResponse | null,
    roleDasbor: null as RoleDasborResponse | null,
    lingkupDasbor: null as LingkupDasborResponse | null,
    modulDasbor: null as ModulDasborResponse | null,

    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    // ================= USER DASHBOARD =================
    async fetchUserDasbor(lang: lang) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true
      this.error = null

      try {
        const res = await $fetch<{ data: UserDasborResponse }>(
          `${config.public.apiBase}/api/${lang}/dasbor/users`,
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        )

        this.userDasbor = res.data

      } catch (err: any) {
        this.error = err?.data?.message || "Gagal mengambil data dashboard user"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ================= ROLE DASHBOARD =================
    async fetchRoleDasbor(lang: lang) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true
      this.error = null

      try {
        const res = await $fetch<{ data: RoleDasborResponse }>(
          `${config.public.apiBase}/api/${lang}/dasbor/roles`,
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        )

        this.roleDasbor = res.data

      } catch (err: any) {
        this.error = err?.data?.message || "Gagal mengambil data dashboard role"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ================= LINGKUP DASHBOARD =================
    async fetchLingkupDasbor(lang: lang) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true
      this.error = null

      try {
        const res = await $fetch<{ data: LingkupDasborResponse }>(
          `${config.public.apiBase}/api/${lang}/dasbor/lingkup`,
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        )

        this.lingkupDasbor = res.data

      } catch (err: any) {
        this.error = err?.data?.message || "Gagal mengambil data dashboard lingkup"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ================= MODUL DASHBOARD =================
    async fetchModulDasbor(lang: lang) {
      const config = useRuntimeConfig()
      const auth = useAuthStore()

      this.isLoading = true
      this.error = null

      try {
        const res = await $fetch<{ data: ModulDasborResponse }>(
          `${config.public.apiBase}/api/${lang}/dasbor/modul`,
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        )

        this.modulDasbor = res.data

      } catch (err: any) {
        this.error = err?.data?.message || "Gagal mengambil data dashboard modul"
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ================= FETCH ALL =================
    async fetchAllDasbor(lang: lang) {
      try {
        await Promise.all([
          this.fetchUserDasbor(lang),
          this.fetchRoleDasbor(lang),
          this.fetchLingkupDasbor(lang),
          this.fetchModulDasbor(lang),
        ])
      } catch (err) {
        console.error("Gagal fetch dashboard", err)
      }
    },
  },
})
