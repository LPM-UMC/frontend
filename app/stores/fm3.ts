import { defineStore } from "pinia";
import type { FMInformationResponse } from "#types/fm1";
import type { TemuanResponse } from "#types/fm03-temuan";
import { useRuntimeConfig, useNuxtApp } from "#imports";

export const useFm3Store = defineStore("fm3", {
  state: () => ({
    informasi: null as FMInformationResponse | null,
    temuanList: [] as TemuanResponse[],
    temuanMeta: {
      total: 0,
      page: 1,
      size: 10,
      total_pages: 1
    },
    
    tablePage: 1,
    tableSearch: "",
    tableSortOrder: "asc" as "asc" | "desc",

    isAuditee: null as boolean | null,
    isEvaluator: null as boolean | null,

    isLoadingInfo: false,
    isLoadingTemuan: false,
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

        const response = await $fetch<{ data: FMInformationResponse }>(`/fm3/periode-modul/${pId}/unit-lingkup-periode-modul/${uId}/informasi`, {
          baseURL,
          credentials: "include",
          headers: { "Accept-Language": lang, "Authorization": `Bearer ${useNuxtApp().$pinia.state.value.auth?.accessToken || ""}` },
        });

        this.informasi = response.data;
      } catch (err) {
        this.error = err;
        console.error("Failed to fetch FM3 Informasi:", err);
      } finally {
        this.isLoadingInfo = false;
      }
    },

    async fetchTemuan(uId: string, page = 1, fetchUnvalidatedOnly = false) {
      this.isLoadingTemuan = true;
      this.error = null;
      this.tablePage = page;
      try {
        const config = useRuntimeConfig();
        const baseURL = (config.public.apiBaseUrl || 'http://localhost:3001') + '/api';
        const lang = (useNuxtApp().$i18n as any)?.locale?.value || "id";

        const endpoint = fetchUnvalidatedOnly 
          ? `/fm3/unit-lingkup-periode-modul/${uId}/temuan/belum-divalidasi`
          : `/fm3/unit-lingkup-periode-modul/${uId}/temuan`;

        const response = await $fetch<{ data: TemuanResponse[], meta: any }>(endpoint, {
          baseURL,
          credentials: "include",
          headers: { "Accept-Language": lang, "Authorization": `Bearer ${useNuxtApp().$pinia.state.value.auth?.accessToken || ""}` },
          query: {
            page: this.tablePage,
            size: 10,
            search: this.tableSearch || undefined,
            order: this.tableSortOrder,
          }
        });

        this.temuanList = response.data || [];
        this.temuanMeta = response.meta || { total: 0, page: 1, size: 10, total_pages: 1 };
      } catch (err) {
        this.error = err;
        console.error("Failed to fetch FM3 Temuan:", err);
      } finally {
        this.isLoadingTemuan = false;
      }
    },

    async checkIsAuditee(unitLingkupId: string) {
      try {
        const config = useRuntimeConfig();
        const baseURL = (config.public.apiBaseUrl || 'http://localhost:3001') + '/api';
        const lang = (useNuxtApp().$i18n as any)?.locale?.value || "id";

        const response = await $fetch<{ data: { is_auditee: boolean } }>(`/periode-modul/unit-lingkup/${unitLingkupId}/is-auditee`, {
          baseURL,
          credentials: "include",
          headers: { "Accept-Language": lang, "Authorization": `Bearer ${useNuxtApp().$pinia.state.value.auth?.accessToken || ""}` },
        });

        this.isAuditee = response.data.is_auditee;
      } catch (err) {
        console.error("Failed to check Is Auditee:", err);
        this.isAuditee = false;
      }
    },

    async checkIsEvaluator(unitLingkupId: string) {
      try {
        const config = useRuntimeConfig();
        const baseURL = (config.public.apiBaseUrl || 'http://localhost:3001') + '/api';
        const lang = (useNuxtApp().$i18n as any)?.locale?.value || "id";

        const response = await $fetch<{ data: { is_evaluator: boolean } }>(`/periode-modul/unit-lingkup/${unitLingkupId}/is-evaluator`, {
          baseURL,
          credentials: "include",
          headers: { "Accept-Language": lang, "Authorization": `Bearer ${useNuxtApp().$pinia.state.value.auth?.accessToken || ""}` },
        });

        this.isEvaluator = response.data.is_evaluator;
      } catch (err) {
        console.error("Failed to check Is Evaluator:", err);
        this.isEvaluator = false;
      }
    }
  }
});
