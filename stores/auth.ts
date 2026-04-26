import axios from "axios";
import type { AxiosInstance } from "axios";
import { StatusCodes } from "http-status-codes";
import { defineStore } from "pinia";
import type { User } from "../types/user";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    isLoading: false,
    status: null as number | null,
    error: null as string | null,

    token: null as string | null,
    type: null as string | null,
    user: null as User | null,
  }),
  persist: {
    storage: sessionStorage
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    setup(): void {
      this.isLoading = true;
      this.status = null;
      this.error = null;
    },
    clearState(): void {
      this.token = null;
      this.type = null;
      this.user = null;
    },
    setUser(user: User): void {
      this.user = user;
    },
    async login() {
      const config = useRuntimeConfig();
      this.setup();

      window.location.href = config.public.apiBase + "/auth/google";
    },
    async refresh(): Promise<boolean> {
      const { $axios } = useNuxtApp() as unknown as { $axios: AxiosInstance };

      this.setup();

      try {
        const response = await $axios.get("/auth/refresh");

        const data = response.data.data;

        this.status = response.status;
        this.token = data.token;
        this.type = data.type;

        return true;

      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.status = error.response?.status || StatusCodes.INTERNAL_SERVER_ERROR;
          this.error = error.response?.data?.errors || "Internal server error. Coba lagi nanti";
          this.clearState();
          return false;

        } else {
          this.status = StatusCodes.INTERNAL_SERVER_ERROR;
          this.error = "Internal server error. Coba lagi nanti";
          this.clearState();
          return false;

        }

      } finally {
        this.isLoading = false;
      }
    },
    async getCurrentUser() {
      const { $axios } = useNuxtApp() as unknown as { $axios: AxiosInstance };
      this.setup();

      try {
        const response = await $axios.get(`/en/auth/me`, {
          headers: {
            Authorization: `${this.type} ${this.token}`,
          }
        });

        const data = response.data.data;

        this.status = response.status;
        this.user = data;

      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.status = error.response?.status || StatusCodes.INTERNAL_SERVER_ERROR;
          this.error = error.response?.data?.errors || "Internal server error. Coba lagi nanti";
          this.clearState();

        } else {
          this.status = StatusCodes.INTERNAL_SERVER_ERROR;
          this.error = "Internal server error. Coba lagi nanti";
          this.clearState();

        }

      } finally {
        this.isLoading = false;

      }
    },
    async logout() {
      const { $axios } = useNuxtApp() as unknown as { $axios: AxiosInstance };

      this.setup();

      try {
        const response = await $axios.post("/auth/logout", {}, {
          headers: {
            Authorization: `${this.type} ${this.token}`,
          },
        });

        this.status = response.status;

      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.status = error.response?.status || StatusCodes.INTERNAL_SERVER_ERROR;
          this.error = error.response?.data?.errors || "Internal server error. Coba lagi nanti";

        } else {
          this.status = StatusCodes.INTERNAL_SERVER_ERROR;
          this.error = "Internal server error. Coba lagi nanti";

        }

      } finally {
        this.clearState();
        this.isLoading = false;
      }
    },
  },
});
