import { defineStore } from "pinia";
import type { FMInformationResponse, AspekPeriodeModulResponse, UnitObjekTableResponse, IndikatorAndAnswerResponse, JawabInstrumenRequest, BuktiInstrumenDetailResponse } from "#types/fm1";
import { useRuntimeConfig, useNuxtApp } from "#imports";

export const useFm1Store = defineStore("fm1", {
  state: () => ({
    informasi: null as FMInformationResponse | null,
    aspeks: [] as AspekPeriodeModulResponse[],
    detailAspek: null as AspekPeriodeModulResponse | null,
    objekTable: null as UnitObjekTableResponse | null,
    jawabanIndikator: [] as IndikatorAndAnswerResponse[],
    buktiInstrumenList: [] as BuktiInstrumenDetailResponse[],
    buktiInstrumenMeta: null as any,
    isAuditee: null as boolean | null,
    isEvaluator: null as boolean | null,
    
    tablePage: 1,
    tableSearch: "",
    tableSortOrder: "asc" as "asc" | "desc",

    isLoadingInfo: false,
    isLoadingAspeks: false,
    isLoadingDetailAspek: false,
    isLoadingTable: false,
    isLoadingJawaban: false,
    isSavingJawaban: false,
    error: null as any,
  }),
  actions: {
    async fetchInformasi(pId: string, uId: string) {
      this.isLoadingInfo = true;
      this.error = null;
      try {
        const config = useRuntimeConfig();
        const baseURL = config.public.apiBaseUrl || config.public.apiBase || 'http://localhost:3001';
        const lang = (useNuxtApp().$i18n as any)?.locale?.value || "id";

        const response = await $fetch<{ data: FMInformationResponse }>(`/fm1/periode-modul/${pId}/unit-lingkup/${uId}/informasi`, {
          baseURL,
          credentials: "include",
          headers: { "Accept-Language": lang },
        });

        this.informasi = response.data;
      } catch (err) {
        this.error = err;
        console.error("Failed to fetch FM1 Informasi:", err);
      } finally {
        this.isLoadingInfo = false;
      }
    },

    async fetchAspeks(pId: string) {
      this.isLoadingAspeks = true;
      this.error = null;
      try {
        const config = useRuntimeConfig();
        const baseURL = config.public.apiBaseUrl || config.public.apiBase || 'http://localhost:3001';
        const lang = (useNuxtApp().$i18n as any)?.locale?.value || "id";

        const response = await $fetch<{ data: AspekPeriodeModulResponse[] }>(`/periode-modul/${pId}/aspek`, {
          baseURL,
          credentials: "include",
          headers: { "Accept-Language": lang },
          query: { size: 100 } // Get all aspects
        });

        this.aspeks = response.data || [];
      } catch (err) {
        this.error = err;
        console.error("Failed to fetch FM1 Aspeks:", err);
      } finally {
        this.isLoadingAspeks = false;
      }
    },

    async fetchDetailAspek(aId: string, uId: string) {
      this.isLoadingDetailAspek = true;
      this.error = null;
      try {
        const config = useRuntimeConfig();
        const baseURL = config.public.apiBaseUrl || config.public.apiBase || 'http://localhost:3001';
        const lang = (useNuxtApp().$i18n as any)?.locale?.value || "id";

        const response = await $fetch<{ data: AspekPeriodeModulResponse }>(`/fm1/aspek-periode-modul/${aId}/unit-lingkup-periode-modul/${uId}`, {
          baseURL,
          credentials: "include",
          headers: { "Accept-Language": lang },
        });

        this.detailAspek = response.data;
      } catch (err) {
        this.error = err;
        console.error("Failed to fetch FM1 Detail Aspek:", err);
      } finally {
        this.isLoadingDetailAspek = false;
      }
    },

    async fetchObjekTable(uId: string, objekId: string, page = 1) {
      this.isLoadingTable = true;
      this.error = null;
      this.tablePage = page;
      try {
        const config = useRuntimeConfig();
        const baseURL = config.public.apiBaseUrl || config.public.apiBase || 'http://localhost:3001';
        const lang = (useNuxtApp().$i18n as any)?.locale?.value || "id";

        const response = await $fetch<UnitObjekTableResponse>(`/fm1/unit-lingkup-periode-modul/${uId}/objek/${objekId}/unit-objek`, {
          baseURL,
          credentials: "include",
          headers: { "Accept-Language": lang },
          query: {
            page: this.tablePage,
            size: 10,
            search: this.tableSearch || undefined,
            order: this.tableSortOrder,
            is_all_evaluated: this.tableIsAllEvaluated || undefined,
            aspek_periode_modul_id: this.detailAspek?.id || undefined,
          }
        });

        this.objekTable = response;
      } catch (err) {
        this.error = err;
        console.error("Failed to fetch FM1 Objek Table:", err);
      } finally {
        this.isLoadingTable = false;
      }
    },

    async fetchJawaban(unitObjekId: string, aspekPeriodeModulId: string) {
      this.isLoadingJawaban = true;
      this.error = null;
      try {
        const config = useRuntimeConfig();
        const baseURL = config.public.apiBaseUrl || config.public.apiBase || 'http://localhost:3001';
        const lang = (useNuxtApp().$i18n as any)?.locale?.value || "id";

        const response = await $fetch<{ data: IndikatorAndAnswerResponse[] }>(`/fm1/aspek-periode-modul/${aspekPeriodeModulId}/unit-objek/${unitObjekId}/jawaban`, {
          baseURL,
          credentials: "include",
          headers: { "Accept-Language": lang },
        });

        this.jawabanIndikator = response.data || [];
      } catch (err) {
        this.error = err;
        console.error("Failed to fetch Jawaban Indikator:", err);
      } finally {
        this.isLoadingJawaban = false;
      }
    },

    async saveJawaban(indikatorPeriodeModulId: string, unitObjekId: string, payload: JawabInstrumenRequest) {
      this.isSavingJawaban = true;
      this.error = null;
      try {
        const config = useRuntimeConfig();
        const baseURL = config.public.apiBaseUrl || config.public.apiBase || 'http://localhost:3001';
        const lang = (useNuxtApp().$i18n as any)?.locale?.value || "id";

        const response = await $fetch<{ data: IndikatorAndAnswerResponse }>(`/fm1/indikator-periode-modul/${indikatorPeriodeModulId}/unit-objek/${unitObjekId}/jawab`, {
          method: 'POST',
          baseURL,
          credentials: "include",
          headers: { "Accept-Language": lang },
          body: payload
        });

        // Update the state array
        const index = this.jawabanIndikator.findIndex(j => j.id === response.data.id);
        if (index !== -1) {
          this.jawabanIndikator[index] = response.data;
        }

        return true;
      } catch (err) {
        this.error = err;
        console.error("Failed to save Jawaban Indikator:", err);
        return false;
      } finally {
        this.isSavingJawaban = false;
      }
    },

    async fetchBuktiInstrumenList(unitLingkupId: string, page: number = 1, size: number = 100) {
      try {
        const config = useRuntimeConfig();
        const baseURL = config.public.apiBaseUrl || config.public.apiBase || 'http://localhost:3001';
        const lang = (useNuxtApp().$i18n as any)?.locale?.value || "id";

        const response = await $fetch<{ data: BuktiInstrumenDetailResponse[], meta?: any }>(`/fm1/unit-lingkup/${unitLingkupId}/bukti`, {
          baseURL,
          credentials: "include",
          headers: { "Accept-Language": lang },
          query: { size, page }
        });

        this.buktiInstrumenList = response.data || [];
        if (response.meta) {
          this.buktiInstrumenMeta = response.meta;
        }
      } catch (err) {
        console.error("Failed to fetch Bukti Instrumen List:", err);
      }
    },

    async checkIsAuditee(unitLingkupId: string) {
      try {
        const config = useRuntimeConfig();
        const baseURL = config.public.apiBaseUrl || config.public.apiBase || 'http://localhost:3001';
        const lang = (useNuxtApp().$i18n as any)?.locale?.value || "id";

        const response = await $fetch<{ data: { is_auditee: boolean } }>(`/periode-modul/unit-lingkup/${unitLingkupId}/is-auditee`, {
          baseURL,
          credentials: "include",
          headers: { "Accept-Language": lang },
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
        const baseURL = config.public.apiBaseUrl || config.public.apiBase || 'http://localhost:3001';
        const lang = (useNuxtApp().$i18n as any)?.locale?.value || "id";

        const response = await $fetch<{ data: { is_evaluator: boolean } }>(`/periode-modul/unit-lingkup/${unitLingkupId}/is-evaluator`, {
          baseURL,
          credentials: "include",
          headers: { "Accept-Language": lang },
        });

        this.isEvaluator = response.data.is_evaluator;
      } catch (err) {
        console.error("Failed to check Is Evaluator:", err);
        this.isEvaluator = false;
      }
    },

    async simpanBuktiInstrumen(aspekPeriodeModulId: string, unitLingkupId: string, payload: { link: string, catatan: string }) {
      try {
        const config = useRuntimeConfig();
        const baseURL = config.public.apiBaseUrl || config.public.apiBase || 'http://localhost:3001';
        const lang = (useNuxtApp().$i18n as any)?.locale?.value || "id";

        await $fetch(`/fm1/aspek/${aspekPeriodeModulId}/unit-lingkup/${unitLingkupId}/bukti`, {
          method: 'POST',
          baseURL,
          credentials: "include",
          headers: { "Accept-Language": lang },
          body: payload
        });

        // Refresh list
        await this.fetchBuktiInstrumenList(unitLingkupId);
        return true;
      } catch (err) {
        console.error("Failed to save Bukti Instrumen:", err);
        return false;
      }
    }
  }
});
