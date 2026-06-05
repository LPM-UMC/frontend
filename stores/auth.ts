import { defineStore } from "pinia"
import type { lang } from "../types/lang"
import type { UserResponse } from "../types/user"
import type { RoleResponse } from "../types/role"
import { useRuntimeConfig, navigateTo, useCookie } from "nuxt/app"
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
      const apiBase = config.public.apiBase.replace(/\/api\/?$/, "")
      return navigateTo(
        `${apiBase}/api/auth/google`,
        { external: true }
      )
    },

    clearAuth() {
      this.accessToken = null
      this.user = null
      this.roles = []
      this.activeRole = null
      this.expiresIn = null

      const activeRoleIdCookie = useCookie<string | null>("active_role_id")
      activeRoleIdCookie.value = null

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
          const apiBase = config.public.apiBase.replace(/\/api\/?$/, "")

          const res = await $fetch<{ data: AccessTokenResponse }>(
            `${apiBase}/api/auth/refresh`,
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
        const apiBase = config.public.apiBase.replace(/\/api\/?$/, "")

        const res = await $fetch<{ data: UserResponse }>(
          `${apiBase}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
              "Accept-Language": lang,
            },
          }
        )

        this.user = res.data
        this.roles = res.data.roles || []

        const activeRoleIdCookie = useCookie<string | null>("active_role_id")
        const savedRole = this.roles.find((r) => r.id === activeRoleIdCookie.value)

        if (savedRole) {
          this.activeRole = savedRole
        } else {
          this.activeRole = this.roles[0] || null
          if (this.activeRole) {
            activeRoleIdCookie.value = this.activeRole.id
          }
        }
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
      const activeRoleIdCookie = useCookie<string | null>("active_role_id")
      activeRoleIdCookie.value = role.id
    },

    async logout() {
      try {
        const config = useRuntimeConfig()
        const apiBase = config.public.apiBase.replace(/\/api\/?$/, "")

        if (this.accessToken) {
          await $fetch(`${apiBase}/api/auth/logout`, {
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
