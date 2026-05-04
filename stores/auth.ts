import { defineStore } from "pinia"
import type { lang } from "../types/lang"
import type { UserResponse } from "../types/user"
import type { RoleResponse } from "../types/role"
import { useRuntimeConfig, navigateTo } from "nuxt/app"
import type { AccessTokenResponse } from "../types/auth"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isInitialized: false as boolean,

    accessToken: null as string | null,
    expiresIn: null as number | null,
    refreshTimeout: null as ReturnType<typeof setTimeout> | null,
    refreshPromise: null as Promise<void> | null,

    user: null as UserResponse | null,
    roles: [] as RoleResponse[],
    activeRole: null as RoleResponse | null,

    isLoading: false as boolean,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated: (state): boolean =>
      !!state.accessToken && !!state.user,
  },

  actions: {
    loginWithGoogle() {
      const config = useRuntimeConfig()

      return navigateTo(
        `${config.public.apiBase}/api/auth/google`,
        { external: true }
      )
    },

    clearAuth() {
      this.accessToken = null
      this.user = null
      this.roles = []
      this.activeRole = null
      this.expiresIn = null

      if (this.refreshTimeout) {
        clearTimeout(this.refreshTimeout)
        this.refreshTimeout = null
      }

      this.refreshPromise = null
    },

    scheduleTokenRefresh() {
      if (!this.expiresIn || !import.meta.client) return

      if (this.refreshTimeout) {
        clearTimeout(this.refreshTimeout)
      }

      const buffer = 20
      const safeExpires = Math.max(this.expiresIn - buffer, 1)
      const refreshTime = safeExpires * 1000

      this.refreshTimeout = setTimeout(async () => {
        await this.refreshToken()
      }, refreshTime)
    },

    async refreshToken() {
      if (this.refreshPromise) return this.refreshPromise

      this.refreshPromise = (async () => {
        try {
          const config = useRuntimeConfig()

          const res = await $fetch<{ data: AccessTokenResponse }>(
            `${config.public.apiBase}/api/auth/refresh`,
            { credentials: "include" }
          )

          this.accessToken = res.data.token
          this.expiresIn = res.data.expires_in

          this.scheduleTokenRefresh()

        } catch {
          this.clearAuth()

        } finally {
          this.refreshPromise = null

        }
      })()

      return this.refreshPromise
    },

    async fetchMe(lang: lang = "id") {
      if (!this.accessToken) throw new Error("NO_TOKEN")

      try {
        const config = useRuntimeConfig()

        const res = await $fetch<{ data: UserResponse }>(
          `${config.public.apiBase}/api/${lang}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          }
        )

        this.user = res.data
        this.roles = res.data.roles || []
        this.activeRole = this.roles[0] || null
      } catch {
        this.clearAuth()
      }
    },

    async initAuth() {
      if (this.isInitialized) return

      this.isLoading = true

      try {
        await this.refreshToken()

        if (this.accessToken) {
          await this.fetchMe()
        }
      } finally {
        this.isLoading = false
        this.isInitialized = true
      }
    },

    setActiveRole(role: RoleResponse) {
      this.activeRole = role
    },

    async logout() {
      try {
        const config = useRuntimeConfig()

        if (this.accessToken) {
          await $fetch(`${config.public.apiBase}/api/auth/logout`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
            credentials: "include",
          })
        }
      } catch {
        // ignore error
      } finally {
        this.clearAuth()
        this.isInitialized = false

        await navigateTo("/")
      }
    },

  },
})
