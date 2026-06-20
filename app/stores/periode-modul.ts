import { defineStore } from "pinia";
import type { 
  PeriodeModulResponse, 
  AspekPeriodeModulResponse, 
  UnitLingkupPeriodeModulResponse, 
  CreatePeriodeModulRequest 
} from "#types/periode-model";
import { useRuntimeConfig, useNuxtApp } from "#imports";

export const usePeriodeModulStore = defineStore("periode-modul", {
  state: () => ({
    periodeModuls: [] as PeriodeModulResponse[],
    aspekPeriodeModuls: [] as AspekPeriodeModulResponse[],
    unitLingkupPeriodeModuls: [] as UnitLingkupPeriodeModulResponse[],
    
    // Pagination Metadata
    metaPeriodeModuls: null as any,
    metaAspek: null as any,
    metaUnitLingkup: null as any,

    // Loading states
    isLoading: false,
    isSubmitting: false,
    isFetchingAspek: false,
    isFetchingUnit: false,
    error: null as any,
  }),
  actions: {
    async fetchPeriodeModulByModul(modulId: string, query?: { page?: number; size?: number; order?: string; search?: string }) {
      this.isLoading = true;
      this.error = null;
      try {
        const config = useRuntimeConfig();
        const baseURL = (config.public.apiBaseUrl || 'http://localhost:3001') + '/api';
        const lang = (useNuxtApp().$i18n as any)?.locale?.value || "id";

        const response = await $fetch<{ data: PeriodeModulResponse[], meta: any }>(`/periode-modul/modul/${modulId}`, {
          baseURL,
          credentials: "include",
          query,
          headers: { "Accept-Language": lang, "Authorization": `Bearer ${useNuxtApp().$pinia.state.value.auth?.accessToken || ""}` },
        });

        this.periodeModuls = response.data || [];
        this.metaPeriodeModuls = response.meta || null;
        return response;
      } catch (err) {
        this.error = err;
        console.error("Failed to fetch Periode Modul:", err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAspek(periodeModulId: string, query?: { page?: number; size?: number; order?: string; search?: string }) {
      this.isFetchingAspek = true;
      this.error = null;
      try {
        const config = useRuntimeConfig();
        const baseURL = (config.public.apiBaseUrl || 'http://localhost:3001') + '/api';
        const lang = (useNuxtApp().$i18n as any)?.locale?.value || "id";

        const response = await $fetch<{ data: AspekPeriodeModulResponse[], meta: any }>(`/periode-modul/${periodeModulId}/aspek`, {
          baseURL,
          credentials: "include",
          query,
          headers: { "Accept-Language": lang, "Authorization": `Bearer ${useNuxtApp().$pinia.state.value.auth?.accessToken || ""}` },
        });

        this.aspekPeriodeModuls = response.data || [];
        this.metaAspek = response.meta || null;
        return response;
      } catch (err) {
        this.error = err;
        console.error("Failed to fetch Aspek Periode Modul:", err);
        throw err;
      } finally {
        this.isFetchingAspek = false;
      }
    },

    async fetchUnitLingkup(periodeModulId: string, query?: { page?: number; size?: number; order?: string; search?: string }) {
      this.isFetchingUnit = true;
      this.error = null;
      try {
        const config = useRuntimeConfig();
        const baseURL = (config.public.apiBaseUrl || 'http://localhost:3001') + '/api';
        const lang = (useNuxtApp().$i18n as any)?.locale?.value || "id";

        const response = await $fetch<{ data: UnitLingkupPeriodeModulResponse[], meta: any }>(`/periode-modul/${periodeModulId}/unit-lingkup`, {
          baseURL,
          credentials: "include",
          query,
          headers: { "Accept-Language": lang, "Authorization": `Bearer ${useNuxtApp().$pinia.state.value.auth?.accessToken || ""}` },
        });

        this.unitLingkupPeriodeModuls = response.data || [];
        this.metaUnitLingkup = response.meta || null;
        return response;
      } catch (err) {
        this.error = err;
        console.error("Failed to fetch Unit Lingkup Periode Modul:", err);
        throw err;
      } finally {
        this.isFetchingUnit = false;
      }
    },

    async bukaPeriodeModul(modulId: string, payload: CreatePeriodeModulRequest) {
      this.isSubmitting = true;
      this.error = null;
      try {
        const config = useRuntimeConfig();
        const baseURL = (config.public.apiBaseUrl || 'http://localhost:3001') + '/api';
        const lang = (useNuxtApp().$i18n as any)?.locale?.value || "id";

        const response = await $fetch<{ data: PeriodeModulResponse }>(`/modul/${modulId}/buka-periode`, {
          method: "POST",
          baseURL,
          credentials: "include",
          body: payload,
          headers: { "Accept-Language": lang, "Authorization": `Bearer ${useNuxtApp().$pinia.state.value.auth?.accessToken || ""}` },
        });

        return response.data;
      } catch (err) {
        this.error = err;
        console.error("Failed to buka Periode Modul:", err);
        throw err;
      } finally {
        this.isSubmitting = false;
      }
    },

    async batalkanPeriodeModul(periodeModulId: string) {
      this.isSubmitting = true;
      this.error = null;
      try {
        const config = useRuntimeConfig();
        const baseURL = (config.public.apiBaseUrl || 'http://localhost:3001') + '/api';
        const lang = (useNuxtApp().$i18n as any)?.locale?.value || "id";

        await $fetch(`/periode-modul/${periodeModulId}/batalkan`, {
          method: "PUT",
          baseURL,
          credentials: "include",
          headers: { "Accept-Language": lang, "Authorization": `Bearer ${useNuxtApp().$pinia.state.value.auth?.accessToken || ""}` },
        });

      } catch (err) {
        this.error = err;
        console.error("Failed to batalkan Periode Modul:", err);
        throw err;
      } finally {
        this.isSubmitting = false;
      }
    },

    async updateTahapan(periodeModulId: string) {
      this.isSubmitting = true;
      this.error = null;
      try {
        const config = useRuntimeConfig();
        const baseURL = (config.public.apiBaseUrl || 'http://localhost:3001') + '/api';
        const lang = (useNuxtApp().$i18n as any)?.locale?.value || "id";

        await $fetch(`/periode-modul/${periodeModulId}/update-tahapan`, {
          method: "PUT",
          baseURL,
          credentials: "include",
          headers: { "Accept-Language": lang, "Authorization": `Bearer ${useNuxtApp().$pinia.state.value.auth?.accessToken || ""}` },
        });

      } catch (err) {
        this.error = err;
        console.error("Failed to update tahapan Periode Modul:", err);
        throw err;
      } finally {
        this.isSubmitting = false;
      }
    },

    async checkIsAuditee(unitLingkupPeriodeModulId: string) {
      try {
        const config = useRuntimeConfig();
        const baseURL = (config.public.apiBaseUrl || 'http://localhost:3001') + '/api';
        const lang = (useNuxtApp().$i18n as any)?.locale?.value || "id";

        const response = await $fetch<{ data: { is_auditee: boolean } }>(`/periode-modul/unit-lingkup/${unitLingkupPeriodeModulId}/is-auditee`, {
          baseURL,
          credentials: "include",
          headers: { "Accept-Language": lang, "Authorization": `Bearer ${useNuxtApp().$pinia.state.value.auth?.accessToken || ""}` },
        });

        return response.data.is_auditee;
      } catch (err) {
        console.error("Failed to check Is Auditee:", err);
        return false;
      }
    },

    async checkIsEvaluator(unitLingkupPeriodeModulId: string) {
      try {
        const config = useRuntimeConfig();
        const baseURL = (config.public.apiBaseUrl || 'http://localhost:3001') + '/api';
        const lang = (useNuxtApp().$i18n as any)?.locale?.value || "id";

        const response = await $fetch<{ data: { is_evaluator: boolean } }>(`/periode-modul/unit-lingkup/${unitLingkupPeriodeModulId}/is-evaluator`, {
          baseURL,
          credentials: "include",
          headers: { "Accept-Language": lang, "Authorization": `Bearer ${useNuxtApp().$pinia.state.value.auth?.accessToken || ""}` },
        });

        return response.data.is_evaluator;
      } catch (err) {
        console.error("Failed to check Is Evaluator:", err);
        return false;
      }
    }
  }
});
