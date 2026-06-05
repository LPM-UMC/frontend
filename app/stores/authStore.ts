import { defineStore } from "pinia";
import type { UserResponse } from "#types/user";
import type { RoleResponse } from "#types/role";

interface AuthState {
  token: string | null;
  tokenExpiresAt: number | null;
  refreshTimer: ReturnType<typeof setTimeout> | null;

  user: UserResponse | null;
  activeRole: RoleResponse | null;

  initialized: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: null,
    tokenExpiresAt: null,
    refreshTimer: null,

    user: null,
    activeRole: null,

    initialized: false,
  }),

  getters: {
    isAuthenticated: (state): boolean => {
      return !!state.token;
    },

    currentRole: (state): RoleResponse | null => {
      return state.activeRole;
    },

    roleNames: (state): string[] => {
      return state.user?.roles.map((role) => role.nama) ?? [];
    },

    isAdmin: (state): boolean => {
      return state.activeRole?.nama === "Admin";
    },
  },

  actions: {
    scheduleRefresh(expiresIn: number) {
      if (import.meta.server) {
        return;
      }

      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer);
      }

      /**
       * Refresh 60 detik sebelum expired.
       * Jika token kurang dari 60 detik,
       * minimal refresh setelah 30 detik.
       */
      const timeout = Math.max(expiresIn - 60, 30) * 1000;

      this.tokenExpiresAt = Date.now() + expiresIn * 1000;

      this.refreshTimer = setTimeout(async () => {
        try {
          await this.refreshToken();
        } catch {
          await this.logout();
        }
      }, timeout);
    },

    setDefaultRole() {
      if (!this.user?.roles.length) {
        this.activeRole = null;
        return;
      }

      if (
        this.activeRole &&
        this.user.roles.some((role) => role.id === this.activeRole?.id)
      ) {
        return;
      }

      this.activeRole = this.user.roles[0];
    },

    selectRole(roleId: string) {
      if (!this.user) {
        return;
      }

      const role = this.user.roles.find((role) => role.id === roleId);

      if (role) {
        this.activeRole = role;
      }
    },

    async login(payload: { email: string; password: string }) {
      const config = useRuntimeConfig();

      const response = await $fetch<{
        data: {
          token: string;
          type: string;
          expires_in: number;
        };
      }>("/auth/login", {
        baseURL: config.public.apiBase as string,
        method: "POST",
        credentials: "include",
        body: payload,
      });

      this.token = response.data.token;

      this.scheduleRefresh(response.data.expires_in);

      await this.fetchMe();

      return response;
    },

    async refreshToken() {
      const config = useRuntimeConfig();

      const response = await $fetch<{
        data: {
          token: string;
          type: string;
          expires_in: number;
        };
      }>("/auth/refresh", {
        baseURL: config.public.apiBase,
        method: "GET",
        credentials: "include",
      });

      this.token = response.data.token;

      this.scheduleRefresh(response.data.expires_in);

      return response.data.token;
    },

    async fetchMe() {
      if (!this.token) {
        return null;
      }

      const config = useRuntimeConfig();
      const { locale } = useI18n();

      const response = await $fetch<{
        data: UserResponse;
      }>("/auth/me", {
        baseURL: config.public.apiBase as string,
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Accept-Language": locale.value,
        },
      });

      this.user = response.data;

      this.setDefaultRole();

      return response.data;
    },

    async initAuth() {
      if (this.initialized) {
        return;
      }

      try {
        await this.refreshToken();
        await this.fetchMe();
      } catch {
        this.token = null;
        this.user = null;
        this.activeRole = null;
      } finally {
        this.initialized = true;
      }
    },

    async logout() {
      const config = useRuntimeConfig();

      try {
        if (this.token) {
          const { locale } = useI18n();

          await $fetch("/auth/logout", {
            baseURL: config.public.apiBase as string,
            method: "POST",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${this.token}`,
              "Accept-Language": locale.value,
            },
          });
        }
      } catch {
        //
      } finally {
        if (this.refreshTimer) {
          clearTimeout(this.refreshTimer);
        }

        this.token = null;
        this.tokenExpiresAt = null;
        this.refreshTimer = null;

        this.user = null;
        this.activeRole = null;
      }
    },

    clearAuth() {
      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer);
      }

      this.token = null;
      this.tokenExpiresAt = null;
      this.refreshTimer = null;

      this.user = null;
      this.activeRole = null;
    },
  },
});
