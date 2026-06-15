import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { useRuntimeConfig, useNuxtApp } from "nuxt/app";

import type {
  TeamDasborResponse,
  UserDaborResponse,
  RoleDaborResponse,
  LingkupDasborResponse,
  ModulDasborResponse,
} from "#types/dasbor";

export const useDasborStore = defineStore("dasbor", {
  state: () => ({
    teamDasbor: null as TeamDasborResponse | null,
    userDasbor: null as UserDaborResponse | null,
    roleDasbor: null as RoleDaborResponse | null,
    lingkupDasbor: null as LingkupDasborResponse | null,
    modulDasbor: null as ModulDasborResponse | null,

    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    // ================= TEAM DASHBOARD =================
    async fetchTeams() {
      const config = useRuntimeConfig();
      const auth = useAuthStore();
      const nuxtApp = useNuxtApp();
      const lang = (nuxtApp.$i18n as any)?.locale?.value || "id";

      this.isLoading = true;
      this.error = null;

      try {
        const res = await $fetch<{ data: TeamDasborResponse }>(
          `/api/dasbor/teams`,
          {
            baseURL: config.public.apiBaseUrl || 'http://localhost:3001',
            headers: {
              "Accept-Language": lang,
              ...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
            },
          }
        );

        this.teamDasbor = res.data;
        return res.data;
      } catch (err: any) {
        this.error = err?.data?.errors || err?.data?.message || "Gagal mengambil data teams dashboard";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    // ================= USER DASHBOARD =================
    async fetchUserDasbor() {
      const config = useRuntimeConfig();
      const auth = useAuthStore();
      const nuxtApp = useNuxtApp();
      const lang = (nuxtApp.$i18n as any)?.locale?.value || "id";

      this.isLoading = true;
      this.error = null;

      try {
        const res = await $fetch<{ data: UserDaborResponse }>(
          `/api/dasbor/users`,
          {
            baseURL: config.public.apiBaseUrl || 'http://localhost:3001',
            headers: {
              "Accept-Language": lang,
              ...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
            },
          }
        );

        this.userDasbor = res.data;
        return res.data;
      } catch (err: any) {
        this.error = err?.data?.errors || err?.data?.message || "Gagal mengambil data dashboard user";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    // ================= ROLE DASHBOARD =================
    async fetchRoleDasbor() {
      const config = useRuntimeConfig();
      const auth = useAuthStore();
      const nuxtApp = useNuxtApp();
      const lang = (nuxtApp.$i18n as any)?.locale?.value || "id";

      this.isLoading = true;
      this.error = null;

      try {
        const res = await $fetch<{ data: RoleDaborResponse }>(
          `/api/dasbor/roles`,
          {
            baseURL: config.public.apiBaseUrl || 'http://localhost:3001',
            headers: {
              "Accept-Language": lang,
              ...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
            },
          }
        );

        this.roleDasbor = res.data;
        return res.data;
      } catch (err: any) {
        this.error = err?.data?.errors || err?.data?.message || "Gagal mengambil data dashboard role";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    // ================= LINGKUP DASHBOARD =================
    async fetchLingkupDasbor() {
      const config = useRuntimeConfig();
      const auth = useAuthStore();
      const nuxtApp = useNuxtApp();
      const lang = (nuxtApp.$i18n as any)?.locale?.value || "id";

      this.isLoading = true;
      this.error = null;

      try {
        const res = await $fetch<{ data: LingkupDasborResponse }>(
          `/api/dasbor/lingkup`,
          {
            baseURL: config.public.apiBaseUrl || 'http://localhost:3001',
            headers: {
              "Accept-Language": lang,
              ...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
            },
          }
        );

        this.lingkupDasbor = res.data;
        return res.data;
      } catch (err: any) {
        this.error = err?.data?.errors || err?.data?.message || "Gagal mengambil data dashboard lingkup";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    // ================= MODUL DASHBOARD =================
    async fetchModulDasbor() {
      const config = useRuntimeConfig();
      const auth = useAuthStore();
      const nuxtApp = useNuxtApp();
      const lang = (nuxtApp.$i18n as any)?.locale?.value || "id";

      this.isLoading = true;
      this.error = null;

      try {
        const res = await $fetch<{ data: ModulDasborResponse }>(
          `/api/dasbor/modul`,
          {
            baseURL: config.public.apiBaseUrl || 'http://localhost:3001',
            headers: {
              "Accept-Language": lang,
              ...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
            },
          }
        );

        this.modulDasbor = res.data;
        return res.data;
      } catch (err: any) {
        this.error = err?.data?.errors || err?.data?.message || "Gagal mengambil data dashboard modul";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    // ================= FETCH ALL =================
    async fetchAllDasbor() {
      try {
        await Promise.all([
          this.fetchTeams(),
          this.fetchUserDasbor(),
          this.fetchRoleDasbor(),
          this.fetchLingkupDasbor(),
          this.fetchModulDasbor(),
        ]);
      } catch (err) {
        console.error("Gagal fetch semua dashboard", err);
      }
    },
  },
});
