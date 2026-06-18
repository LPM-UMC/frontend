import { defineStore } from "pinia";
import type { FMInformationResponse } from "#types/fm1";
import type { ScoreResponse, AspectScoreResponse } from "#types/fm02-hasil-evaluasi";
import { useRuntimeConfig, useNuxtApp } from "#imports";

export const useFm2Store = defineStore("fm2", {
  state: () => ({
    informasi: null as FMInformationResponse | null,
    skorMonitoring: null as ScoreResponse | null,
    skorAspeks: [] as AspectScoreResponse[],
    isAuditee: null as boolean | null,

    isLoadingInfo: false,
    isLoadingMonitoring: false,
    isLoadingAspeks: false,
    isCalculating: false,
    error: null as any,
  }),
  actions: {
    async fetchInformasi(pId: string, uId: string) {
      this.isLoadingInfo = true;
      this.error = null;
      try {
        const config = useRuntimeConfig();
        const baseURL = (config.public.apiBaseUrl || 'http://localhost:3001') + '/api';
        const lang = (useNuxtApp().$i18n as any)?.locale?.value || "id";

        const response = await $fetch<{ data: FMInformationResponse }>(`/fm2/periode-modul/${pId}/unit-lingkup-periode-modul/${uId}/informasi`, {
          baseURL,
          credentials: "include",
          headers: { "Accept-Language": lang, "Authorization": `Bearer ${useNuxtApp().$pinia.state.value.auth?.accessToken || ""}` },
        });

        this.informasi = response.data;
      } catch (err) {
        this.error = err;
        console.error("Failed to fetch FM2 Informasi:", err);
      } finally {
        this.isLoadingInfo = false;
      }
    },

    async fetchSkorMonitoring(uId: string) {
      this.isLoadingMonitoring = true;
      this.error = null;
      try {
        const config = useRuntimeConfig();
        const baseURL = (config.public.apiBaseUrl || 'http://localhost:3001') + '/api';
        const lang = (useNuxtApp().$i18n as any)?.locale?.value || "id";

        const response = await $fetch<{ data: ScoreResponse }>(`/fm2/unit-lingkup-periode-modul/${uId}/skor-monitoring`, {
          baseURL,
          credentials: "include",
          headers: { "Accept-Language": lang, "Authorization": `Bearer ${useNuxtApp().$pinia.state.value.auth?.accessToken || ""}` },
        });

        this.skorMonitoring = response.data;
      } catch (err: any) {
        if (err.response?.status !== 404) {
          this.error = err;
          console.error("Failed to fetch Skor Monitoring:", err);
        } else {
          this.skorMonitoring = null;
        }
      } finally {
        this.isLoadingMonitoring = false;
      }
    },

    async fetchSkorAspeks(uId: string) {
      this.isLoadingAspeks = true;
      this.error = null;
      try {
        const config = useRuntimeConfig();
        const baseURL = (config.public.apiBaseUrl || 'http://localhost:3001') + '/api';
        const lang = (useNuxtApp().$i18n as any)?.locale?.value || "id";

        const response = await $fetch<{ data: AspectScoreResponse[] }>(`/fm2/unit-lingkup-periode-modul/${uId}/skor-aspek`, {
          baseURL,
          credentials: "include",
          headers: { "Accept-Language": lang, "Authorization": `Bearer ${useNuxtApp().$pinia.state.value.auth?.accessToken || ""}` },
        });

        this.skorAspeks = response.data || [];
      } catch (err) {
        this.error = err;
        console.error("Failed to fetch Skor Aspeks:", err);
      } finally {
        this.isLoadingAspeks = false;
      }
    },

    async calculateSkorAspek(uId: string, aId: string) {
      this.isCalculating = true;
      this.error = null;
      try {
        const config = useRuntimeConfig();
        const baseURL = (config.public.apiBaseUrl || 'http://localhost:3001') + '/api';
        const lang = (useNuxtApp().$i18n as any)?.locale?.value || "id";

        const response = await $fetch<{ data: ScoreResponse }>(`/fm2/unit-lingkup-periode-modul/${uId}/aspek-periode-modul/${aId}/calculate-skor`, {
          method: 'POST',
          baseURL,
          credentials: "include",
          headers: { "Accept-Language": lang, "Authorization": `Bearer ${useNuxtApp().$pinia.state.value.auth?.accessToken || ""}` },
        });

        // Update skor in store list
        const aspect = this.skorAspeks.find(a => a.aspek_periode_modul_id === aId);
        if (aspect) {
          aspect.skor = response.data;
        }
        
        return response.data;
      } catch (err: any) {
        this.error = err;
        console.error("Failed to calculate Skor Aspek:", err);
        throw err;
      } finally {
        this.isCalculating = false;
      }
    },

    async calculateSkorMonitoring(uId: string) {
      this.isCalculating = true;
      this.error = null;
      try {
        const config = useRuntimeConfig();
        const baseURL = (config.public.apiBaseUrl || 'http://localhost:3001') + '/api';
        const lang = (useNuxtApp().$i18n as any)?.locale?.value || "id";

        const response = await $fetch<{ data: ScoreResponse }>(`/fm2/unit-lingkup-periode-modul/${uId}/calculate-skor`, {
          method: 'POST',
          baseURL,
          credentials: "include",
          headers: { "Accept-Language": lang, "Authorization": `Bearer ${useNuxtApp().$pinia.state.value.auth?.accessToken || ""}` },
        });

        this.skorMonitoring = response.data;
        return response.data;
      } catch (err: any) {
        this.error = err;
        console.error("Failed to calculate Skor Monitoring:", err);
        throw err;
      } finally {
        this.isCalculating = false;
      }
    },

    async checkIsAuditee(uId: string) {
      try {
        const config = useRuntimeConfig();
        const baseURL = (config.public.apiBaseUrl || 'http://localhost:3001') + '/api';
        const lang = (useNuxtApp().$i18n as any)?.locale?.value || "id";

        const response = await $fetch<{ data: { is_auditee: boolean } }>(`/periode-modul/unit-lingkup/${uId}/is-auditee`, {
          baseURL,
          credentials: "include",
          headers: { "Accept-Language": lang, "Authorization": `Bearer ${useNuxtApp().$pinia.state.value.auth?.accessToken || ""}` },
        });

        this.isAuditee = response.data.is_auditee;
      } catch (err) {
        console.error("Failed to check Is Auditee:", err);
        this.isAuditee = false;
      }
    }
  }
});
