import { defineStore } from "pinia";
import type { UserResponse } from "#types/user";
import type { RoleResponse } from "#types/role";

interface AuthState {
  user: UserResponse | null;
  accessToken: string | null;
  activeRole: RoleResponse | null;
  tokenExpiredAt: number | null;
  refreshTimeoutId: any | null;
  initialized: boolean;
}

let refreshPromise: Promise<string> | null = null;

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    activeRole: null,
    tokenExpiredAt: null,
    refreshTimeoutId: null,
    initialized: false,
  }),

  getters: {
    roles: (state): RoleResponse[] => state.user?.roles ?? [],
    currentRole: (state) => state.activeRole,
    isAuthenticated: (state) => !!state.accessToken,
  },

  actions: {
    async login(payload: { email: string; password: string; rememberMe?: boolean }) {
      const config = useRuntimeConfig();
      const baseURL = ((config.public.apiBaseUrl as string) || (config.public.apiBaseUrl as string) || 'http://localhost:3001').replace(/\/api\/?$/, '');

      const response = await $fetch<{
        data: {
          token: string;
          type: string;
          expires_in: number;
        };
      }>("/api/auth/login", {
        baseURL,
        method: "POST",
        credentials: "include",
        body: payload,
      });

      this.accessToken = response.data.token;
      this.tokenExpiredAt = Date.now() + response.data.expires_in * 1000;

      this.scheduleRefresh(response.data.expires_in);
      await this.fetchMe();
      this.initialized = true;

      return response;
    },

    loginGoogle() {
      if (import.meta.server) return;
      const config = useRuntimeConfig();
      const baseURL = (config.public.apiBaseUrl as string) || (config.public.apiBaseUrl as string) || 'http://localhost:3001';
      window.location.href = `${baseURL}/api/auth/google`;
    },

    async logout() {
      const config = useRuntimeConfig();
      const baseURL = ((config.public.apiBaseUrl as string) || (config.public.apiBaseUrl as string) || 'http://localhost:3001').replace(/\/api\/?$/, '');

      try {
        if (this.accessToken) {
          await $fetch("/api/auth/logout", {
            baseURL,
            method: "POST",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          });
        }
      } catch (error) {
        console.error("Logout failed on backend:", error);
      } finally {
        this.clearAuth();
        navigateTo("/login");
      }
    },

    async refreshAccessToken() {
      if (refreshPromise) return refreshPromise;

      refreshPromise = (async () => {
        try {
          const config = useRuntimeConfig();
          const baseURL = ((config.public.apiBaseUrl as string) || (config.public.apiBaseUrl as string) || 'http://localhost:3001').replace(/\/api\/?$/, '');

          const response = await $fetch<{
            data: {
              token: string;
              type: string;
              expires_in: number;
            };
          }>("/api/auth/refresh", {
            baseURL,
            method: "GET",
            credentials: "include",
          });

          this.accessToken = response.data.token;
          this.tokenExpiredAt = Date.now() + response.data.expires_in * 1000;

          this.scheduleRefresh(response.data.expires_in);
          return response.data.token;
        } finally {
          refreshPromise = null;
        }
      })();

      return refreshPromise;
    },

    async fetchMe() {
      const config = useRuntimeConfig();
      const baseURL = ((config.public.apiBaseUrl as string) || (config.public.apiBaseUrl as string) || 'http://localhost:3001').replace(/\/api\/?$/, '');

      if (!this.accessToken) return null;

      const response = await $fetch<{
        data: UserResponse;
      }>("/api/auth/me", {
        baseURL,
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      this.user = response.data;

      // Restore active role from localStorage or default to first role
      const savedRoleId = localStorage.getItem("active_role_id");
      const userRoles = this.user?.roles ?? [];
      const matchedRole = userRoles.find(r => r.id === savedRoleId);

      if (matchedRole) {
        this.activeRole = matchedRole || null;
      } else if (userRoles.length > 0 && userRoles[0]) {
        this.activeRole = userRoles[0];
        localStorage.setItem("active_role_id", this.activeRole.id);
      } else {
        this.activeRole = null;
      }

      return response.data;
    },

    scheduleRefresh(expiresIn: number) {
      if (import.meta.server) return;

      if (this.refreshTimeoutId) {
        clearTimeout(this.refreshTimeoutId);
      }

      // Refresh 60 seconds before expiry, or at least 30 seconds
      const timeout = Math.max(expiresIn - 60, 30) * 1000;

      this.refreshTimeoutId = setTimeout(async () => {
        try {
          await this.refreshAccessToken();
          await this.fetchMe();
        } catch (error) {
          console.error("Auto refresh failed:", error);
          await this.logout();
        }
      }, timeout);
    },

    async initializeAuth() {
      if (this.initialized) return;

      const loggedInCookie = useCookie("auth_logged_in");
      if (!loggedInCookie.value) {
        this.initialized = true;
        return;
      }

      try {
        await this.refreshAccessToken();
        await this.fetchMe();
      } catch (error) {
        this.clearAuth();
      } finally {
        this.initialized = true;
      }
    },

    async initAuth() {
      return this.initializeAuth();
    },

    clearAuth() {
      if (this.refreshTimeoutId) {
        clearTimeout(this.refreshTimeoutId);
      }

      this.user = null;
      this.accessToken = null;
      this.activeRole = null;
      this.tokenExpiredAt = null;
      this.refreshTimeoutId = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("active_role_id");
        // Clear cookies using Nuxt's useCookie helper
        const loggedInCookie = useCookie("auth_logged_in");
        loggedInCookie.value = null;
        const refreshTokenCookie = useCookie("refresh_token");
        refreshTokenCookie.value = null;
      }
    },

    setActiveRole(role: RoleResponse | null) {
      this.activeRole = role;
      if (role) {
        localStorage.setItem("active_role_id", role.id);
      } else {
        localStorage.removeItem("active_role_id");
      }
    },
  },
});
