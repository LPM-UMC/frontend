import { defineStore } from "pinia";
import type { ModulResponse } from "#types/modul";

export const useModulStore = defineStore("modul", {
  state: () => ({
    modulMonev: [] as ModulResponse[],
    monevPage: 1,
    monevTotalPages: 1,
    monevSearch: "",
    modulAmi: [] as ModulResponse[],
    amiPage: 1,
    amiTotalPages: 1,
    amiSearch: "",
    isLoading: false,
    error: null as any,
  }),
  actions: {
    async fetchModulMonev(loadMore = false) {
      if (this.isLoading) return;
      if (loadMore) {
        if (this.monevPage >= this.monevTotalPages) return;
        this.monevPage += 1;
      } else {
        this.monevPage = 1;
        this.modulMonev = [];
      }
      
      this.isLoading = true;
      this.error = null;
      try {
        const config = useRuntimeConfig();
        const baseURL = config.public.apiBaseUrl || config.public.apiBase || 'http://localhost:3001';

        const nuxtApp = useNuxtApp();
        const lang = (nuxtApp.$i18n as any)?.locale?.value || "id";

        const response = await $fetch<{ data: ModulResponse[], meta: any }>("/modul/monev", {
          baseURL,
          credentials: "include",
          headers: {
            "Accept-Language": lang,
          },
          query: {
            page: this.monevPage,
            size: 10,
            search: this.monevSearch || undefined,
          }
        });

        if (loadMore) {
          this.modulMonev.push(...(response.data || []));
        } else {
          this.modulMonev = response.data || [];
        }
        this.monevTotalPages = response.meta?.total_pages || 1;
      } catch (err) {
        this.error = err;
        console.error("Failed to fetch Modul MONEV:", err);
        if (loadMore) this.monevPage -= 1;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    async fetchModulAmi(loadMore = false) {
      if (this.isLoading) return;
      if (loadMore) {
        if (this.amiPage >= this.amiTotalPages) return;
        this.amiPage += 1;
      } else {
        this.amiPage = 1;
        this.modulAmi = [];
      }
      
      this.isLoading = true;
      this.error = null;
      try {
        const config = useRuntimeConfig();
        const baseURL = config.public.apiBaseUrl || config.public.apiBase || 'http://localhost:3001';

        const nuxtApp = useNuxtApp();
        const lang = (nuxtApp.$i18n as any)?.locale?.value || "id";

        const response = await $fetch<{ data: ModulResponse[], meta: any }>("/modul/ami", {
          baseURL,
          credentials: "include",
          headers: {
            "Accept-Language": lang,
          },
          query: {
            page: this.amiPage,
            size: 10,
            search: this.amiSearch || undefined,
          }
        });

        if (loadMore) {
          this.modulAmi.push(...(response.data || []));
        } else {
          this.modulAmi = response.data || [];
        }
        this.amiTotalPages = response.meta?.total_pages || 1;
      } catch (err) {
        this.error = err;
        console.error("Failed to fetch Modul AMI:", err);
        if (loadMore) this.amiPage -= 1;
        throw err;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
