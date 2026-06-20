import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { useRuntimeConfig, useNuxtApp } from "nuxt/app";

import type {
  IndikatorResponse,
  CreateIndikatorRequest,
  UpdateIndikatorRequest,
} from "#types/indikator-evaluasi";

export const useIndikatorStore = defineStore("indikator", {
  state: () => ({
    indikators: [] as IndikatorResponse[],
    indikator: null as IndikatorResponse | null,
    meta: null as {
      total: number;
      page: number;
      size: number;
      total_pages: number;
    } | null,

    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    // ================= GET LIST INDIKATOR PER OBJEK =================
    async fetchIndikators(
      objekId: string,
      params?: {
        page?: number;
        size?: number;
        search?: string;
        order?: "asc" | "desc";
      }
    ) {
      const config = useRuntimeConfig();
      const auth = useAuthStore();
      const nuxtApp = useNuxtApp();
      const lang = (nuxtApp.$i18n as any)?.locale?.value || "id";

      this.isLoading = true;
      this.error = null;

      try {
        const query = new URLSearchParams();

        if (params?.page) query.append("page", String(params.page));
        if (params?.size) query.append("size", String(params.size));
        if (params?.search) query.append("search", params.search);
        if (params?.order) query.append("order", params.order);

        const res = await $fetch<{
          data: IndikatorResponse[];
          paging: { total_page: number; current_page: number; size: number };
        }>(
          `/api/objek/${objekId}/indikator?${query.toString()}`,
          {
            baseURL: config.public.apiBaseUrl || 'http://localhost:3001',
            headers: {
              "Accept-Language": lang,
              ...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
            },
          }
        );

        this.indikators = res.data;
        // Mapping paging response from indikator API to our meta structure if needed,
        // The README specifies "paging: { current_page, total_page, size }" for this endpoint.
        this.meta = {
          total: 0, // Not provided in example
          page: res.paging?.current_page || 1,
          size: res.paging?.size || 10,
          total_pages: res.paging?.total_page || 1,
        };

        return res;
      } catch (err: any) {
        this.error = err?.data?.errors || err?.data?.message || "Gagal mengambil daftar indikator";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    // ================= GET DETAIL =================
    async fetchIndikatorById(indikatorId: string) {
      const config = useRuntimeConfig();
      const auth = useAuthStore();
      const nuxtApp = useNuxtApp();
      const lang = (nuxtApp.$i18n as any)?.locale?.value || "id";

      this.isLoading = true;
      this.error = null;

      try {
        const res = await $fetch<{ data: IndikatorResponse }>(
          `/api/indikator/${indikatorId}`,
          {
            baseURL: config.public.apiBaseUrl || 'http://localhost:3001',
            headers: {
              "Accept-Language": lang,
              ...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
            },
          }
        );

        this.indikator = res.data;

        return res.data;
      } catch (err: any) {
        this.error = err?.data?.errors || err?.data?.message || "Gagal mengambil detail indikator";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    // ================= CREATE =================
    async createIndikator(
      objekId: string,
      payload: CreateIndikatorRequest
    ) {
      const config = useRuntimeConfig();
      const auth = useAuthStore();
      const nuxtApp = useNuxtApp();
      const lang = (nuxtApp.$i18n as any)?.locale?.value || "id";

      this.isLoading = true;
      this.error = null;

      try {
        const res = await $fetch<{ data: IndikatorResponse }>(
          `/api/objek/${objekId}/indikator`,
          {
            method: "POST",
            baseURL: config.public.apiBaseUrl || 'http://localhost:3001',
            headers: {
              "Accept-Language": lang,
              ...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
            },
            body: payload,
          }
        );

        this.indikators.unshift(res.data);

        return res.data;
      } catch (err: any) {
        this.error = err?.data?.errors || err?.data?.message || "Gagal membuat indikator";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    // ================= UPDATE =================
    async updateIndikator(
      indikatorId: string,
      payload: UpdateIndikatorRequest
    ) {
      const config = useRuntimeConfig();
      const auth = useAuthStore();
      const nuxtApp = useNuxtApp();
      const lang = (nuxtApp.$i18n as any)?.locale?.value || "id";

      this.isLoading = true;
      this.error = null;

      try {
        const res = await $fetch<{ data: IndikatorResponse }>(
          `/api/indikator/${indikatorId}`,
          {
            method: "PUT",
            baseURL: config.public.apiBaseUrl || 'http://localhost:3001',
            headers: {
              "Accept-Language": lang,
              ...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
            },
            body: payload,
          }
        );

        // update list
        this.indikators = this.indikators.map((i) =>
          i.id === indikatorId ? res.data : i
        );

        // update detail
        if (this.indikator?.id === indikatorId) {
          this.indikator = res.data;
        }

        return res.data;
      } catch (err: any) {
        this.error = err?.data?.errors || err?.data?.message || "Gagal mengupdate indikator";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    // ================= DELETE =================
    async deleteIndikator(indikatorId: string) {
      const config = useRuntimeConfig();
      const auth = useAuthStore();
      const nuxtApp = useNuxtApp();
      const lang = (nuxtApp.$i18n as any)?.locale?.value || "id";

      this.isLoading = true;
      this.error = null;

      try {
        await $fetch(
          `/api/indikator/${indikatorId}`,
          {
            method: "DELETE",
            baseURL: config.public.apiBaseUrl || 'http://localhost:3001',
            headers: {
              "Accept-Language": lang,
              ...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
            },
          }
        );

        // remove dari state list
        this.indikators = this.indikators.filter((i) => i.id !== indikatorId);
        if (this.indikator?.id === indikatorId) {
          this.indikator = null;
        }

      } catch (err: any) {
        this.error = err?.data?.errors || err?.data?.message || "Gagal menghapus indikator";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
