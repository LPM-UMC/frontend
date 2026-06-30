import { defineStore } from "pinia";
import type { FMInformationResponse } from "#types/fm1";
import { useRuntimeConfig, useNuxtApp } from "#imports";

export const useFm5Store = defineStore("fm5", {
  state: () => ({
    informasi: null as FMInformationResponse | null,
    isLoadingInfo: false,
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

        // FM5 uses the same informasi endpoint as FM1 for general periode-modul info
        const response = await $fetch<{ data: FMInformationResponse }>(`/fm1/periode-modul/${pId}/unit-lingkup/${uId}/informasi`, {
          baseURL,
          credentials: "include",
          headers: { "Accept-Language": lang, "Authorization": `Bearer ${useNuxtApp().$pinia.state.value.auth?.accessToken || ""}` },
        });

        this.informasi = response.data;
      } catch (err) {
        this.error = err;
        console.error("Failed to fetch FM5 Informasi:", err);
      } finally {
        this.isLoadingInfo = false;
      }
    },
  }
});
